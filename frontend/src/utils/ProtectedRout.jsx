import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoadingScreen = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-zinc-100 animate-spin" />
  </div>
);

const ProtectedRoutes = () => {
  const { status } = useAuth();

  if (status === "loading") return <LoadingScreen />;

  return status === "authenticated" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoutes;