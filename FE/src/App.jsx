import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/vi";
import LoginPage from "./pages/Login/LoginPage.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import ProtectedRoute from "./components//common/ProtectedRoute.jsx";
import AdminRoute from "./components/common/AdminRoute.jsx";
import LapLichPage from "./pages/KhamSucKhoe/LapLichPage.jsx";
import KhamSucKhoePage from "./pages/KhamSucKhoe/KhamSucKhoePage.jsx";
import KetQuaKhamPage from "./pages/KhamSucKhoe/KetQuaKhamPage.jsx";
import KhamBenhPage from "./pages/KhamBenhChoQN/KhamBenhPage.jsx";
import CapThuocPage from "./pages/KhamBenhChoQN/CapThuocPage.jsx";
import ChuyenTuyenPage from "./pages/KhamBenhChoQN/ChuyenTuyenPage.jsx";
import DanhMucPage from "./pages/KhamBenhChoQN/DanhMucPage.jsx";
import BaoCaoPage from "./pages/BaoCao/BaoCaoPage.jsx";
import DanhSachNoiTruPage from "./pages/NoiTru/DanhSachNoiTruPage.jsx";
import DuTruPage from "./pages/KhoDuoc/DuTruPage.jsx";
import NhapKhoPage from "./pages/KhoDuoc/NhapKhoPage.jsx";
import XuatKhoPage from "./pages/KhoDuoc/XuatKhoPage.jsx";
import LapBenhAnPage from "./pages/NoiTru/LapBenhAnPage.jsx";
import QuanLyPhongGiuongPage from "./pages/NoiTru/QuanLyPhongGiuongPage.jsx";
import KhoPage from "./pages/KhoDuoc/KhoPage.jsx";
import UserManagementPage from "./pages/Admin/UserManagementPage.jsx";
import RolePermissionPage from "./pages/Admin/RolePermissionPage.jsx";
import AuditLogPage from "./pages/Admin/AuditLogPage.jsx";

export default function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Các route nằm trong Layout chung */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardPage />} />
                        <Route
                            path="kham-dinh-ky"
                            element={
                                <Navigate to="/kham-dinh-ky/lap-lich" replace />
                            }
                        />
                        <Route
                            path="kham-dinh-ky/lap-lich"
                            element={<LapLichPage />}
                        />
                        <Route
                            path="kham-dinh-ky/kham-suc-khoe"
                            element={<KhamSucKhoePage />}
                        />
                        <Route
                            path="kham-dinh-ky/ket-qua-kham"
                            element={<KetQuaKhamPage />}
                        />
                        <Route
                            path="noi-tru"
                            element={
                                <Navigate to="/noi-tru/danh-sach" replace />
                            }
                        />
                        <Route
                            path="noi-tru/danh-sach"
                            element={<DanhSachNoiTruPage />}
                        />
                        <Route
                            path="noi-tru/lap-benh-an"
                            element={<LapBenhAnPage />}
                        />
                        <Route
                            path="noi-tru/quan-ly-phong-giuong"
                            element={<QuanLyPhongGiuongPage />}
                        />
                        <Route
                            path="kham-benh"
                            element={
                                <Navigate
                                    to="/kham-benh/Kham-benh-cho-quan-nhan"
                                    replace
                                />
                            }
                        />
                        <Route
                            path="kham-benh/Kham-benh-cho-quan-nhan"
                            element={<KhamBenhPage />}
                        />
                        <Route
                            path="kham-benh/Cap-thuoc"
                            element={<CapThuocPage />}
                        />
                        <Route
                            path="kham-benh/Chuyen-tuyen"
                            element={<ChuyenTuyenPage />}
                        />
                        <Route
                            path="kham-benh/danh-muc"
                            element={<DanhMucPage />}
                        />
                        <Route path="kho-duoc">
                            <Route
                                index
                                element={<Navigate to="kho" replace />}
                            />
                            <Route path="kho" element={<KhoPage />} />
                            <Route path="du-tru" element={<DuTruPage />} />
                            <Route path="nhap" element={<NhapKhoPage />} />
                            <Route path="xuat" element={<XuatKhoPage />} />
                        </Route>
                        <Route
                            path="bao-cao"
                            element={<BaoCaoPage />}
                        />
                        <Route
                            path="admin"
                            element={
                                <AdminRoute>
                                    <Navigate to="/admin/nguoi-dung" replace />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="admin/nguoi-dung"
                            element={
                                <AdminRoute>
                                    <UserManagementPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="admin/phan-quyen"
                            element={
                                <AdminRoute>
                                    <RolePermissionPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="admin/nhat-ky"
                            element={
                                <AdminRoute>
                                    <AuditLogPage />
                                </AdminRoute>
                            }
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </LocalizationProvider>
    );
}
