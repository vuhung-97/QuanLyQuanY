"""kho duoc v1: add phieu_nhap_kho, chi_tiet_phieu_nhap_kho, update columns, drop so_nhap_xuat + ra_benh_xa

Revision ID: 20260630_000003
Revises: 20260630_000002
Create Date: 2026-06-30

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "20260630_000003"
down_revision: Union[str, None] = "20260630_000002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create phieu_nhap_kho
    op.create_table(
        "phieu_nhap_kho",
        sa.Column("ma_phieu_nhap", sa.String(10), primary_key=True),
        sa.Column("ma_phieu_du_tru", sa.String(10), nullable=True),
        sa.Column("ngay_nhap", sa.Date(), server_default=sa.func.current_date(), nullable=True),
        sa.Column("nguoi_nhap", sa.String(10), nullable=True),
        sa.Column("ghi_chu", sa.Text(), nullable=True),
    )

    # 2. Create chi_tiet_phieu_nhap_kho
    op.create_table(
        "chi_tiet_phieu_nhap_kho",
        sa.Column("ma_phieu_nhap", sa.String(10), sa.ForeignKey("phieu_nhap_kho.ma_phieu_nhap", ondelete="CASCADE"), primary_key=True),
        sa.Column("ma_thuoc_vtyt", sa.String(10), sa.ForeignKey("thuoc_vtyt.ma_thuoc_vtyt", ondelete="RESTRICT"), primary_key=True),
        sa.Column("so_luong", sa.Integer(), nullable=False),
        sa.Column("so_lo", sa.String(100), nullable=True),
        sa.Column("han_su_dung", sa.Date(), nullable=True),
        sa.Column("don_gia", sa.Numeric(15, 2), nullable=True),
    )

    # 3. ALTER thuoc_vtyt — add 4 columns
    op.add_column("thuoc_vtyt", sa.Column("han_su_dung", sa.Date(), nullable=True))
    op.add_column("thuoc_vtyt", sa.Column("don_gia", sa.Numeric(15, 2), nullable=True))
    op.add_column("thuoc_vtyt", sa.Column("nha_san_xuat", sa.String(255), nullable=True))
    op.add_column("thuoc_vtyt", sa.Column("hoat_chat", sa.String(255), nullable=True))

    # 4. ALTER phieu_du_tru — add 3 columns
    op.add_column("phieu_du_tru", sa.Column("trang_thai", sa.String(50), nullable=True))
    op.add_column("phieu_du_tru", sa.Column("ma_don_vi", sa.String(10), sa.ForeignKey("don_vi.ma_don_vi", ondelete="SET NULL"), nullable=True))
    op.add_column("phieu_du_tru", sa.Column("nguoi_lap", sa.String(10), nullable=True))

    # 5. ALTER phieu_xuat_kho — add 3 columns
    op.add_column("phieu_xuat_kho", sa.Column("trang_thai", sa.String(50), nullable=True))
    op.add_column("phieu_xuat_kho", sa.Column("nguoi_xuat", sa.String(10), nullable=True))
    op.add_column("phieu_xuat_kho", sa.Column("nguoi_duyet", sa.String(10), nullable=True))

    # 6. Copy data from so_nhap_xuat -> phieu_nhap_kho (group by nothing, create one receipt)
    conn = op.get_bind()
    rows = conn.execute(
        sa.text("SELECT ma_thuoc_vtyt, so_luong_nhap, so_luong_xuat, ngay_nhap_xuat, don_gia, ghi_chu FROM so_nhap_xuat")
    ).fetchall() if conn.dialect.has_table(conn, "so_nhap_xuat") else []

    if rows:
        import datetime
        today = datetime.date.today()
        for row in rows:
            ma_thuoc = row[0]
            sl_nhap = row[1] or 0
            sl_xuat = row[2] or 0
            ngay = row[3] if row[3] else today
            don_gia = row[4]
            ghi_chu = row[5]

            if sl_nhap > 0:
                from app.services.id_helper import generate_id
                ma_phieu = generate_id()
                conn.execute(
                    sa.text(
                        "INSERT INTO phieu_nhap_kho (ma_phieu_nhap, ngay_nhap, ghi_chu) VALUES (:ma, :ngay, :ghi)"
                    ).bindparams(ma=ma_phieu, ngay=ngay, ghi=ghi_chu)
                )
                conn.execute(
                    sa.text(
                        "INSERT INTO chi_tiet_phieu_nhap_kho (ma_phieu_nhap, ma_thuoc_vtyt, so_luong, don_gia) VALUES (:ma, :thuoc, :sl, :dg)"
                    ).bindparams(ma=ma_phieu, thuoc=ma_thuoc, sl=sl_nhap, dg=don_gia)
                )

    # 7. Drop tables
    op.drop_table("so_nhap_xuat")
    op.drop_table("ra_benh_xa")

    # 8. Delete old permissions (so_nhap_xuat, ra_benh_xa)
    old_resources = ["so_nhap_xuat", "ra_benh_xa"]
    for res in old_resources:
        for act in ["read", "create", "update", "delete"]:
            perm = f"{res}:{act}"
            op.execute(sa.text("DELETE FROM vai_tro_quyen WHERE id_quyen = :p").bindparams(p=perm))
            op.execute(sa.text("DELETE FROM quyen WHERE id = :p").bindparams(p=perm))

    # 9. Insert new permissions (phieu_nhap_kho, chi_tiet_phieu_nhap_kho)
    new_resources = ["phieu_nhap_kho", "chi_tiet_phieu_nhap_kho"]
    for res in new_resources:
        for act in ["read", "create", "update", "delete"]:
            perm = f"{res}:{act}"
            op.execute(sa.text("INSERT INTO quyen (id, ten_quyen) VALUES (:id, :ten) ON CONFLICT (id) DO NOTHING").bindparams(id=perm, ten=perm))

    # 10. Grant new permissions to admin role
    admin_role = conn.execute(
        sa.text("SELECT id FROM vai_tro WHERE id = 'admin'")
    ).scalar()
    if admin_role:
        for res in new_resources:
            for act in ["read", "create", "update", "delete"]:
                perm = f"{res}:{act}"
                op.execute(
                    sa.text("INSERT INTO vai_tro_quyen (id_vai_tro, id_quyen) VALUES ('admin', :p) ON CONFLICT DO NOTHING").bindparams(p=perm)
                )


def downgrade() -> None:
    # Reverse permissions: delete new, restore old
    new_resources = ["phieu_nhap_kho", "chi_tiet_phieu_nhap_kho"]
    for res in new_resources:
        for act in ["read", "create", "update", "delete"]:
            perm = f"{res}:{act}"
            op.execute(sa.text("DELETE FROM vai_tro_quyen WHERE id_quyen = :p").bindparams(p=perm))
            op.execute(sa.text("DELETE FROM quyen WHERE id = :p").bindparams(p=perm))

    old_resources = ["so_nhap_xuat", "ra_benh_xa"]
    for res in old_resources:
        for act in ["read", "create", "update", "delete"]:
            perm = f"{res}:{act}"
            op.execute(sa.text("INSERT INTO quyen (id, ten_quyen) VALUES (:id, :ten) ON CONFLICT (id) DO NOTHING").bindparams(id=perm, ten=perm))

    conn = op.get_bind()
    admin_role = conn.execute(
        sa.text("SELECT id FROM vai_tro WHERE id = 'admin'")
    ).scalar()
    if admin_role:
        for res in old_resources:
            for act in ["read", "create", "update", "delete"]:
                perm = f"{res}:{act}"
                op.execute(
                    sa.text("INSERT INTO vai_tro_quyen (id_vai_tro, id_quyen) VALUES ('admin', :p) ON CONFLICT DO NOTHING").bindparams(p=perm)
                )

    # Recreate tables
    op.create_table(
        "ra_benh_xa",
        sa.Column("ma_ra_benh_xa", sa.String(10), primary_key=True),
        sa.Column("ma_benh_an", sa.String(10), sa.ForeignKey("benh_an.ma_benh_an", ondelete="CASCADE"), nullable=True),
        sa.Column("thoi_gian_vao", sa.DateTime(), nullable=True),
        sa.Column("thoi_gian_ra", sa.DateTime(), nullable=True),
        sa.Column("phuong_phap_dieu_tri", sa.Text(), nullable=True),
        sa.Column("ghi_chu", sa.Text(), nullable=True),
    )

    op.create_table(
        "so_nhap_xuat",
        sa.Column("ma_giao_dich", sa.String(10), primary_key=True),
        sa.Column("ma_thuoc_vtyt", sa.String(10), sa.ForeignKey("thuoc_vtyt.ma_thuoc_vtyt", ondelete="RESTRICT"), nullable=True),
        sa.Column("quy_cach", sa.String(255), nullable=True),
        sa.Column("don_gia", sa.Numeric(15, 2), nullable=True),
        sa.Column("ngay_nhap_xuat", sa.DateTime(), nullable=True),
        sa.Column("ten_don_vi_doi_tac", sa.String(255), nullable=True),
        sa.Column("so_xuat_nhap_lenh", sa.String(100), nullable=True),
        sa.Column("so_luong_nhap", sa.Integer(), default=0, nullable=True),
        sa.Column("so_luong_xuat", sa.Integer(), default=0, nullable=True),
        sa.Column("so_luong_con_lai", sa.Integer(), default=0, nullable=True),
        sa.Column("ghi_chu", sa.Text(), nullable=True),
    )

    # Drop added columns
    op.drop_column("phieu_xuat_kho", "nguoi_duyet")
    op.drop_column("phieu_xuat_kho", "nguoi_xuat")
    op.drop_column("phieu_xuat_kho", "trang_thai")
    op.drop_column("phieu_du_tru", "nguoi_lap")
    op.drop_column("phieu_du_tru", "ma_don_vi")
    op.drop_column("phieu_du_tru", "trang_thai")
    op.drop_column("thuoc_vtyt", "hoat_chat")
    op.drop_column("thuoc_vtyt", "nha_san_xuat")
    op.drop_column("thuoc_vtyt", "don_gia")
    op.drop_column("thuoc_vtyt", "han_su_dung")

    op.drop_table("chi_tiet_phieu_nhap_kho")
    op.drop_table("phieu_nhap_kho")
