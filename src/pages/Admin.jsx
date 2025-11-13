// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { projectAPI, blogAPI } from "../services/api";
import { useForm } from "react-hook-form";

const Admin = () => {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  // 加载项目数据
  useEffect(() => {
    fetchProjects();
    fetchBlogs();
  }, []);

  const fetchProjects = async () => {
    const res = await projectAPI.getProjects();
    setProjects(res.data);
  };

  const fetchBlogs = async () => {
    const res = await blogAPI.getBlogs();
    setBlogs(res.data);
  };

  // 创建项目
  const onProjectCreate = async (data) => {
    await projectAPI.createProject(data);
    fetchProjects();
    reset();
  };

  // 删除项目
  const onProjectDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await projectAPI.deleteProject(id);
      fetchProjects();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {/* 项目管理区域 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Manage Projects</h2>
        <form onSubmit={handleSubmit(onProjectCreate)} className="space-y-4 mb-8 p-4 border rounded">
          <h3 className="text-xl font-medium">Create New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Project Name</label>
              <input type="text" {...register("name", { required: true })} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>Project URL</label>
              <input type="url" {...register("url")} className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label>Description</label>
              <textarea {...register("description", { required: true })} rows="3" className="w-full p-2 border rounded"></textarea>
            </div>
            <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Create Project</button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td className="border p-2">{project.name}</td>
                  <td className="border p-2">{project.description}</td>
                  <td className="border p-2">
                    <button className="text-blue-500 mr-2">Edit</button>
                    <button onClick={() => onProjectDelete(project._id)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 博客管理区域（结构类似项目管理，省略重复代码） */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Blogs</h2>
        {/* 博客创建表单 + 博客列表（编辑/删除功能） */}
      </div>
    </div>
  );
};

export default Admin;