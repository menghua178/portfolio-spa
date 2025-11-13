import React from "react";

const Skeleton = ({ height, width = "100%", rounded = "lg", className = "" }) => {
  return (
    <div
      className={`bg-neutral-200 dark:bg-neutral-700 animate-pulse ${
        rounded ? `rounded-${rounded}` : ""
      } ${className}`}
      style={{ height, width }}
    ></div>
  );
};

export default Skeleton;