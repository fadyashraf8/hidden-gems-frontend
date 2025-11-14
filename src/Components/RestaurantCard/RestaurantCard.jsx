import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// 📌 PINPOINT 1: Import Tooltip component
import Tooltip from '@mui/material/Tooltip'; 
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import RatingStars from '../RatingStars/RatingStars.jsx'; 

const ACTION_COLOR = '#DD0303';
const DEFAULT_COLOR = 'text.secondary';

// Define the data and labels for the action icons
const actionIcons = [
    { Icon: LightbulbOutlinedIcon, label: 'Insight', key: 'insight' },
    { Icon: WavingHandOutlinedIcon, label: 'Appreciation', key: 'appreciation' },
    { Icon: FavoriteBorderOutlinedIcon, label: 'Love', key: 'love' },
    { Icon: SentimentVeryDissatisfiedOutlinedIcon, label: 'Oh No', key: 'ohno' },
];

// --- Reusable Component for Individual Icons with Tooltip ---
const ActionIcon = ({ iconData, selectedAction, setSelectedAction }) => {
    // Determine the color based on selection
    const isSelected = selectedAction === iconData.key;
    
    // Icon color is ACTION_COLOR if selected, otherwise DEFAULT_COLOR
    const iconColor = isSelected ? ACTION_COLOR : DEFAULT_COLOR;

    const handleClick = () => {
        const newSelection = isSelected ? null : iconData.key; 
        setSelectedAction(newSelection);
        console.log(`Action: ${newSelection ? newSelection : 'None'} selected.`);
    };
    
    return (
        // 📌 PINPOINT 2: Wrap the IconButton in Tooltip
        <Tooltip 
            title={iconData.label} // The descriptive word (note)
            placement="top"       // Position the note above the icon
            arrow                 // Adds a small arrow pointing to the icon
        >
            <IconButton 
                aria-label={iconData.label}
                onClick={handleClick} 
                // We no longer need onMouseEnter/onMouseLeave since Tooltip handles the hover state
                // However, we still want hover to change color, so we use MUI's pseudo-class styling
            >
                <iconData.Icon sx={{ 
                    color: iconColor,
                    transition: 'color 0.2s',
                    // 📌 PINPOINT 3: Add hover color change directly in sx
                    '&:hover': {
                        color: ACTION_COLOR, 
                    }
                }} />
            </IconButton>
        </Tooltip>
    );
};
// --- End Reusable Component ---


export default function ReviewCard() {
    // 📌 PINPOINT 4: Removed unnecessary 'hoveredAction' state
    const [selectedAction, setSelectedAction] = React.useState(null); 
    
    // Placeholder data...
    const reviewData = {
        reviewerName: "Jinha K.",
        timestamp: "1 hour ago",
        restaurantName: "Camino Alto",
        rating: 4.0, 
        reviewText: "Ordered lunch from the weekend daytime menu over the weekend and we had a pleasant...",
    };
    const REVIEW_RED_COLOR = '#E74C3C';

    return (
        <Card sx={{ maxWidth: 345, margin: '0 auto', boxShadow: 3 }}>
            
            <CardHeader title="Jinha K. wrote a review" action={<Typography variant="caption">1 hour ago</Typography>} />
            <CardMedia component="img" height="194" image="https://via.placeholder.com/345x194" alt="Review photo" />
            
            <CardContent sx={{ pb: 1 }}> 
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {reviewData.restaurantName}
                </Typography>
                
                <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.4 }}>
                    {reviewData.reviewText}
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold', mt: 0.5 }}>
                    Read more
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <RatingStars rating={reviewData.rating} readOnly={true} color={REVIEW_RED_COLOR} />
                </Box>
            </CardContent>

            {/* --- Modified CardActions: Bottom Icon Bar --- */}
            <CardActions sx={{ 
                // 📌 PINPOINT 5: Simplified CardActions since the word display Box is gone
                justifyContent: 'space-around', 
                borderTop: '1px solid #eee', 
                p: 1.5,
            }}>
                {/* Icon Row (now the only content in CardActions) */}
                <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                    {actionIcons.map((action) => (
                        <ActionIcon 
                            key={action.key}
                            iconData={action}
                            selectedAction={selectedAction} 
                            setSelectedAction={setSelectedAction} 
                        />
                    ))}
                </Box>
            </CardActions>
        </Card>
    );
}