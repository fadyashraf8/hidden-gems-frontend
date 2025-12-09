import React from "react";
import { useNavigate } from "react-router-dom";
import RotatingText from "../RotatingText/RotatingText";
import { Sparkles } from "lucide-react";

const SurpriseButton = ({ className = "", style = {} }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/surprise")}
      style={style}
      className={`group flex items-center gap-3 px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 ${className}`}
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
  );
};

export default SurpriseButton;
