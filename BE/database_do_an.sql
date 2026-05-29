CREATE TABLE "don_vi" (
  "ma_don_vi" "VARCHAR(10)" PRIMARY KEY,
  "ten_don_vi" "VARCHAR(255)" NOT NULL,
  "ma_don_vi_truc_thuoc" "VARCHAR(10)"
);

CREATE TABLE "quan_nhan" (
  "ma_quan_nhan" "VARCHAR(10)" PRIMARY KEY,
  "ma_don_vi" "VARCHAR(10)",
  "ho_ten" "VARCHAR(255)" NOT NULL,
  "cap_bac" "VARCHAR(100)",
  "chuc_vu" "VARCHAR(100)",
  "ngay_sinh" DATE,
  "dia_chi" TEXT,
  "so_dien_thoai" "VARCHAR(20)",
  "so_the_bhyt" "VARCHAR(50)",
  "han_bhyt" DATE
);

CREATE TABLE "thuoc_vtyt" (
  "ma_thuoc_vtyt" "VARCHAR(10)" PRIMARY KEY,
  "ten_thuoc_vtyt" "VARCHAR(255)" NOT NULL,
  "don_vi_tinh" "VARCHAR(50)",
  "so_luong" INT DEFAULT 0,
  "so_lo_han_dung" "VARCHAR(255)",
  "nam_san_xuat" INT,
  "cap_chat_luong" "VARCHAR(100)"
);

CREATE TABLE "lich_kham_sk_nam" (
  "ma_lich_kham" "VARCHAR(10)" PRIMARY KEY,
  "ma_don_vi" "VARCHAR(10)",
  "thoi_gian_bat_dau" TIMESTAMP,
  "thoi_gian_ket_thuc" TIMESTAMP,
  "dia_diem" TEXT
);

CREATE TABLE "phieu_kham_suc_khoe" (
  "ma_phieu_kham" "VARCHAR(10)" PRIMARY KEY,
  "ma_quan_nhan" "VARCHAR(10)",
  "ngay_nhap_ngu" DATE,
  "tien_su_benh_tat" TEXT,
  "kham_lam_sang" TEXT,
  "kham_can_lam_sang" TEXT,
  "ket_luan" TEXT,
  "chi_dan_can_thiet" TEXT
);

CREATE TABLE "kham_benh" (
  "ma_kham_benh" "VARCHAR(10)" PRIMARY KEY,
  "ma_quan_nhan" "VARCHAR(10)",
  "trieu_chung_chan_doan" TEXT,
  "phuong_phap_dieu_tri" TEXT,
  "kham_lan" INT,
  "ket_qua" TEXT
);

CREATE TABLE "don_thuoc" (
  "ma_don_thuoc" "VARCHAR(10)" PRIMARY KEY,
  "ma_quan_nhan" "VARCHAR(10)",
  "gioi_tinh" "VARCHAR(20)",
  "chan_doan" TEXT
);

CREATE TABLE "chi_tiet_don_thuoc" (
  "ma_don_thuoc" "VARCHAR(10)",
  "ma_thuoc_vtyt" "VARCHAR(10)",
  "so_luong" INT NOT NULL DEFAULT 1,
  "huong_dieu_tri" TEXT,
  PRIMARY KEY ("ma_don_thuoc", "ma_thuoc_vtyt")
);

CREATE TABLE "benh_an" (
  "ma_benh_an" "VARCHAR(10)" PRIMARY KEY,
  "ma_quan_nhan" "VARCHAR(10)",
  "gioi_tinh" "VARCHAR(20)",
  "nghe_nghiep" "VARCHAR(100)",
  "dan_toc" "VARCHAR(50)",
  "ngoai_kieu" "VARCHAR(100)",
  "doi_tuong" "VARCHAR(100)",
  "quan_ly_nguoi_benh" TEXT,
  "chan_doan" TEXT,
  "tinh_trang_ra_vien" TEXT,
  "chi_tiet_benh_an" TEXT,
  "tong_ket_benh_an" TEXT
);

CREATE TABLE "benh_nhan_ra_vao" (
  "ma_ra_vao" "VARCHAR(10)" PRIMARY KEY,
  "ma_benh_an" "VARCHAR(10)",
  "ngay_thang_nam" DATE DEFAULT (CURRENT_DATE),
  "ly_do" TEXT,
  "ngay_vao" DATE,
  "ngay_ra" DATE
);

