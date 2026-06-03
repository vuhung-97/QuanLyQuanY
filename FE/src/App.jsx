import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import PeriodicCheckupPage from "./pages/PeriodicCheckup/PeriodicCheckupPage.jsx";
import PeriodicCheckupPlaceholderPage from "./pages/PeriodicCheckup/PeriodicCheckupPlaceholderPage.jsx";
import UserManagementPage from "./pages/Admin/UserManagementPage.jsx";
import RolePermissionPage from "./pages/Admin/RolePermissionPage.jsx";
import AuditLogPage from "./pages/Admin/AuditLogPage.jsx";

export default function App() {
    return (
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
                        element={<PeriodicCheckupPage />}
                    />
                    <Route
                        path="kham-dinh-ky/kham-suc-khoe"
                        element={
                            <PeriodicCheckupPlaceholderPage title="Khám sức khỏe định kỳ" />
                        }
                    />
                    <Route
                        path="kham-dinh-ky/chua-kham"
                        element={
                            <PeriodicCheckupPlaceholderPage title="Danh sách quân nhân chưa khám" />
                        }
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
                    {/* Thêm các trang khác ở đây sau (VD: /kham-benh, /kho-duoc) */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
