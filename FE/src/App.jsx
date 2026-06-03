import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
                    {/* Thêm các trang khác ở đây sau (VD: /kham-benh, /kho-duoc) */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
