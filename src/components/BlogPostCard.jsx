// src/components/BlogPostCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiComment } from "react-icons/fi";
import Skeleton from "./Skeleton";

const BlogPostCard = ({ blog, isLoading = false }) => {
  // 加载状态骨架屏
  if (isLoading) {
    return (
      <div className="card">
        <Skeleton height="160px" rounded="lg" className="mb-4" />
        <Skeleton height="24px" width="70%" className="mb-2" />
        <div className="flex gap-3 mb-3">
          <Skeleton height="14px" width="60px" />
          <Skeleton height="14px" width="80px" />
          <Skeleton height="14px" width="60px" />
        </div>
        <Skeleton height="16px" width="100%" className="mb-2" />
        <Skeleton height="16px" width="80%" className="mb-4" />
        <Skeleton height="36px" width="30%" />
      </div>
    );
  }

  const { id, title, content, date, image, commentCount = 0 } = blog;
  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  // 截取摘要（前120字）
  const getExcerpt = (text) => {
    return text.length > 120 ? `${text.slice(0, 120)}...` : text;
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* 博客封面图 */}
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-[16/9]">
        <img
          src={image || `https://picsum.photos/seed/${id}/800/450`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* 博客元信息 */}
      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-3 gap-4">
        <div className="flex items-center gap-1">
          <FiCalendar size={14} />
          <span>{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiClock size={14} />
          <span>{Math.ceil(content.length / 500)} 分钟阅读</span>
        </div>
        <div className="flex items-center gap-1">
          <FiComment size={14} />
          <span>{commentCount} 条评论</span>
        </div>
      </div>

      {/* 博客标题与摘要 */}
      <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white group-hover:text-primary transition-colors duration-200 line-clamp-2">
        {title}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3">
        {getExcerpt(content)}
      </p>

      {/* 阅读更多按钮 */}
      <Link
        to={`/blog/${id}`}
        className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary/80 transition-colors"
      >
        阅读全文
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </Link>
    </div>
  );
};

export default BlogPostCard;