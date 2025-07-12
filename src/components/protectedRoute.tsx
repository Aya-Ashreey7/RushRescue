import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const isAdmin = localStorage.getItem("isAdmin");

    return isAdmin === "true" ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
