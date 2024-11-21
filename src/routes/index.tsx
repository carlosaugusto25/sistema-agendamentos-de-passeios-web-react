import { Navigate, Routes, useLocation, Route } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Config } from "../pages/Config";
import { LandingPage } from "../pages/LandingPage";

export const RoutesApp: React.FC = () => {

    const { user } = useAuth()

    function RequireAuth({ children }: { children: JSX.Element }) {
        const location = useLocation();

        if (!user) {
            return <Navigate to='/' state={{ from: location }} replace />
        }
        return children
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <LandingPage />
                }
            />
            <Route
                path="/login"
                element={
                    <Login />
                }
            />
            <Route
                path="/home"
                element={
                    <RequireAuth><Home /></RequireAuth>
                }
            />
            <Route
                path="/config"
                element={
                    <RequireAuth><Config /></RequireAuth>
                }
            />
        </Routes>
    );
}