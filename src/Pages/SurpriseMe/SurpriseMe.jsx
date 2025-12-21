import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BounceCards from "../../Components/BounceCards/BounceCards";
import { Sparkles, Frown } from "lucide-react";
import { useTranslation } from "react-i18next";
import GemCard from "../../Components/Gems/GemCard";
import "./SurpriseMe.css";

export default function SurpriseMe() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("surprise");

  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const baseURL = import.meta.env.VITE_Base_URL;

  const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/1.jpg",
  ];

  // Responsive configuration for BounceCards
  const getResponsiveConfig = () => {
    const width = window.innerWidth;

    if (width < 640) {
      // Mobile
      return {
        containerWidth: Math.min(width - 40, 300),
        containerHeight: Math.min(width - 40, 300),
        transformStyles: [
          "rotate(8deg) translate(-80px)",
          "rotate(4deg) translate(-40px)",
          "rotate(0deg)",
          "rotate(-8deg) translate(40px)",
          "rotate(4deg) translate(80px)",
        ],
        enableHover: false, // Disable hover on mobile
      };
    } else if (width < 1024) {
      // Tablet
      return {
        containerWidth: 350,
        containerHeight: 350,
        transformStyles: [
          "rotate(10deg) translate(-120px)",
          "rotate(5deg) translate(-60px)",
          "rotate(0deg)",
          "rotate(-8deg) translate(60px)",
          "rotate(3deg) translate(120px)",
        ],
        enableHover: true,
      };
    } else {
      // Desktop
      return {
        containerWidth: 500,
        containerHeight: 500,
        transformStyles: [
          "rotate(10deg) translate(-170px)",
          "rotate(5deg) translate(-85px)",
          "rotate(-3deg)",
          "rotate(-10deg) translate(85px)",
          "rotate(2deg) translate(170px)",
        ],
        enableHover: true,
      };
    }
  };

  const [cardConfig, setCardConfig] = useState(getResponsiveConfig());

  React.useEffect(() => {
    const handleResize = () => {
      setCardConfig(getResponsiveConfig());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSurprise = async () => {
    if (!mood.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`${baseURL}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: mood }),
      });

      if (!response.ok) {
        throw new Error("Failed to get suggestion");
      }

      const data = await response.json();
      // console.log("AI Response Data:", data);

      // Build a pool of potential candidates from the AI response
      let candidates = [];

      // 1. Primary suggestion(s)
      if (Array.isArray(data.suggestions)) {
        candidates.push(...data.suggestions);
      } else if (data.suggestions && typeof data.suggestions === "object") {
        candidates.push(data.suggestions);
      }

      // 2. Secondary suggestions (allSuggestions)
      // We use these as backups if the primary is already in the list!
      if (Array.isArray(data.allSuggestions)) {
        candidates.push(...data.allSuggestions);
      }

      // 3. Fallbacks
      if (candidates.length === 0) {
        if (data.suggestion) candidates.push(data.suggestion);
        else if (data.result) {
          const res = Array.isArray(data.result) ? data.result : [data.result];
          candidates.push(...res);
        }
      }

      setSuggestions((prev) => {
        // Find the FIRST candidate that is NOT already in 'prev'
        const existingIds = new Set(prev.map((p) => p._id));
        const nextGem = candidates.find((c) => !existingIds.has(c._id));

        if (nextGem) {
          return [...prev, nextGem]; // Add only the one new unique gem
        }

        // If all candidates are already in the list, we don't add anything.
        // User might need to change prompt to get different results.
        return prev;
      });
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => (
    <div className="w-full max-w-sm mx-auto h-[450px] relative">
      <div className="w-full h-full overflow-y-auto pr-1 custom-scrollbar">
        <div className="grid grid-cols-1 gap-6 pb-2">
          {suggestions.map((gem) => (
            <div key={gem._id} className="h-full">
              <GemCard gem={gem} darkMode={true} />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator - Floating below */}
      {suggestions.length > 1 && (
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-2 animate-bounce border border-gray-100 dark:border-gray-700">
            <span>Scroll for more</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`surprise-container ${i18n.dir()}`}>
      <div className="surprise-content">
        <div className="surprise-left">
          <h1 className="surprise-title">
            <Sparkles className="sparkle-icon" />
            {t("title")}
          </h1>

          <p className="surprise-subtitle">{t("subtitle")}</p>

          <div className="input-group">
            <textarea
              className="mood-input"
              placeholder={t("placeholder")}
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              rows={4}
            />

            {/* Button Group */}
            <div className="flex flex-col gap-3">
              <button
                className={`surprise-btn ${loading ? "loading" : ""} ${
                  suggestions.length >= 3 ? "bg-gray-800 hover:bg-gray-900" : ""
                }`}
                onClick={
                  suggestions.length >= 3
                    ? () => {
                        setSuggestions([]);
                        setHasSearched(false);
                        setMood("");
                      }
                    : handleSurprise
                }
                disabled={loading || (suggestions.length < 3 && !mood.trim())}
              >
                {loading
                  ? t("loading")
                  : suggestions.length >= 3
                  ? "Start New Search 🔄"
                  : suggestions.length > 0
                  ? "Add Another Gem 💎"
                  : t("button")}
              </button>

              {/* Helper Messages */}
              {!loading && (
                <div className="min-h-[24px] text-center">
                  {suggestions.length >= 3 ? (
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium animate-pulse">
                      Maximum of 3 gems reached. Save your favorites!
                    </p>
                  ) : suggestions.length > 0 ? (
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      Store up to 3 gems at once ({suggestions.length}/3)
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* No Results Message */}
          {hasSearched && !loading && suggestions.length === 0 && (
            <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center gap-4 animate-fadeIn">
              <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                <Frown className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-200">
                  Oops! No gems found.
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Our AI couldn't match that vibe. Try "Romantic dinner" or
                  "Cozy cafe".
                </p>
              </div>
            </div>
          )}

          {/* MOBILE ONLY: Results appear below button */}
          {suggestions.length > 0 && (
            <div className="block lg:hidden w-full mt-4">{renderResults()}</div>
          )}
        </div>

        <div className="surprise-right">
          {/* DESKTOP: Toggle between Results and Cards */}
          <div className="hidden lg:block w-full">
            {suggestions.length > 0 ? (
              renderResults()
            ) : (
              <BounceCards
                className="custom-bounce-cards"
                images={images}
                containerWidth={cardConfig.containerWidth}
                containerHeight={cardConfig.containerHeight}
                animationDelay={1}
                animationStagger={0.08}
                easeType="elastic.out(1, 0.5)"
                transformStyles={cardConfig.transformStyles}
                enableHover={cardConfig.enableHover}
              />
            )}
          </div>

          {/* MOBILE: Always show cards (on top due to flex-col-reverse) */}
          <div className="block lg:hidden w-full opacity-80 scale-90">
            <BounceCards
              className="custom-bounce-cards"
              images={images}
              containerWidth={cardConfig.containerWidth}
              containerHeight={cardConfig.containerHeight}
              animationDelay={1}
              animationStagger={0.08}
              easeType="elastic.out(1, 0.5)"
              transformStyles={cardConfig.transformStyles}
              enableHover={cardConfig.enableHover}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
