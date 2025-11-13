// src/components/ProtectedRoute.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// 定义组件函数
function ProtectedRoute() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // 加载状态
  }

  // 未登录则重定向到登录页，已登录则显示子路由
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

// 关键：默认导出组件
export default ProtectedRoute;