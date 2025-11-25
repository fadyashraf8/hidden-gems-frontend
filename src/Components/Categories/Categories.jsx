import { Container, Box, Typography } from "@mui/material";
import { Link } from 'react-router-dom'; 

import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import TapasTwoToneIcon from '@mui/icons-material/TapasTwoTone';
import StadiumTwoToneIcon from '@mui/icons-material/StadiumTwoTone';
import SpaTwoToneIcon from '@mui/icons-material/SpaTwoTone';
import CoffeeMakerTwoToneIcon from '@mui/icons-material/CoffeeMakerTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';

const ICON_COLOR = '#DD0303';

const CategoryItem = ({ Icon, label, path }) => (
    <Box 
        // NAVIGATION: Use 'component={Link}' to make the MUI Box act like a React Router Link
        component={Link} 
        to={path}
        
        sx={{ 
            // STYLE RESET: Remove default link underlining and blue color
            textDecoration: 'none',
            color: 'inherit',

            // SIZE & SHAPE:
            width: '100%',
            aspectRatio: '1 / 1', 
            
            bgcolor: '#FFFFFF', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            borderRadius: 2,
            
            // 3D Hover Effects
            boxShadow: 3,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            overflow: 'hidden',
            '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: 10,
            }
        }}
    >
        <Icon sx={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: ICON_COLOR, mb: 1 }} />
        
        <Typography 
            variant="h5" 
            sx={{ 
                fontWeight: 'bold',
                fontSize: 'clamp(0.7rem, 1.4vw, 1.1rem)', 
                textAlign: 'center',
                px: 0.5,
                lineHeight: 1.1,
                wordBreak: 'break-word'
            }}
        >
            {label}
        </Typography>
    </Box>
);

export default function Categories() {
    
    const categoriesData = [
        { Icon: TapasTwoToneIcon, label: 'Restaurants', path: '/restaurants' },
        { Icon: ShoppingCartTwoToneIcon, label: 'Shopping', path: '/shopping' },
        { Icon: StadiumTwoToneIcon, label: 'Active Life', path: '/active-life' },
        { Icon: SpaTwoToneIcon, label: 'Spa & Wellness', path: '/spa' },
        { Icon: CoffeeMakerTwoToneIcon, label: 'Coffee Shops', path: '/coffee' },
        { Icon: MoreHorizTwoToneIcon, label: 'More', path: '/more' },
    ];

    return (
        
            <Container maxWidth="md" sx={{ py: 4 }}>
                
                <Typography 
                    variant="h3" 
                    component="h2" 
                    sx={{ 
                        fontWeight: 'bold', 
                        textAlign: 'center', 
                        mb: 4,
                        fontSize: { xs: '2rem', md: '3rem' }
                    }}
                >
                    Browse Categories
                </Typography>

                <Box 
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: 2, 
                        width: '100%'
                    }}
                >
                    {categoriesData.map((category, index) => (
                        <CategoryItem 
                            key={index}
                            Icon={category.Icon} 
                            label={category.label}
                            path={category.path}
                        />
                    ))}
                </Box>

            </Container>
        
    );
}