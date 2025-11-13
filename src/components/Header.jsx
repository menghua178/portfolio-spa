import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiMenu, FiX, FiHome, FiBriefcase, FiBook, FiMail, FiUser, FiLogOut, FiSettings } from "react-icons/fi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  // 导航项
  const navItems = [
    { path: "/", icon: <FiHome />, label: "首页" },
    { path: "/projects", icon: <FiBriefcase />, label: "项目" },
    { path: "/blog", icon: <FiBook />, label: "博客" },
    { path: "/contact", icon: <FiMail />, label: "联系我" },
  ];

  // 身份相关导航项
  const authNavItems = isAuthenticated
    ? [
        { path: "/admin", icon: <FiSettings />, label: "管理面板" },
        { path: "#", icon: <FiLogOut />, label: "退出", onClick: logout },
      ]
    : [
        { path: "/login", icon: <FiUser />, label: "登录" },
        { path: "/register", icon: <FiUser />, label: "注册" },
      ];

  // 判断当前路径是否匹配
  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary text-2xl font-bold">Portfolio</span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors duration-200 ${
                  isActive(item.path)
                    ? "text-primary font-medium"
                    : "text-neutral-800 dark:text-neutral-200 hover:text-primary dark:hover:text-primary"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="ml-4 flex items-center gap-4">
              {authNavItems.map((item) =>
                item.onClick ? (
                  <button
                    key={item.path}
                    onClick={item.onClick}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors duration-200 ${
                      isActive(item.path)
                        ? "bg-primary text-white"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )
              )}
            </div>
          </nav>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden text-neutral-800 dark:text-neutral-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="菜单"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-col gap-2">
              {authNavItems.map((item) =>
                item.onClick ? (
                  <button
                    key={item.path}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 w-full text-left"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;