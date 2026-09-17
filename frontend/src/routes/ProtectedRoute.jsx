import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Wait until authentication check is complete
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → allow access
  return <Outlet />;
};

export default ProtectedRoute;