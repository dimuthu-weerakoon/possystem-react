import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext"


const ProtectedRoute = () => {


    const { isAuthenticated, loading } = useAuth();

    if (!loading) {
        if (isAuthenticated) {
            return <Outlet />
        } else {
            return <Navigate to={"/auth/login"} />
        }
    }

}

export default ProtectedRoute