CREATE TABLE "phieu_cham_soc" (
  "ma_phieu_cs" "VARCHAR(10)" PRIMARY KEY,
  "ma_benh_an" "VARCHAR(10)",
  "so_giuong" "VARCHAR(50)",
  "buong" "VARCHAR(50)",
  "thoi_gian" TIMESTAMP,
  "theo_doi_dien_bien" TEXT,
  "thuc_hien_y_lenh" TEXT
);

CREATE TABLE "chi_tiet_phieu_cham_soc" (
  "ma_phieu_cs" "VARCHAR(10)",
  "ma_thuoc_vtyt" "VARCHAR(10)",
  "so_luong" INT NOT NULL DEFAULT 1,
  PRIMARY KEY ("ma_phieu_cs", "ma_thuoc_vtyt")
);

CREATE TABLE "ra_benh_xa" (
  "ma_ra_benh_xa" "VARCHAR(10)" PRIMARY KEY,
  "ma_benh_an" "VARCHAR(10)",
  "thoi_gian_vao" TIMESTAMP,
  "thoi_gian_ra" TIMESTAMP,
  "phuong_phap_dieu_tri" TEXT,
  "ghi_chu" TEXT
);

CREATE TABLE "di_tuyen_sau_dieu_tri" (
  "ma_chuyen_tuyen" "VARCHAR(10)" PRIMARY KEY,
  "ma_quan_nhan" "VARCHAR(10)",
  "ngay_di" DATE,
  "chan_doan_luc_di" TEXT,
  "ngay_ve" DATE,
  "chan_doan_luc_ve" TEXT,
  "ket_qua_huong_dieu_tri" TEXT,
  "noi_dieu_tri" "VARCHAR(255)"
);

CREATE TABLE "giay_gioi_thieu" (
  "ma_giay_gt" "VARCHAR(10)" PRIMARY KEY,
  "ma_quan_nhan" "VARCHAR(10)",
  "ten_benh_vien" "VARCHAR(255)",
  "so_suc_khoe" "VARCHAR(100)",
  "can_benh" TEXT,
  "y_kien_de_nghi" TEXT,
  "thoi_gian_den_benh_vien" TIMESTAMP,
  "chan_doan" TEXT,
  "quyet_dinh_y_sinh" TEXT
);

CREATE TABLE "phieu_du_tru" (
  "ma_phieu_du_tru" "VARCHAR(10)" PRIMARY KEY,
  "ngay_lap_phieu" DATE DEFAULT (CURRENT_DATE),
  "ghi_chu" TEXT
);

CREATE TABLE "chi_tiet_du_tru" (
  "ma_phieu_du_tru" "VARCHAR(10)",
  "ma_thuoc_vtyt" "VARCHAR(10)",
  "so_luong" INT NOT NULL DEFAULT 1,
  PRIMARY KEY ("ma_phieu_du_tru", "ma_thuoc_vtyt")
);

CREATE TABLE "so_nhap_xuat" (
  "ma_giao_dich" "VARCHAR(10)" PRIMARY KEY,
  "ma_thuoc_vtyt" "VARCHAR(10)",
  "quy_cach" "VARCHAR(255)",
  "don_gia" "DECIMAL(15,2)",
  "ngay_nhap_xuat" TIMESTAMP,
  "ten_don_vi_doi_tac" "VARCHAR(255)",
  "so_xuat_nhap_lenh" "VARCHAR(100)",
  "so_luong_nhap" INT DEFAULT 0,
  "so_luong_xuat" INT DEFAULT 0,
  "so_luong_con_lai" INT DEFAULT 0,
  "ghi_chu" TEXT
);

CREATE TABLE "phieu_xuat_kho" (
  "ma_phieu_xuat" "VARCHAR(10)" PRIMARY KEY,
  "ma_don_vi_nhan" "VARCHAR(10)",
  "ngay_thang_nam" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  "ho_ten_nguoi_nhan" "VARCHAR(255)",
  "ly_do_xuat" TEXT,
  "ghi_chu" TEXT
);

