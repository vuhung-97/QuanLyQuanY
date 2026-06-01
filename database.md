-- 1. Tạo bảng quyen (Quyền)
CREATE TABLE quyen (
id VARCHAR(20) PRIMARY KEY,
ten_quyen varchar(100) NOT NULL,
mo_ta TEXT
);

-- 2. Tạo bảng vai_tro (Vai trò)
CREATE TABLE vai_tro (
id VARCHAR(20) PRIMARY KEY,
ten_vai_tro VARCHAR(100) NOT NULL,
mo_ta TEXT
);

-- 3. Tạo bảng trung gian vai_tro_quyen (Phân quyền cho vai trò)
CREATE TABLE vai_tro_quyen (
id_vai_tro VARCHAR(20),
id_quyen VARCHAR(20),
PRIMARY KEY (id_vai_tro, id_quyen),
FOREIGN KEY (id_vai_tro) REFERENCES vai_tro(id),
FOREIGN KEY (id_quyen) REFERENCES quyen(id)
);

-- 4. Tạo bảng nguoi_dung (Người dùng)
CREATE TABLE nguoi_dung (
id VARCHAR(20) PRIMARY KEY,
ten_dang_nhap VARCHAR(50) NOT NULL,
mat_khau_hash TEXT NOT NULL,
ho_ten VARCHAR(100) NOT NULL,
id_vai_tro VARCHAR(20),
id_quan_nhan VARCHAR(20), -- chỉ lưu id quân nhân sử dụng để tìm kiếm, không liên kết đến bảng quan_nhan
trang_thai BOOLEAN,
FOREIGN KEY (id_vai_tro) REFERENCES vai_tro(id)
);

-- 5. Tạo bảng nhat_ky_dang_nhap (Nhật ký đăng nhập)
CREATE TABLE nhat_ky_dang_nhap (
id VARCHAR(20) PRIMARY KEY,
id_nguoi_dung VARCHAR(20),
thoi_gian TIMESTAMP,
trang_thai_thanh_cong BOOLEAN,
thiet_bi TEXT,
FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id)
);

-- 6. Tạo bảng nhat_ky_thao_tac (Nhật ký thao tác dữ liệu)
CREATE TABLE nhat_ky_thao_tac (
id VARCHAR(20) PRIMARY KEY,
id_nguoi_dung VARCHAR(20),
thoi_gian TIMESTAMP,
hanh_dong VARCHAR(50),
ten_bang VARCHAR(50),
du_lieu_cu JSONB,
du_lieu_moi JSONB,
dia_chi_ip VARCHAR(50),
FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id)
);

-- 7. Tạo bảng nhat_ky_backup (Nhật ký sao lưu)
CREATE TABLE nhat_ky_backup (
id VARCHAR(20) PRIMARY KEY,
thoi_gian_backup TIMESTAMP,
duong_dan VARCHAR(100),
id_nguoi_dung VARCHAR(20),
FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id)
);
