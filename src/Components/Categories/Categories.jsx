import { Stack, Box, Typography } from "@mui/material";
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import TapasTwoToneIcon from '@mui/icons-material/TapasTwoTone';
import StadiumTwoToneIcon from '@mui/icons-material/StadiumTwoTone';
import SpaTwoToneIcon from '@mui/icons-material/SpaTwoTone';
import CoffeeMakerTwoToneIcon from '@mui/icons-material/CoffeeMakerTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';

const ICON_COLOR = '#DD0303';
const CUBE_SIZE = 140; // MODIFIED: Increased size for a bigger cube

const CategoryItem = ({ Icon, label }) => (
    // PINPOINT 4: Added 3D Hover/Shadow Effect
    <Box 
        sx={{ 
            // MODIFIED: Increased width/height to the new CUBE_SIZE
            width: CUBE_SIZE, 
            height: CUBE_SIZE, 
            bgcolor: '#FFFFFF', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            borderRadius: 2,
            
            // 3D EFFECT STYLING
            boxShadow: 3, // Initial elevation/shadow
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            '&:hover': {
                transform: 'translateY(-6px)', // Lifts the cube
                boxShadow: 10, // Increased shadow for depth
            }
        }}
    >
        <Icon sx={{ fontSize: 48, color: ICON_COLOR }} /> {/* Increased icon size slightly */}
        <Typography variant="caption" sx={{ mt: 1, fontWeight: 'bold' }}>{label}</Typography>
    </Box>
);


export default function Categories() {
    return (
        // Outer Stack for Header + Content. Spacing reduced to 1.
        <Stack direction="column" spacing={5} sx={{ width: '100%', margin: '0 auto', p: 1 }}>
            
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
                Categories
            </Typography>

            {/* Container for the two rows. */}
            <Stack 
                direction="column" 
                spacing={5} 
                sx={{ 
                    padding: 0 
                }}
            >
                {/* ROW 1: Horizontal Stack (3 cubes) - Spacing reduced to 0.5 */}
                <Stack direction="row" spacing={0.5} justifyContent="space-around"> 
                    <CategoryItem Icon={TapasTwoToneIcon} label="Restaurants" />
                    <CategoryItem Icon={ShoppingCartTwoToneIcon} label="Shopping" />
                    <CategoryItem Icon={StadiumTwoToneIcon} label="Active Life" />
                </Stack>

                {/* ROW 2: Horizontal Stack (3 cubes) - Spacing reduced to 0.5 */}
                <Stack direction="row" spacing={0.5} justifyContent="space-around">
                    <CategoryItem Icon={SpaTwoToneIcon} label="Spa & Wellness" />
                    <CategoryItem Icon={CoffeeMakerTwoToneIcon} label="Coffee Shops" />
                    <CategoryItem Icon={MoreHorizTwoToneIcon} label="More" />
                </Stack>
            </Stack>
        </Stack>
    );
}