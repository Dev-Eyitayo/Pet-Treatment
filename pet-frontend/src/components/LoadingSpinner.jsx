import React from "react";

const LoadingSpinner = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen w-full" : "py-4"
      }`}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent dark:border-gray-200 border-gray-800"></div>
    </div>
  );
};

export default LoadingSpinner;
