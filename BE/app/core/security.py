
class Role:
    ADMIN = "admin"
    CNQY = "chu_nhiem_quan_y"
    BAC_SI = "bac_si"
    Y_SI = "y_si"
    QN = "quan_nhan"

class Action:
    READ = "read"
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"

RESOURCES = [
    "benh_an",
    "chi_tiet_don_thuoc",
    "chi_tiet_du_tru",
    "chi_tiet_phieu_cham_soc",
    "chi_tiet_phieu_nhap_kho",
    "chi_tiet_xuat_kho",
    "di_tuyen_sau_dieu_tri",
    "don_thuoc",
    "dm_nhom_benh",
    "dm_trieu_chung",
    "don_vi",
    "giay_gioi_thieu",
    "kham_benh",
    "lich_kham_sk_nam",
    "lich_kham_sk_nam_chi_tiet",
    "phieu_cham_soc",
    "phieu_du_tru",
    "phieu_kham_suc_khoe",
    "phieu_nhap_kho",
    "phieu_xuat_kho",
    "quan_nhan",
    "thuoc_vtyt",
    "nguoi_dung",
    "vai_tro",
    "quyen",
    "vai_tro_quyen",
    "nhat_ky_dang_nhap",
    "nhat_ky_thao_tac",
    "nhat_ky_backup",
    "vai_tro_tam_thoi",
    "phan_cong_nhiem_vu",
    "buong",
    "giuong",
]

def get_all_permissions():
    perms = []
    for res in RESOURCES:
        for act in [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE]:
            perms.append(f"{res}:{act}")
    return perms
