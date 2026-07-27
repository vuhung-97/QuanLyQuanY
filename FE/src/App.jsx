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
// import RolePermissionPage from "./pages/Admin/RolePermissionPage.jsx";
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

                        <Route path="kham-dinh-ky">
                            <Route
                                index
                                element={<Navigate to="lap-lich" replace />}
                            />
                            <Route
                                path="lap-lich"
                                element={
                                    <RoleRoute
                                        roles={MENU_ROLE_MAP["lap-lich"]}
                                    >
                                        <LapLichPage />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="kham-suc-khoe"
                                element={
                                    <RoleRoute
                                        roles={MENU_ROLE_MAP["kham-suc-khoe"]}
                                    >
                                        <KhamSucKhoePage />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="ket-qua-kham"
                                element={
                                    <RoleRoute
                                        roles={MENU_ROLE_MAP["ket-qua-kham"]}
                                    >
                                        <KetQuaKhamPage />
                                    </RoleRoute>
                                }
                            />
                        </Route>

                        <Route path="noi-tru">
                            <Route
                                index
                                element={<Navigate to="danh-sach" replace />}
                            />
                            <Route
                                path="danh-sach"
                                element={
                                    <RoleRoute
                                        roles={
                                            MENU_ROLE_MAP["danh-sach-noi-tru"]
                                        }
                                    >
                                        <DanhSachNoiTruPage />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="lap-benh-an"
                                element={
                                    <RoleRoute
                                        roles={MENU_ROLE_MAP["lap-benh-an"]}
                                    >
                                        <LapBenhAnPage />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="quan-ly-phong-giuong"
                                element={
                                    <RoleRoute
                                        roles={
                                            MENU_ROLE_MAP[
                                                "quan-ly-phong-giuong"
                                            ]
                                        }
                                    >
                                        <QuanLyPhongGiuongPage />
                                    </RoleRoute>
                                }
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
                                element={
                                    <RoleRoute
                                        roles={
                                            MENU_ROLE_MAP[
                                                "kham-benh-cho-quan-nhan"
                                            ]
                                        }
                                    >
                                        <KhamBenhPage />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="Cap-thuoc"
                                element={
                                    <RoleRoute
                                        roles={MENU_ROLE_MAP["cap-thuoc"]}
                                    >
                                        <CapThuocPage />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="Chuyen-tuyen"
                                element={
                                    <RoleRoute
                                        roles={MENU_ROLE_MAP["chuyen-tuyen"]}
                                    >
                                        <ChuyenTuyenPage />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="danh-muc"
                                element={
                                    <RoleRoute
                                        roles={MENU_ROLE_MAP["danh-muc-benh"]}
                                    >
                                        <DanhMucPage />
                                    </RoleRoute>
                                }
                            />
                        </Route>

                        <Route path="kho-duoc">
                            <Route
                                index
                                element={<Navigate to="kho" replace />}
                            />
                            <Route
                                path="kho"
                                element={
                                    <RoleRoute roles={MENU_ROLE_MAP["kho"]}>
                                        <KhoPage />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="du-tru"
                                element={
                                    <RoleRoute roles={MENU_ROLE_MAP["du-tru"]}>
                                        <DuTruPage />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="nhap"
                                element={
                                    <RoleRoute
                                        roles={MENU_ROLE_MAP["nhap-kho"]}
                                    >
                                        <NhapKhoPage />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="xuat"
                                element={
                                    <RoleRoute
                                        roles={MENU_ROLE_MAP["xuat-kho"]}
                                    >
                                        <XuatKhoPage />
                                    </RoleRoute>
                                }
                            />
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
                                {/* <Route
                                    path="phan-quyen"
                                    element={<RolePermissionPage />}
                                /> */}
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
