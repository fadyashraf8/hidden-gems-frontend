import * as React from 'react';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { Typography } from '@mui/material';

// --- Configuration ---
const TOTAL_STARS = 5;
const STAR_COLOR = 'white'; // Stars are always white
const STAR_SIZE = 10; // Size of the star icon
const BOX_SIZE = 15; // Size of the colored box container

// --- Color Logic Helper (No Change) ---
const getRatingColor = (ratingValue) => {
    if (ratingValue >= 4.5) {
        return '#FA812F';
    } else if (ratingValue >= 3 && ratingValue < 4.5) {
        return '#FAB12F';
    } else {
        return '#FEF3E2';
    }
};

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

// Helper to get the correct label text
const getLabel = (value) => labels[value] || 'Select a rating';

export default function RatingStarsIndividualBoxes() {
  // Using a full integer value for display simplicity since we can't easily draw half-boxes
  const [value, setValue] = React.useState(3); 
  const [hover, setHover] = React.useState(-1);

  // Determine the value to use for display and logic
  const displayValue = hover !== -1 ? hover : value;
  
  // Determine the overall color based on the current rating
  const overallColor = getRatingColor(displayValue);

  // Function to handle click/selection
  const handleStarClick = (starValue) => {
    setValue(starValue === value ? 0 : starValue); // Toggle off if clicked again
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, width: '100%', margin: '0 auto' }}>
        
        {/* --- Individual Star Boxes Row --- */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
            {Array.from({ length: TOTAL_STARS }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= displayValue;

                // The color of the box is determined by the star's index and the current value
                const boxColor = isFilled ? overallColor : '#E0E0E0'; // Grey for unrated boxes

                return (
                    // 📌 PINPOINT 1: The individual colored Box container
                    <Box
                        key={index}
                        onClick={() => handleStarClick(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(-1)}
                        sx={{
                            width: BOX_SIZE,
                            height: BOX_SIZE,
                            bgcolor: boxColor, // Dynamic color for the box background
                            borderRadius: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                    >
                        {/* 📌 PINPOINT 2: The white star icon inside the box */}
                        <StarIcon 
                            sx={{ 
                                color: STAR_COLOR, // Always white
                                fontSize: STAR_SIZE,
                                opacity: isFilled ? 1 : 0.6 // Slightly dim the star in unrated boxes
                            }} 
                        />
                    </Box>
                );
            })}
        </Box>

        {/* --- Rating Label --- */}
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1rem',
            fontWeight: 'bold',
            color: overallColor, // Text color matches the main box color idea
          }}
        >
          {getLabel(displayValue)} ({displayValue} Stars)
        </Typography>
    </Box>
  );
}