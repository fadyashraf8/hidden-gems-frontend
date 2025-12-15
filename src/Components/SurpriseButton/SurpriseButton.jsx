import React from "react";
import { useNavigate } from "react-router-dom";
import RotatingText from "../RotatingText/RotatingText";
import { Sparkles } from "lucide-react";

const SurpriseButton = ({ className = "", style = {} }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div
      dir="ltr"
      style={style}
      className={`fixed z-50 flex items-center group ${className}`}
    >
      {/* Close Button - Appears on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
        }}
        className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shadow-sm hover:bg-red-100 hover:text-red-500 z-50 transform scale-75 hover:scale-100"
        title="Dismiss"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <button
        onClick={() => navigate("/surprise")}
        className="flex items-center gap-3 px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <Sparkles className="w-5 h-5 text-[#DD0303]" />
        <span className="hidden sm:inline">I want to</span>
        <RotatingText
          texts={["Discover", "Explore", "Find Gems", "Be Surprised"]}
          mainClassName="px-2 sm:px-3 bg-[#DD0303] text-white overflow-hidden py-1 justify-center rounded-lg min-w-[140px]"
          staggerFrom="last"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
      </button>
    </div>
  );
};

export default SurpriseButton;
