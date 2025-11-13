// src/pages/BlogDetail.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { FiCalendar, FiClock, FiComment, FiArrowLeft, FiUser } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentInputRef = useRef(null);

  // 加载博客详情与评论
  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const [blogRes, commentsRes] = await Promise.all([
        blogAPI.getBlog(id),
        blogAPI.getBlogComments(id) // 需在api.js中添加：getBlogComments: (id) => api.get(`/api/blog/${id}/comments`)
      ]);
      
      setBlog(blogRes.data);
      setComments(commentsRes.data);
      setError(null);
    } catch (err) {
      setError("加载内容失败，请稍后重试");
      console.error("博客详情加载失败：", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  // 提交评论
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      // 未登录：跳转登录页，登录后返回当前页面
      navigate("/login", { state: { from: `/blog/${id}` } });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await blogAPI.addComment(id, commentText);
      const newComment = res.data;
      
      // 添加新评论到列表头部
      setComments(prev => [newComment, ...prev]);
      setCommentText(""); // 清空输入框
    } catch (err) {
      alert("评论提交失败：" + (err.response?.data?.message || "未知错误"));
      console.error("评论提交失败：", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* 标题骨架屏 */}
              <div className="space-y-4 mb-8">
                <div className="w-3/4 h-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="w-48 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  <div className="w-64 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                </div>
              </div>
              
              {/* 封面图骨架屏 */}
              <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-8 animate-pulse"></div>
              
              {/* 内容骨架屏 */}
              <div className="space-y-4">
                {Array(6).fill(0).map((_, idx) => (
                  <div key={idx} className="w-full h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                ))}
                {Array(4).fill(0).map((_, idx) => (
                  <div key={idx} className="w-5/6 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-6 rounded-lg text-center">
              <h3 className="text-xl font-medium mb-4">{error || "博客不存在或已被删除"}</h3>
              <button
                onClick={() => navigate("/blog")}
                className="btn btn-primary"
              >
                返回博客列表
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* 返回按钮 */}
            <button
              onClick={() => navigate("/blog")}
              className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary mb-8 transition-colors"
            >
              <FiArrowLeft size={18} />
              <span>返回博客列表</span>
            </button>

            {/* 博客标题 */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* 博客元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-8">
              <div className="flex items-center gap-1">
                <FiCalendar size={14} />
                <span>{new Date(blog.date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock size={14} />
                <span>{Math.ceil(blog.content.length / 500)} 分钟阅读</span>
              </div>
              <div className="flex items-center gap-1">
                <FiComment size={14} />
                <span>{comments.length} 条评论</span>
              </div>
              {blog.author && (
                <div className="flex items-center gap-1">
                  <FiUser size={14} />
                  <span>作者：{blog.author.name || "匿名作者"}</span>
                </div>
              )}
            </div>

            {/* 博客封面图 */}
            {blog.image && (
              <div className="w-full h-64 md:h-96 overflow-hidden rounded-xl mb-8">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* 博客内容 */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              {blog.content.split("\n").map((paragraph, idx) => (
                paragraph.trim() ? (
                  <p key={idx} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ) : (
                  <br key={idx} />
                )
              ))}
              {/* 支持标题、列表等富文本格式（实际项目可集成markdown解析器） */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 评论区 */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-white">
                评论区（{comments.length}）
              </h2>

              {/* 评论输入框 */}
              <form onSubmit={handleCommentSubmit} className="mb-10">
                <div className="mb-4">
                  <textarea
                    ref={commentInputRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={isAuthenticated ? "分享你的想法..." : "登录后即可评论"}
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary dark:bg-neutral-800 transition-all outline-none resize-none h-24"
                    disabled={!isAuthenticated || isSubmitting}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                  disabled={!isAuthenticated || !commentText.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      提交中...
                    </>
                  ) : (
                    "提交评论"
                  )}
                </button>
                {!isAuthenticated && (
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <a href="/login" className="text-primary hover:underline">登录</a> 后即可参与评论
                  </p>
                )}
              </form>

              {/* 评论列表 */}
              {comments.length === 0 ? (
                <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <p className="text-neutral-500 dark:text-neutral-400">暂无评论，快来抢占沙发～</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-4 p-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0"
                    >
                      {/* 评论者头像 */}
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={comment.author?.avatar || `https://picsum.photos/seed/${comment.id}/100/100`}
                          alt={comment.author?.name || "匿名用户"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* 评论内容 */}
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-neutral-900 dark:text-white">
                            {comment.author?.name || "匿名用户"}
                          </h4>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {new Date(comment.date).toLocaleString("zh-CN")}
                          </span>
                        </div>
                        <p className="text-neutral-700 dark:text-neutral-300 mb-2">
                          {comment.content}
                        </p>
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

export default BlogDetail;