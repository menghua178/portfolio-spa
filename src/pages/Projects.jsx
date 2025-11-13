// src/pages/Projects.jsx
import React, { useState, useEffect } from "react";
import axios from "axios"; // 直接使用axios，避免api.js封装问题
import ProjectCard from "../components/ProjectCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  // 修复API请求逻辑：添加错误捕获与超时处理
  const fetchProjects = async () => {
    try {
      setLoading(true);
      // 设置5秒超时，避免无限Loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await axios.get(`${apiUrl}/api/projects`, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json"
        }
      });

      clearTimeout(timeoutId);
      // 验证数据格式
      if (Array.isArray(res.data)) {
        setProjects(res.data);
        setError(null);
      } else {
        throw new Error("返回数据不是数组");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("请求超时，请检查网络或API地址");
      } else if (err.response) {
        // API返回错误状态码
        setError(`加载失败（${err.response.status}）：${err.response.data?.message || "服务器错误"}`);
      } else {
        // 网络错误或API地址错误
        setError("加载失败：请检查API地址是否正确");
        console.error("项目数据请求错误：", err);
      }
    } finally {
      setLoading(false); // 无论成功失败，都结束Loading
    }
  };

  // 初始加载 + 错误重试
  useEffect(() => {
    fetchProjects();
  }, [apiUrl]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center text-neutral-900 dark:text-white">
            我的项目
          </h1>

          {/* 错误提示（可重试） */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg text-center mb-8">
              <p>{error}</p>
              <button
                onClick={fetchProjects}
                className="mt-3 btn btn-primary text-sm"
              >
                点击重试
              </button>
            </div>
          )}

          {/* 项目列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // 加载状态：固定3个骨架屏
              Array(3).fill(0).map((_, idx) => (
                <ProjectCard key={idx} isLoading={true} />
              ))
            ) : projects.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white dark:bg-neutral-800 rounded-xl shadow">
                <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                  暂无项目数据
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  管理员可在后台添加项目
                </p>
              </div>
            ) : (
              projects.map((project) => (
                <ProjectCard 
                  key={project.id || project._id} // 兼容id/_id两种字段名
                  project={project} 
                />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;