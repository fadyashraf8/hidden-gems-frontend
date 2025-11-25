import { Container, Box, Typography } from "@mui/material";
import { Link } from 'react-router-dom'; 
import '../NavBar/NavBar.css'


const ICON_COLOR = '#DD0303';

const CategoryItem = ({ label, path, lightBg, darkBg }) => (
    <Box 
        component={Link} 
        to={path}
        sx={{ 
            textDecoration: 'none',
            color: 'white',
            width: '100%',
            aspectRatio: '1 / 1', //square
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            borderRadius: 2,
            boxShadow: 3,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            overflow: 'hidden',
            '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: 10,
            },
                                                    // --- 2. Background Image Settings (Light Mode Default) ---
            backgroundImage: `url(${lightBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
                                
                                // --- 4. Dark Mode Override ---
                                // This selector says: "When a parent (like body) has class .dark, apply these styles to ME (&)"
            '.dark-mode &': {
             backgroundImage: `url(${darkBg})`,
             color: "black"
            }
         

        }}
    >
        {/* <Icon sx={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: ICON_COLOR, mb: 1 }} />
         */}
        <Typography 
            variant="h4" 
            sx={{ 
                fontWeight: 'bold',
                fontSize: 'clamp(0.7rem, 1.4vw, 2rem)', 
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
        { lightBg: "images/DFood1.jpg",darkBg: "images/DFood1.jpg",label: 'Restaurants', path: '/restaurants' },
        { lightBg: "images/LShopping1.jpg",darkBg: "images/LShopping1.jpg",label: 'Shopping', path: '/shopping' },
        { lightBg: "images/LActive1.jpg",darkBg: "images/LActive2.jpg",label: 'Active Life', path: '/active-life' },
        { lightBg: "images/LSpa.jpg",darkBg: "images/DSpa1.jpg",label: 'Spa & Wellness', path: '/spa' },
        { lightBg: "images/LCoffee1.jpg",darkBg: "images/DCoffee1.jpg",label: 'Coffee Shops', path: '/coffee' },
        { lightBg: "images/LMore1.jpg",darkBg: "images/DMore1.jpg",label: 'More', path: '/more' },
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
                            // Icon={category.Icon} 
                            label={category.label}
                            path={'places/' + category.path}
                            lightBg={category.lightBg}
                            darkBg={category.darkBg}
                        />
                    ))}
                </Box>

            </Container>
        
    );
}