CREATE TABLE "chi_tiet_xuat_kho" (
  "ma_phieu_xuat" "VARCHAR(10)",
  "ma_thuoc_vtyt" "VARCHAR(10)",
  "so_luong" INT NOT NULL,
  PRIMARY KEY ("ma_phieu_xuat", "ma_thuoc_vtyt")
);

ALTER TABLE "don_vi" ADD FOREIGN KEY ("ma_don_vi_truc_thuoc") REFERENCES "don_vi" ("ma_don_vi") ON DELETE SET NULL DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "quan_nhan" ADD FOREIGN KEY ("ma_don_vi") REFERENCES "don_vi" ("ma_don_vi") ON DELETE SET NULL DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "lich_kham_sk_nam" ADD FOREIGN KEY ("ma_don_vi") REFERENCES "don_vi" ("ma_don_vi") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "phieu_kham_suc_khoe" ADD FOREIGN KEY ("ma_quan_nhan") REFERENCES "quan_nhan" ("ma_quan_nhan") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "kham_benh" ADD FOREIGN KEY ("ma_quan_nhan") REFERENCES "quan_nhan" ("ma_quan_nhan") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "don_thuoc" ADD FOREIGN KEY ("ma_quan_nhan") REFERENCES "quan_nhan" ("ma_quan_nhan") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "chi_tiet_don_thuoc" ADD FOREIGN KEY ("ma_don_thuoc") REFERENCES "don_thuoc" ("ma_don_thuoc") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "chi_tiet_don_thuoc" ADD FOREIGN KEY ("ma_thuoc_vtyt") REFERENCES "thuoc_vtyt" ("ma_thuoc_vtyt") ON DELETE RESTRICT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "benh_an" ADD FOREIGN KEY ("ma_quan_nhan") REFERENCES "quan_nhan" ("ma_quan_nhan") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "benh_nhan_ra_vao" ADD FOREIGN KEY ("ma_benh_an") REFERENCES "benh_an" ("ma_benh_an") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "phieu_cham_soc" ADD FOREIGN KEY ("ma_benh_an") REFERENCES "benh_an" ("ma_benh_an") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "chi_tiet_phieu_cham_soc" ADD FOREIGN KEY ("ma_phieu_cs") REFERENCES "phieu_cham_soc" ("ma_phieu_cs") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "chi_tiet_phieu_cham_soc" ADD FOREIGN KEY ("ma_thuoc_vtyt") REFERENCES "thuoc_vtyt" ("ma_thuoc_vtyt") ON DELETE RESTRICT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ra_benh_xa" ADD FOREIGN KEY ("ma_benh_an") REFERENCES "benh_an" ("ma_benh_an") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "di_tuyen_sau_dieu_tri" ADD FOREIGN KEY ("ma_quan_nhan") REFERENCES "quan_nhan" ("ma_quan_nhan") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "giay_gioi_thieu" ADD FOREIGN KEY ("ma_quan_nhan") REFERENCES "quan_nhan" ("ma_quan_nhan") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "chi_tiet_du_tru" ADD FOREIGN KEY ("ma_phieu_du_tru") REFERENCES "phieu_du_tru" ("ma_phieu_du_tru") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "chi_tiet_du_tru" ADD FOREIGN KEY ("ma_thuoc_vtyt") REFERENCES "thuoc_vtyt" ("ma_thuoc_vtyt") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "so_nhap_xuat" ADD FOREIGN KEY ("ma_thuoc_vtyt") REFERENCES "thuoc_vtyt" ("ma_thuoc_vtyt") ON DELETE RESTRICT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "phieu_xuat_kho" ADD FOREIGN KEY ("ma_don_vi_nhan") REFERENCES "don_vi" ("ma_don_vi") ON DELETE SET NULL DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "chi_tiet_xuat_kho" ADD FOREIGN KEY ("ma_phieu_xuat") REFERENCES "phieu_xuat_kho" ("ma_phieu_xuat") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "chi_tiet_xuat_kho" ADD FOREIGN KEY ("ma_thuoc_vtyt") REFERENCES "thuoc_vtyt" ("ma_thuoc_vtyt") ON DELETE RESTRICT DEFERRABLE INITIALLY IMMEDIATE;
