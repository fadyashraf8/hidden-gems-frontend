// components/BusinessCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Grid, Box, Typography, Rating } from '@mui/material';
import { BASE_URL, THEME } from './constants';

const PlaceCard = ({ data, rank }) => {
  const navigate = useNavigate(); 

  const handleCardClick = () => {
    navigate(`/gems/${data._id}`);
  };

  const mainImage = data.images && data.images.length > 0 
    ? `${BASE_URL}/uploads/gem/${data.images[0]}` 
    : "https://via.placeholder.com/600x400?text=No+Image";

  const categoryName = data.category?.categoryName || "Uncategorized";

  return (
    <Paper 
        elevation={0} 
        onClick={handleCardClick} 
        sx={{ 
            p: 0, 
            border: '1px solid #e0e0e0', 
            borderRadius: 2, 
            overflow: 'hidden',
            cursor: 'pointer', 
            transition: 'all 0.2s',
            '&:hover': { 
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)' 
            } 
    }}>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <Box 
            component="img"
            src={mainImage}
            alt={data.name}
            sx={{ width: '100%', height: '100%', minHeight: 200, objectFit: 'cover' }}
          />
        </Grid>

        <Grid item xs={12} sm={8} sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.DARK, mb: 0.5 }}>
                    {rank}. {data.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={data.avgRating || 0} precision={0.5} readOnly sx={{ color: THEME.RED, fontSize: '1.2rem' }} />
                    <Typography variant="body2" sx={{ ml: 1, color: THEME.DARK, fontWeight: 700 }}>
                        0 reviews
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: THEME.DARK, mb: 0.5 }}>
                    <span style={{ fontWeight: 600 }}>{categoryName}</span>
                    <span style={{ margin: '0 6px', color: THEME.GREY }}>•</span>
                    {data.price || "$$"} 
                    <span style={{ margin: '0 6px', color: THEME.GREY }}>•</span>
                    {data.gemLocation}
                </Typography>

                <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ color: THEME.GREY, fontSize: '0.9rem', lineHeight: 1.5 }}>
                        "{data.description ? data.description.substring(0, 100) : ''}..." 
                        <span style={{ color: THEME.RED, fontWeight: 600, cursor: 'pointer', marginLeft: '5px' }}>more</span>
                      </Typography>
                </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PlaceCard;