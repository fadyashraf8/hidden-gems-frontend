import React, { useState } from "react";
import BounceCards from "../../Components/BounceCards/BounceCards";
import { Sparkles } from "lucide-react";
import "./SurpriseMe.css";

export default function SurpriseMe() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/1.jpg",
  ];

  const handleSurprise = () => {
    if (!mood.trim()) return;

    setLoading(true);
    setSuggestion(null);

    // Mock AI delay
    setTimeout(() => {
      setLoading(false);
      setSuggestion({
        name: "Hidden Oasis Cafe",
        description:
          "A perfect match for your mood! This cozy spot offers a serene atmosphere and delicious comfort food.",
        image: "/images/2.jpg",
        rating: 4.8,
      });
    }, 2000);
  };

  return (
    <div className="surprise-container">
      <div className="surprise-content">
        <div className="surprise-left">
          <h1 className="surprise-title">
            <Sparkles className="sparkle-icon" />
            Surprise Me
          </h1>
          <p className="surprise-subtitle">
            Describe your mood, and let our AI find the perfect hidden gem for
            you.
          </p>

          <div className="input-group">
            <textarea
              className="mood-input"
              placeholder="I'm feeling adventurous and hungry for something spicy..."
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              rows={4}
            />
            <button
              className={`surprise-btn ${loading ? "loading" : ""}`}
              onClick={handleSurprise}
              disabled={loading || !mood.trim()}
            >
              {loading ? "Finding the perfect gem..." : "Surprise Me!"}
            </button>
          </div>

          {suggestion && (
            <div className="suggestion-card fade-in">
              <img
                src={suggestion.image}
                alt={suggestion.name}
                className="suggestion-image"
              />
              <div className="suggestion-info">
                <h3>{suggestion.name}</h3>
                <p>{suggestion.description}</p>
                <div className="suggestion-rating">★ {suggestion.rating}</div>
              </div>
            </div>
          )}
        </div>

        <div className="surprise-right">
          <BounceCards
            className="custom-bounce-cards"
            images={images}
            containerWidth={500}
            containerHeight={500}
            animationDelay={1}
            animationStagger={0.08}
            easeType="elastic.out(1, 0.5)"
            transformStyles={[
              "rotate(10deg) translate(-170px)",
              "rotate(5deg) translate(-85px)",
              "rotate(-3deg)",
              "rotate(-10deg) translate(85px)",
              "rotate(2deg) translate(170px)",
            ]}
            enableHover={true}
          />
        </div>
      </div>
    </div>
  );
}
