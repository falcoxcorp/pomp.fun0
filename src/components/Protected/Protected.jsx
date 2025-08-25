import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "wagmi";
import { admin } from "../../helper/Helper";

const ProtectedRoute = () => {
    const { address, isConnecting } = useAccount();

    if (isConnecting) {
        return <p>Loading...</p>; // Optional: Show a loading message while connecting
    }

    if (!address || address.toLowerCase() !== admin.toLowerCase()) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
