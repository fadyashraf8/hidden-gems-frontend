import * as React from "react";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { Typography } from "@mui/material";

// --- Configuration ---
const TOTAL_STARS = 5;
const STAR_COLOR = "white"; // Stars are always white
const STAR_SIZE = "1rem"; // Size of the star icon
const BOX_SIZE = "1.5rem"; // Fixed size for better visibility

// --- Color Logic Helper (No Change) ---
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

// Helper to get the correct label text
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

  const displayValue =
    hover !== -1 && !readOnly ? hover : Number(numericValue) || 0;
  const clampedValue = Math.min(Math.max(displayValue, 0), TOTAL_STARS);
  const overallColor = getRatingColor(clampedValue);

  const handleStarClick = (starValue) => {
    if (readOnly || typeof onChange !== "function") return;
    onChange(starValue);
  };

  const handleMouseEnter = (starValue) => {
    if (readOnly) return;
    setHover(starValue);
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
          const starValue = index + 1;
          const isFilled = starValue <= clampedValue;
          const boxColor = isFilled ? overallColor : "#E0E0E0";

          return (
            <Box
              key={index}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              sx={{
                width: BOX_SIZE,
                height: BOX_SIZE,
                bgcolor: boxColor,
                borderRadius: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: readOnly ? "default" : "pointer",
                transition: "background-color 0.2s, transform 0.2s",
                transform:
                  hover === starValue && !readOnly
                    ? "translateY(-2px)"
                    : "none",
              }}
            >
              <StarIcon
                sx={{
                  color: STAR_COLOR,
                  fontSize: STAR_SIZE,
                  opacity: isFilled ? 1 : 0.6,
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
