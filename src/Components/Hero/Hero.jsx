import React, { useState, useEffect, useRef } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import "./Hero.css";

export default function Hero({ slides = [], duration = 5000 }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  const startProgress = (startTime) => {
    const tick = (now) => {
      const elapsed = now - startTime;
      const ratio = Math.min(elapsed / duration, 1);
      setProgress(ratio * 100);

      if (ratio < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setIndex((prev) => (prev + 1) % slides.length);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!slides.length) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setProgress(0);
    startProgress(performance.now());

    return () => cancelAnimationFrame(rafRef.current);
  }, [index, slides, duration]);

  const goTo = (i) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIndex(i);
    setProgress(0);
  };

  return (
    <section className="hero-section">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`hero-slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${s.image})` }}
        >
          <div className="hero-overlay">
            <h1 className="hero-title">{s.title}</h1>
            {s.subtitle && <p className="hero-subtitle">{s.subtitle}</p>}
          </div>
        </div>
      ))}

      {/* Horizontal MUI Progress Bars */}
      <div className="progress-container">
        {slides.slice(0, 4).map((_, i) => (
          <Box
            key={i}
            onClick={() => goTo(i)}
            sx={{ flex: 1, cursor: "pointer" }}
          >
            <LinearProgress
              variant="determinate"
              value={i < index ? 100 : i === index ? progress : 0}
              sx={{
                height: 15,
                width: 15,
                borderRadius: 5,
                transform: "rotate(90deg)",
                backgroundColor: "rgba(255,255,255,0.18)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "rgba(255,255,255,0.95)",
                  transition: "width 0.1s linear",
                },
              }}
            />
          </Box>
        ))}
      </div>
    </section>
  );
}
