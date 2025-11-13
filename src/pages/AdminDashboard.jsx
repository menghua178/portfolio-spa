import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { FiPlus, FiEdit, FiTrash2, FiChevronRight } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Skeleton from "../components/Skeleton";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;

  // 获取项目和博客数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, blogsRes] = await Promise.all([
          axios.get(`${apiUrl}/api/projects`),
          axios.get(`${apiUrl}/api/blog`),
        ]);
        setProjects(projectsRes.data);
        setBlogs(blogsRes.data);
      } catch (err) {
        console.error("获取数据失败", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // 删除项目
  const deleteProject = async (id) => {
    if (window.confirm("确定要删除这个项目吗？此操作不可撤销！")) {
      try {
        await axios.delete(`${apiUrl}/api/projects/${id}`);
        setProjects(projects.filter((project) => project.id !== id));
      } catch (err) {
        alert("删除失败：" + (err.response?.data?.message || "未知错误"));
      }
    }
  };

  // 删除博客
  const deleteBlog = async (id) => {
    if (window.confirm("确定要删除这篇博客吗？此操作不可撤销！")) {
      try {
        await axios.delete(`${apiUrl}/api/blog/${id}`);
        setBlogs(blogs.filter((blog) => blog.id !== id));
      } catch (err) {
        alert("删除失败：" + (err.response?.data?.message || "未知错误"));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                管理员面板
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300 mt-1">
                欢迎回来，{user?.name || "管理员"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/projects/create" className="btn btn-primary flex items-center gap-2">
                <FiPlus size={16} />
                新建项目
              </Link>
              <Link to="/admin/blog/create" className="btn btn-secondary flex items-center gap-2">
                <FiPlus size={16} />
                新建博客
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 项目管理卡片 */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  项目管理
                </h2>
                <Link to="/admin/projects" className="text-primary flex items-center gap-1 hover:underline">
                  查看全部 <FiChevronRight size={16} />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height="80px" rounded="lg" />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">暂无项目数据</p>
                  <Link to="/admin/projects/create" className="btn btn-primary">
                    新建第一个项目
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                          <img
                            src={project.image || `https://picsum.photos/seed/${project.id}/100/100`}
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-900 dark:text-white">
                            {project.name}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/projects/edit/${project.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                          aria-label="编辑"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                          aria-label="删除"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 博客管理卡片 */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  博客管理
                </h2>
                <Link to="/admin/blog" className="text-primary flex items-center gap-1 hover:underline">
                  查看全部 <FiChevronRight size={16} />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height="80px" rounded="lg" />
                  ))}
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">暂无博客数据</p>
                  <Link to="/admin/blog/create" className="btn btn-secondary">
                    新建第一篇博客
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {blogs.slice(0, 3).map((blog) => (
                    <div
                      key={blog.id}
                      className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                          <img
                            src={blog.image || `https://picsum.photos/seed/${blog.id}/100/100`}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-900 dark:text-white">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                            {new Date(blog.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/blog/edit/${blog.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                          aria-label="编辑"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                          aria-label="删除"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;