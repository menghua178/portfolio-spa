// src/services/api.js
import axios from "axios";
// 配置API基础路径（从环境变量获取）
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 请求拦截器：添加认证令牌
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 项目相关API
export const projectAPI = {
  getProjects: () => api.get("/api/projects"),
  getProject: (id) => api.get(`/api/projects/${id}`),
  createProject: (data) => api.post("/api/projects", data),
  updateProject: (id, data) => api.put(`/api/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/api/projects/${id}`),
};

// 博客相关API
export const blogAPI = {
  getBlogs: () => api.get("/api/blog"),
  getBlog: (id) => api.get(`/api/blog/${id}`),
  getBlogComments: (id) => api.get(`/api/blog/${id}/comments`), // 新增：获取博客评论
  createBlog: (data) => api.post("/api/blog", data),
  updateBlog: (id, data) => api.put(`/api/blog/${id}`, data),
  deleteBlog: (id) => api.delete(`/api/blog/${id}`),
  addComment: (postId, comment) => api.post(`/api/blog/${postId}/comments`, { comment }),
};

// 联系表单API
export const contactAPI = {
  sendMessage: (data) => api.post("/api/contact", data),
};

export default api;