import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BounceCards from "../../Components/BounceCards/BounceCards";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./SurpriseMe.css";

export default function SurpriseMe() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("surprise");

  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
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
    
    if (width < 640) { // Mobile
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
    } else if (width < 1024) { // Tablet
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
    } else { // Desktop
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
    setSuggestion(null);

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
      alert(t("errorMessage"));
    } finally {
      setLoading(false);
    }
  };

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

            <button
              className={`surprise-btn ${loading ? "loading" : ""}`}
              onClick={handleSurprise}
              disabled={loading || !mood.trim()}
            >
              {loading ? t("loading") : t("button")}
            </button>
          </div>

          {suggestion && (
            <div
              className="suggestion-card fade-in"
              onClick={() => navigate(`/gems/${suggestion.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={suggestion.image}
                alt={suggestion.name}
                className="suggestion-image"
              />
              <div className="suggestion-info">
                <h3>{suggestion.name}</h3>
                <p>{suggestion.description}</p>
                <div className="suggestion-rating">
                  ★ {suggestion.rating.toFixed(1)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="surprise-right">
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
  );
}