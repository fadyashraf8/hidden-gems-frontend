import React from "react";
import { Spinner } from "@heroui/react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] overflow-hidden bg-white dark:bg-[#0f1419] transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <Spinner color="danger" size="lg" />
        <p className="text-base text-[#666] dark:text-[#9aa0a6]">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
