import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Skeleton from "./components/Skeleton";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // 加载骨架屏
    return (
      <div className="section-container">
        <Skeleton height="80vh" rounded="xl" />
      </div>
    );
  }

  // 未登录跳转登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;