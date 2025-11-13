// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // 直接使用axios，避免Context依赖问题
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(""); // 单独管理登录错误
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = process.env.REACT_APP_API_URL;

  // 跳转回之前的页面
  const from = location.state?.from || "/";

  // 表单输入变化处理（简化逻辑）
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除对应字段的错误提示
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setLoginError(""); // 输入时清除登录错误
  };

  // 简化表单验证（确保按钮可点击）
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "邮箱不能为空";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址";
    }

    if (!formData.password.trim()) {
      newErrors.password = "密码不能为空";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 修复登录逻辑：直接调用API，避免Context依赖
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    
    if (!isValid) return;

    try {
      setLoading(true);
      setLoginError("");
      
      // 直接调用登录API
      const res = await axios.post(`${apiUrl}/api/users/login`, {
        email: formData.email.trim(),
        password: formData.password.trim()
      }, {
        headers: { "Content-Type": "application/json" }
      });

      const { user, token } = res.data;
      // 存储令牌和用户信息
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // 登录成功跳转
      navigate(from, { replace: true });
    } catch (err) {
      // 明确错误提示
      if (err.response) {
        setLoginError(err.response.data?.message || "登录失败，请检查账号密码");
      } else if (err.request) {
        setLoginError("网络错误，请检查API地址或网络连接");
      } else {
        setLoginError("登录失败，请重试");
      }
      console.error("登录错误：", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center mb-8">
              <Link to="/" className="flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors">
                <FiArrowLeft />
                <span>返回首页</span>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-neutral-900">
                登录账号
              </h2>

              {/* 登录错误提示 */}
              {loginError && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 邮箱输入框 */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    邮箱
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.email ? "border-red-500 focus:ring-red-500" : "border-neutral-200 focus:border-primary"
                      }`}
                      placeholder="请输入邮箱"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* 密码输入框 */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                    密码
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.password ? "border-red-500 focus:ring-red-500" : "border-neutral-200 focus:border-primary"
                      }`}
                      placeholder="请输入密码"
                      disabled={loading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* 提交按钮（确保可点击条件清晰） */}
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg font-medium transition-all ${
                    loading 
                      ? "bg-neutral-300 text-neutral-500 cursor-not-allowed" 
                      : "bg-primary text-white hover:bg-primary/90 active:scale-98"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      登录中...
                    </div>
                  ) : (
                    "登录"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-neutral-600 text-sm">
                还没有账号？{" "}
                <Link to="/register" className="text-primary hover:underline">
                  立即注册
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;