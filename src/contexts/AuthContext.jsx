import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 设置默认请求头
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // 登录
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        email,
        password,
      });
      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      navigate("/");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "登录失败，请检查账号密码",
      };
    }
  };

  // 注册
  const register = async (userData) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, userData);
      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      navigate("/");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "注册失败，请重试",
      };
    }
  };

  // 退出登录
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 验证令牌有效性
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`);
        setUser(res.data);
      } catch (err) {
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);