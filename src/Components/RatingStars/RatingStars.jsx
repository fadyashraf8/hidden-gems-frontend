import * as React from 'react';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { Typography } from '@mui/material';

// --- Configuration ---
const TOTAL_STARS = 5;
const STAR_COLOR = 'white'; // Stars are always white
const STAR_SIZE = '1rem'; // Size of the star icon
const BOX_SIZE = '1.5rem'; // Fixed size for better visibility

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

export default function RatingStars({ value, onChange }) {

  const [hover, setHover] = React.useState(-1);

  const displayValue = hover !== -1 ? hover : value;
  const overallColor = getRatingColor(displayValue);

  const handleStarClick = (starValue) => {
    onChange(starValue); 
  };

  return (
    <Box sx={{ 
        display: 'flex', 
        // CHANGED: 'row' puts them side-by-side
        flexDirection: 'row', 
        alignItems: 'center', 
        // CHANGED: 'gap' adds space between the stars and the text
        gap: 2, 
        p: '0.5rem', 
        width: 'fit-content', 
        justifyContent: 'center' 
    }}>
        
        {/* --- Individual Star Boxes Row --- */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            {Array.from({ length: TOTAL_STARS }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= displayValue;
                const boxColor = isFilled ? overallColor : '#E0E0E0'; 

                return (
                    <Box
                        key={index}
                        onClick={() => handleStarClick(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(-1)}
                        sx={{
                            width: BOX_SIZE,
                            height: BOX_SIZE,
                            bgcolor: boxColor, 
                            borderRadius: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                    >
                        <StarIcon 
                            sx={{ 
                                color: STAR_COLOR, 
                                fontSize: STAR_SIZE,
                                opacity: isFilled ? 1 : 0.6 
                            }} 
                        />
                    </Box>
                );
            })}
        </Box>

        {/* --- Rating Label --- */}
        <Typography 
          // variant='h6'
          sx={{ 
            fontWeight: 'bold',
            fontSize: STAR_SIZE,
            color: overallColor, 
            minWidth: '150px' // Optional: prevents jumping when text length changes
          }}
        >
          {getLabel(displayValue)} ({displayValue})
        </Typography>
    </Box>
  );
}