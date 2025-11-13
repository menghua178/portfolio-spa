// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { setAuthToken, removeAuthToken } from "../utils/auth";

// 创建身份验证上下文（命名导出，供其他组件使用）
export const AuthContext = createContext();

// 改为默认导出 AuthProvider 组件（关键修改）
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化：检查本地存储的令牌
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // 登录函数
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        { email, password }
      );
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
      setUser(user);
      return true;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return false;
    }
  };

  // 注册函数
  const register = async (userData) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        userData
      );
      return true;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      return false;
    }
  };

  // 退出登录函数
  const logout = () => {
    localStorage.removeItem("token");
    removeAuthToken();
    setUser(null);
  };

  // 获取用户信息
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/me`
      );
      setUser(res.data);
    } catch (err) {
      console.error("Fetch user error:", err.response?.data || err.message);
      localStorage.removeItem("token");
      removeAuthToken();
    } finally {
      setLoading(false);
    }
  };

  // 向子组件提供上下文值
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}