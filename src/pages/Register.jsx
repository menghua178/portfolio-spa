// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock, FiUser, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  // 表单输入变化处理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除对应字段的错误提示
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setRegisterError("");
  };

  // 简化表单验证（确保按钮可点击）
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 用户名验证
    if (!formData.name.trim()) {
      newErrors.name = "用户名不能为空";
    } else if (formData.name.length < 2) {
      newErrors.name = "用户名至少2个字符";
    }

    // 邮箱验证
    if (!formData.email.trim()) {
      newErrors.email = "邮箱不能为空";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址";
    }

    // 密码验证
    if (!formData.password.trim()) {
      newErrors.password = "密码不能为空";
    } else if (formData.password.length < 6) {
      newErrors.password = "密码至少6个字符";
    }

    // 确认密码验证
    if (formData.confirmPassword.trim() !== formData.password.trim()) {
      newErrors.confirmPassword = "两次密码不一致";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 注册逻辑
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    
    if (!isValid) return;

    try {
      setLoading(true);
      setRegisterError("");

      const res = await axios.post(`${apiUrl}/api/users/register`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim()
      }, {
        headers: { "Content-Type": "application/json" }
      });

      // 注册成功后自动登录
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // 跳转首页并提示
      navigate("/", { state: { successMessage: "注册成功！" } });
    } catch (err) {
      if (err.response) {
        setRegisterError(err.response.data?.message || "注册失败，请重试");
      } else if (err.request) {
        setRegisterError("网络错误，请检查API地址");
      } else {
        setRegisterError("注册失败，请重试");
      }
      console.error("注册错误：", err);
    } finally {
      setLoading(false);
    }
  };

  // 按钮是否可点击的条件
  const isButtonDisabled = loading || !validateForm();

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
                注册账号
              </h2>

              {/* 注册错误提示 */}
              {registerError && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                  {registerError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 用户名输入框 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                    用户名
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.name ? "border-red-500 focus:ring-red-500" : "border-neutral-200 focus:border-primary"
                      }`}
                      placeholder="请输入用户名"
                      disabled={loading}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

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
                      placeholder="请输入密码（至少6位）"
                      disabled={loading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* 确认密码输入框 */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                    确认密码
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-neutral-200 focus:border-primary"
                      }`}
                      placeholder="请再次输入密码"
                      disabled={loading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* 提交按钮（修复禁用逻辑） */}
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    isButtonDisabled 
                      ? "bg-neutral-300 text-neutral-500 cursor-not-allowed" 
                      : "bg-primary text-white hover:bg-primary/90 active:scale-98"
                  }`}
                  disabled={isButtonDisabled}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      注册中...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={16} />
                      注册账号
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-neutral-600 text-sm">
                已有账号？{" "}
                <Link to="/login" className="text-primary hover:underline">
                  立即登录
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

export default Register;