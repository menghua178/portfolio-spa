// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="py-4 px-6 bg-gray-100">
      <div className="container mx-auto">
        <Link to="/" className="text-xl font-bold">我的作品集</Link>
        <nav className="mt-2 space-x-4">
          <Link to="/projects">项目</Link>
          <Link to="/blog">博客</Link>
          <Link to="/contact">联系我</Link>
          
          {/* 根据登录状态显示不同按钮 */}
          {isAuthenticated ? (
            <>
              <Link to="/admin">管理员面板</Link>
              <button onClick={logout}>退出登录</button>
            </>
          ) : (
            <>
              <Link to="/login">登录</Link>
              <Link to="/register">注册</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

// 关键：默认导出
export default Header;