import { Stack, Box, Typography, Grid } from "@mui/material"; // 👈 Import Grid
import { useTranslation } from 'react-i18next';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import TapasTwoToneIcon from '@mui/icons-material/TapasTwoTone';
import StadiumTwoToneIcon from '@mui/icons-material/StadiumTwoTone';
import SpaTwoToneIcon from '@mui/icons-material/SpaTwoTone';
import CoffeeMakerTwoToneIcon from '@mui/icons-material/CoffeeMakerTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';

const ICON_COLOR = '#DD0303';
// We use a responsive height/width within the Grid column now.

const CategoryItem = ({ Icon, label }) => (
    <Box 
        sx={{ 
            // Control the item's max size within the Grid column
            width: '100%', 
            minWidth: 150, // Prevents shrinking too much on small screens
            height: 150,   // Fixed height for aspect ratio control
            bgcolor: '#FFFFFF', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            borderRadius: 2,
            
            // 3D EFFECT STYLING
            boxShadow: 3,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            '&:hover': {
                transform: 'translateY(-6px)',
                boxBoxShadow: 10,
            }
        }}
    >
        <Icon sx={{ fontSize: 48, color: ICON_COLOR }} />
        <Typography variant="caption" sx={{ mt: 1, fontWeight: 'bold' }}>{label}</Typography>
    </Box>
);


export default function Categories() {
    const { t } = useTranslation('categories');
    
    // Define the category items data using translation keys
    const categoriesData = [
        { Icon: TapasTwoToneIcon, key: 'category_restaurants' },
        { Icon: ShoppingCartTwoToneIcon, key: 'category_shopping' },
        { Icon: StadiumTwoToneIcon, key: 'category_active_life' },
        { Icon: SpaTwoToneIcon, key: 'category_spa_wellness' },
        { Icon: CoffeeMakerTwoToneIcon, key: 'category_coffee_shops' },
        { Icon: MoreHorizTwoToneIcon, key: 'category_more' },
    ];

    return (
        <Stack direction="column" spacing={4} sx={{ width: '100%', margin: '0 auto', p: 1, maxWidth: 900 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                {t('title')}
            </Typography>
            
            {/* Grid Container for Layout */}
            <Grid 
                container 
                // Set the gap between items to match original stacking look
                gap={{ xs: 1, sm: 2 }} 
                // Use flexbox property to mimic 'space-around' and center the grid
                justifyContent="center"
            >
                {categoriesData.map((category, index) => (
                    // Grid Item: Uses modern sizing syntax
                    <Grid 
                        key={category.key || index} // Use translation key as unique identifier
                        sx={{
                            // xs (0+ px): Takes 6/12 columns (50% width -> 2 items per row)
                            // sm (600+ px): Takes 4/12 columns (33.3% width -> 3 items per row)
                            gridColumn: {
                                xs: 'span 6', 
                                sm: 'span 4',
                            }
                        }}
                    > 
                        <CategoryItem 
                            Icon={category.Icon} 
                            label={t(category.key)} 
                        />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}