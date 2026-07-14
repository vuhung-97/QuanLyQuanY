import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/vi";
import LoginPage from "./pages/Login/LoginPage.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import ProtectedRoute from "./components//common/ProtectedRoute.jsx";
import AdminRoute from "./components/common/AdminRoute.jsx";
import RoleRoute from "./components/common/RoleRoute.jsx";
import { MENU_ROLE_MAP } from "./constants/roleConstants.js";
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
                            element={
                                <RoleRoute
                                    roles={MENU_ROLE_MAP["kham-dinh-ky"]}
                                >
                                    <Outlet />
                                </RoleRoute>
                            }
                        >
                            <Route path="kham-dinh-ky">
                                <Route
                                    index
                                    element={<Navigate to="lap-lich" replace />}
                                />
                                <Route
                                    path="lap-lich"
                                    element={<LapLichPage />}
                                />
                                <Route
                                    path="kham-suc-khoe"
                                    element={<KhamSucKhoePage />}
                                />
                                <Route
                                    path="ket-qua-kham"
                                    element={<KetQuaKhamPage />}
                                />
                            </Route>
                            <Route path="noi-tru">
                                <Route
                                    index
                                    element={
                                        <Navigate to="danh-sach" replace />
                                    }
                                />
                                <Route
                                    path="danh-sach"
                                    element={<DanhSachNoiTruPage />}
                                />
                                <Route
                                    path="lap-benh-an"
                                    element={<LapBenhAnPage />}
                                />
                                <Route
                                    path="quan-ly-phong-giuong"
                                    element={<QuanLyPhongGiuongPage />}
                                />
                            </Route>
                            <Route path="kham-benh">
                                <Route
                                    index
                                    element={
                                        <Navigate
                                            to="Kham-benh-cho-quan-nhan"
                                            replace
                                        />
                                    }
                                />
                                <Route
                                    path="Kham-benh-cho-quan-nhan"
                                    element={<KhamBenhPage />}
                                />
                                <Route
                                    path="Cap-thuoc"
                                    element={<CapThuocPage />}
                                />
                                <Route
                                    path="Chuyen-tuyen"
                                    element={<ChuyenTuyenPage />}
                                />
                                <Route
                                    path="danh-muc"
                                    element={<DanhMucPage />}
                                />
                            </Route>
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
                        </Route>

                        <Route path="bao-cao" element={<BaoCaoPage />} />

                        <Route
                            element={
                                <AdminRoute>
                                    <Outlet />
                                </AdminRoute>
                            }
                        >
                            <Route path="admin">
                                <Route
                                    index
                                    element={
                                        <Navigate to="nguoi-dung" replace />
                                    }
                                />
                                <Route
                                    path="nguoi-dung"
                                    element={<UserManagementPage />}
                                />
                                <Route
                                    path="nhat-ky"
                                    element={<AuditLogPage />}
                                />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </LocalizationProvider>
    );
}
