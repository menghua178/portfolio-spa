// src/pages/Blog.jsx
import React, { useState, useEffect } from "react";
import { blogAPI } from "../services/api";
import BlogPostCard from "../components/BlogPostCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 加载博客数据
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogAPI.getBlogs(); // 实际项目可添加分页参数：`?page=${page}&limit=6`
      const newBlogs = res.data;
      
      setBlogs(prev => page === 1 ? newBlogs : [...prev, ...newBlogs]);
      setHasMore(newBlogs.length >= 6); // 假设每页6条数据
      setError(null);
    } catch (err) {
      setError("加载博客失败，请稍后重试");
      console.error("博客数据获取失败：", err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载与分页加载
  useEffect(() => {
    fetchBlogs();
  }, [page]);

  // 加载更多
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
              我的博客
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              记录技术成长、项目经验与行业思考，分享有价值的内容
            </p>
          </div>

          {/* 错误提示 */}
          if (error) {
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg text-center mb-8">
              {error}
              <button
                onClick={() => fetchBlogs()}
                className="mt-2 text-primary hover:underline"
              >
                点击重试
              </button>
            </div>
          }

          {/* 博客列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // 加载状态：渲染3个骨架屏
              Array(3).fill(0).map((_, idx) => (
                <BlogPostCard key={idx} isLoading={true} />
              ))
            ) : blogs.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white dark:bg-neutral-800 rounded-xl shadow">
                <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                  暂无博客内容
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                  博主正在努力创作中，敬请期待...
                </p>
              </div>
            ) : (
              blogs.map(blog => (
                <BlogPostCard key={blog.id} blog={blog} />
              ))
            )}
          </div>

          {/* 加载更多按钮 */}
          {hasMore && !loading && blogs.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                className="btn btn-primary px-6 py-2.5 flex items-center gap-2 mx-auto"
              >
                <svg
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                加载更多
              </button>
            </div>
          )}

          {/* 加载中提示 */}
          {loading && page > 1 && (
            <div className="text-center mt-8 py-4">
              <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-neutral-600 dark:text-neutral-400">加载中...</span>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;