// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut, FiPlus, FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Admin = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", image: "", link: "" });
  const [currentId, setCurrentId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  // 验证登录状态（修复权限控制）
  useEffect(() => {
    if (!token) {
      // 未登录跳转登录页
      navigate("/login", { state: { from: "/admin" } });
      return;
    }

    // 获取项目数据
    fetchProjects();
  }, [token, navigate, apiUrl]);

  // 获取项目数据
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/api/projects`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (Array.isArray(res.data)) {
        setProjects(res.data);
        setError("");
      } else {
        throw new Error("返回数据格式错误");
      }
    } catch (err) {
      setError("加载项目失败：" + (err.response?.data?.message || "请重新登录"));
      console.error("管理员加载项目错误：", err);
      // 令牌无效时跳转登录
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // 表单处理与提交逻辑（简化）
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (type = "add", item = null) => {
    if (type === "edit" && item) {
      setIsEditing(true);
      setCurrentId(item.id || item._id);
      setFormData({
        name: item.name || "",
        description: item.description || "",
        image: item.image || "",
        link: item.link || ""
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({ name: "", description: "", image: "", link: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("项目名称不能为空");
      return;
    }

    try {
      setSubmitLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      };

      if (isEditing && currentId) {
        // 编辑项目
        await axios.put(`${apiUrl}/api/projects/${currentId}`, formData, config);
        setProjects(prev => prev.map(item => 
          (item.id === currentId || item._id === currentId) ? { ...item, ...formData } : item
        ));
        alert("项目编辑成功");
      } else {
        // 新增项目
        const res = await axios.post(`${apiUrl}/api/projects`, formData, config);
        setProjects(prev => [res.data, ...prev]);
        alert("项目新增成功");
      }

      setIsModalOpen(false);
    } catch (err) {
      alert("操作失败：" + (err.response?.data?.message || "网络错误"));
      console.error("项目操作错误：", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // 删除项目
  const handleDelete = async (id) => {
    if (!window.confirm("确定要删除该项目吗？")) return;

    try {
      await axios.delete(`${apiUrl}/api/projects/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      setProjects(prev => prev.filter(item => item.id !== id && item._id !== id));
      alert("项目删除成功");
    } catch (err) {
      alert("删除失败：" + (err.response?.data?.message || "网络错误"));
      console.error("删除项目错误：", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">管理员面板</h1>
              <p className="text-neutral-600 mt-1">项目管理</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="flex items-center gap-2 text-red-500 hover:underline"
            >
              <FiLogOut /> 退出登录
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
              <button
                onClick={fetchProjects}
                className="mt-2 text-primary hover:underline text-sm"
              >
                点击重试
              </button>
            </div>
          )}

          {/* 新增按钮 */}
          <button
            onClick={() => openModal("add")}
            className="mb-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <FiPlus size={16} /> 新增项目
          </button>

          {/* 项目列表 */}
          {projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-neutral-500">暂无项目数据</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id || project._id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-neutral-100">
                    <img
                      src={project.image || `https://picsum.photos/seed/${project.id || project._id}/800/450`}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-neutral-600 mb-4 line-clamp-2">{project.description || "暂无描述"}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal("edit", project)}
                      className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1"
                    >
                      <FiEdit size={16} /> 编辑
                    </button>
                    <button
                      onClick={() => handleDelete(project.id || project._id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <FiTrash2 size={16} /> 删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* 新增/编辑模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-neutral-900">
                {isEditing ? "编辑项目" : "新增项目"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-neutral-500 hover:text-neutral-900"
              >
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  项目名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入项目名称"
                  disabled={submitLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  项目描述
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32"
                  placeholder="请输入项目描述"
                  disabled={submitLoading}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  项目图片链接
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入图片URL"
                  disabled={submitLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  项目链接
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入项目在线链接"
                  disabled={submitLoading}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                  disabled={submitLoading}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} /> 保存
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;