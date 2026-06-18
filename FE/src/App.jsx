import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/vi";
import LoginPage from "./pages/Login/LoginPage.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import ProtectedRoute from "./components//common/ProtectedRoute.jsx";
import AdminRoute from "./components/common/AdminRoute.jsx";
import PeriodicSchedulePage from "./pages/PeriodicCheckup/PeriodicSchedulePage.jsx";
import PeriodicCheckupPage from "./pages/PeriodicCheckup/PeriodicCheckupPage.jsx";
import KhamBenhPage from "./pages/KhamBenh/KhamBenhPage.jsx";
import PlaceHolderPage from "./components/common/PlaceHolderPage.jsx";
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
                            element={<PeriodicSchedulePage />}
                        />
                        <Route
                            path="kham-dinh-ky/kham-suc-khoe"
                            element={<PeriodicCheckupPage />}
                        />
                        <Route
                            path="noi-tru"
                            element={
                                <PlaceHolderPage title="Quản lý nội trú" />
                            }
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
                            element={<PlaceHolderPage title="Cấp thuốc" />}
                        />
                        <Route
                            path="kho-duoc"
                            element={<PlaceHolderPage title="Kho dược" />}
                        />
                        <Route
                            path="bao-cao"
                            element={<PlaceHolderPage title="Báo cáo" />}
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
