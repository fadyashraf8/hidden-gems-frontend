import * as React from "react";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { Typography } from "@mui/material";

// --- Configuration ---
const TOTAL_STARS = 5;
const STAR_COLOR = "white"; 
const STAR_SIZE = "1rem"; 
const BOX_SIZE = "1.5rem"; 

// --- Color Logic Helper ---
const getRatingColor = (ratingValue) => {
  if (ratingValue >= 4.5) {
    return "#FA812F";
  } else if (ratingValue >= 3 && ratingValue < 4.5) {
    return "#FAB12F";
  } else {
    return "#FEF3E2";
  }
};

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const getLabel = (value) => labels[value] || "Select a rating";

export default function RatingStars({
  value,
  rating,
  onChange,
  readOnly = false,
  showLabel = true,
}) {
  const [hover, setHover] = React.useState(-1);

  const numericValue =
    typeof value === "number" ? value : typeof rating === "number" ? rating : 0;

  React.useEffect(() => {
    setHover(-1);
  }, [numericValue]);

  // Use the hover value if active, otherwise the actual value
  const displayValue = hover !== -1 && !readOnly ? hover : Number(numericValue) || 0;
  const clampedValue = Math.min(Math.max(displayValue, 0), TOTAL_STARS);
  const overallColor = getRatingColor(clampedValue);

  // --- New Helper: Calculate Score based on mouse position ---
  const calculateScore = (event, index) => {
    const { width, left } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    // If clicked on the left half (less than 50% width), add 0.5, else add 1
    const isHalf = x < width / 2;
    return index + (isHalf ? 0.5 : 1);
  };

  const handleClick = (event, index) => {
    if (readOnly || typeof onChange !== "function") return;
    const newValue = calculateScore(event, index);
    onChange(newValue);
  };

  const handleMouseMove = (event, index) => {
    if (readOnly) return;
    const newValue = calculateScore(event, index);
    setHover(newValue);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHover(-1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: showLabel ? 2 : 0,
        p: "0.25rem",
        width: "fit-content",
        justifyContent: "center",
      }}
    >
      {/* --- Individual Star Boxes Row --- */}
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {Array.from({ length: TOTAL_STARS }).map((_, index) => {
          // Logic for Fill State
          const isFull = clampedValue >= index + 1;
          const isHalf = !isFull && clampedValue >= index + 0.5;

          // Logic for Background Color (Solid or Gradient)
          let boxBackground = "#E0E0E0"; // Default Empty Gray
          
          if (isFull) {
             // Fully filled box
            boxBackground = overallColor;
          } else if (isHalf) {
             // Half filled: Linear Gradient (Color | Gray)
            boxBackground = `linear-gradient(90deg, ${overallColor} 50%, #E0E0E0 50%)`;
          }

          return (
            <Box
              key={index}
              onClick={(e) => handleClick(e, index)}
              onMouseMove={(e) => handleMouseMove(e, index)} // Changed from onMouseEnter to onMouseMove
              onMouseLeave={handleMouseLeave}
              sx={{
                width: BOX_SIZE,
                height: BOX_SIZE,
                background: boxBackground, // Apply the gradient or solid color
                borderRadius: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: readOnly ? "default" : "pointer",
                transition: "transform 0.2s", // Removed background-color transition because gradients don't animate well
                transform:
                  // Check if this specific box is being hovered
                  (hover >= index + 0.5 && hover <= index + 1) && !readOnly
                    ? "translateY(-2px)"
                    : "none",
              }}
            >
              <StarIcon
                sx={{
                  color: STAR_COLOR,
                  fontSize: STAR_SIZE,
                  // If it's half or full, opacity is 1. If empty, 0.6
                  opacity: isFull || isHalf ? 1 : 0.6,
                }}
              />
            </Box>
          );
        })}
      </Box>

      {/* --- Rating Label --- */}
      {showLabel && (
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: STAR_SIZE,
            color: overallColor,
            minWidth: "150px",
          }}
        >
          {getLabel(clampedValue)} ({clampedValue || 0})
        </Typography>
      )}
    </Box>
  );
}