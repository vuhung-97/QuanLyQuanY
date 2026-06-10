"""move ngay_nhap_ngu from phieu_kham_suc_khoe to quan_nhan

Revision ID: 20260610_000006
Revises: 20260610_000005
Create Date: 2026-06-10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260610_000006"
down_revision: str | None = "20260610_000005"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("quan_nhan", sa.Column("ngay_nhap_ngu", sa.Date(), nullable=True))

    op.execute(
        """
        UPDATE quan_nhan
        SET ngay_nhap_ngu = sub.ngay_nhap_ngu
        FROM (
            SELECT DISTINCT ON (ma_quan_nhan) ma_quan_nhan, ngay_nhap_ngu
            FROM phieu_kham_suc_khoe
            WHERE ngay_nhap_ngu IS NOT NULL
            ORDER BY ma_quan_nhan
        ) sub
        WHERE quan_nhan.ma_quan_nhan = sub.ma_quan_nhan
        """
    )

    op.drop_column("phieu_kham_suc_khoe", "ngay_nhap_ngu")


def downgrade() -> None:
    op.add_column("phieu_kham_suc_khoe", sa.Column("ngay_nhap_ngu", sa.Date(), nullable=True))

    op.execute(
        """
        UPDATE phieu_kham_suc_khoe
        SET ngay_nhap_ngu = qn.ngay_nhap_ngu
        FROM quan_nhan qn
        WHERE phieu_kham_suc_khoe.ma_quan_nhan = qn.ma_quan_nhan
        AND qn.ngay_nhap_ngu IS NOT NULL
        """
    )

    op.drop_column("quan_nhan", "ngay_nhap_ngu")
