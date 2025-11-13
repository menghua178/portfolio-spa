import React from "react";
import { Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import Skeleton from "./Skeleton";

const ProjectCard = ({ project, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="card">
        <Skeleton height="200px" rounded="lg" className="mb-4" />
        <Skeleton height="24px" width="60%" className="mb-2" />
        <Skeleton height="16px" width="100%" className="mb-4" />
        <Skeleton height="40px" width="40%" />
      </div>
    );
  }

  const { id, name, description, image, link } = project;

  return (
    <div className="card group">
      {/* 项目图片 */}
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-video">
        <img
          src={image || `https://picsum.photos/seed/${id}/800/450`}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="bg-white text-primary px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
              <FiExternalLink size={16} />
              查看项目
            </span>
          </a>
        )}
      </div>

      {/* 项目信息 */}
      <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white group-hover:text-primary transition-colors duration-200">
        {name}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3">
        {description}
      </p>
      <Link
        to={`/projects/${id}`}
        className="inline-block btn btn-primary"
      >
        查看详情
      </Link>
    </div>
  );
};

export default ProjectCard;