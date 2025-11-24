import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Rating, 
  Grid, 
  Stack, 
  Divider,
  Paper,
  InputBase,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import ChatBubbleOutlineIcon from '@mui/icons-mataerial/ChatBubbleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TuneIcon from '@mui/icons-material/Tune';

// --- THEME COLORS (Matching Gemsy/Categories) ---
const BRAND_RED = '#DD0303'; 
const TEXT_DARK = '#2D2E2F';
const TEXT_GREY = '#6E7072';
const BG_LIGHT = '#FFFFFF';

// --- MOCK DATA FOR SHOPPING CATEGORY ---
const BUSINESS_DATA = {
  id: 1,
  name: "La Bijouterie",
  rating: 4.9,
  reviewCount: 330,
  category: "Jewelry, Gold Buyers",
  price: "$$",
  location: "Financial District",
  status: "Closed",
  nextOpen: "11:00 AM tomorrow",
  tags: ["Family-owned & operated", "Available by appointment"],
  snippet: "Your search for a jeweler should stop here. Set is, without a doubt, the best and most trustworthy craftsman I've ever met. When I first was shopping...",
  imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=75&w=600&auto=format&fit=crop", 
  gallery: [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=75&w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=75&w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=75&w=600&auto=format&fit=crop&q=60"
  ]
};

const FILTERS = ["Price", "Open Now", "Credit Cards", "Open to All", "Military Discount"];

// --- COMPONENTS ---

// 1. BRANDED NAVBAR
const NavBar = () => (
  <Box sx={{ borderBottom: '1px solid #e0e0e0', py: 2, mb: 2, bgcolor: 'white', position: 'sticky', top: 0, zIndex: 1100 }}>
    <Container maxWidth="lg" sx={{ display: 'flex', gap: { xs: 1, md: 3 }, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Brand Logo */}
      <Typography variant="h4" sx={{ color: BRAND_RED, fontWeight: 900, mr: 1, letterSpacing: '-1px' }}>
        Gemsy
      </Typography>
      
      {/* Search Bar */}
      <Paper sx={{ 
          p: '2px 4px', display: 'flex', alignItems: 'center', 
          width: { xs: '100%', md: 500 }, order: { xs: 3, md: 2 }, mt: { xs: 1, md: 0 },
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)', borderRadius: 2, border: '1px solid #eee'
      }}>
        <InputBase sx={{ ml: 2, flex: 1, fontWeight: 'bold', fontSize: '0.95rem' }} placeholder="Searching for..." defaultValue="Shopping" />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <InputBase sx={{ ml: 2, flex: 1, fontSize: '0.95rem' }} placeholder="Location" defaultValue="San Francisco, CA" />
        <Box sx={{ bgcolor: BRAND_RED, p: 1.2, borderRadius: '0 4px 4px 0', display: 'flex', cursor: 'pointer' }}>
            <SearchIcon sx={{ color: 'white' }} />
        </Box>
      </Paper>

      <Box sx={{ flexGrow: 1, order: { xs: 2, md: 3 } }} />
      
      {/* Nav Links */}
      <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, order: 4 }}>
        <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>Log In</Button>
        <Button variant="contained" size="small" sx={{ bgcolor: BRAND_RED, textTransform: 'none', borderRadius: 2, px: 3, fontWeight: 700, '&:hover': { bgcolor: '#b30000' } }}>Sign Up</Button>
      </Stack>
    </Container>
  </Box>
);

// 2. FILTER SCROLL BAR
const FilterBar = () => (
  <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1, '::-webkit-scrollbar': { display: 'none' } }}>
    <Chip 
        icon={<TuneIcon sx={{ fontSize: '1rem !important' }} />} 
        label="All Filters" 
        variant="outlined" 
        onClick={() => {}}
        sx={{ borderRadius: 2, fontWeight: 600, color: TEXT_DARK, borderColor: '#ccc', height: 36 }}
    />
    {FILTERS.map((label) => (
        <Chip 
            key={label}
            label={label}
            variant="outlined"
            onClick={() => {}}
            deleteIcon={<KeyboardArrowDownIcon />}
            onDelete={() => {}} // Just adds the arrow icon visually
            sx={{ borderRadius: 2, fontWeight: 500, color: TEXT_DARK, borderColor: '#ddd', bgcolor: 'white', height: 36, '& .MuiChip-deleteIcon': { color: TEXT_GREY } }}
        />
    ))}
  </Stack>
);

// 3. MAIN BUSINESS CARD
const BusinessCard = ({ data, rank }) => {
  return (
    <Paper elevation={0} sx={{ 
        p: 0, 
        border: '1px solid #e0e0e0', 
        borderRadius: 2, 
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } 
    }}>
      <Grid container>
        
        {/* IMAGE SECTION */}
        <Grid item xs={12} sm={4}>
          <Box 
            component="img"
            src={data.imageUrl}
            alt={data.name}
            sx={{ width: '75%', height: '20%', minHeight: 220, objectFit: 'cover' }}
          />
        </Grid>

        {/* CONTENT SECTION */}
        <Grid item xs={12} sm={8} sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: TEXT_DARK, mb: 0.5 }}>
                    {rank}. {data.name}
                </Typography>
                
                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={data.rating} precision={0.1} readOnly sx={{ color: BRAND_RED, fontSize: '1.2rem' }} />
                    <Typography variant="body2" sx={{ ml: 1, color: TEXT_DARK, fontWeight: 700 }}>
                        {data.reviewCount} reviews
                    </Typography>
                </Box>

                {/* Meta Data */}
                <Typography variant="body2" sx={{ color: TEXT_DARK, mb: 0.5 }}>
                    <span style={{ fontWeight: 600 }}>{data.category}</span>
                    <span style={{ margin: '0 6px', color: TEXT_GREY }}>•</span>
                    {data.price}
                    <span style={{ margin: '0 6px', color: TEXT_GREY }}>•</span>
                    {data.location}
                </Typography>

                {/* Status */}
                <Typography variant="body2" sx={{ mb: 1.5, fontSize: '0.9rem' }}>
                    <span style={{ color: BRAND_RED, fontWeight: 700 }}>{data.status}</span>
                    <span style={{ color: TEXT_DARK }}> until {data.nextOpen}</span>
                </Typography>

                {/* Snippet */}
                <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                     {/* <ChatBubbleOutlineIcon sx={{ color: TEXT_GREY, fontSize: 18, mt: 0.3 }} /> */}
                     <Typography variant="body2" sx={{ color: TEXT_GREY, fontSize: '0.9rem', lineHeight: 1.5 }}>
                        "{data.snippet} <span style={{ color: BRAND_RED, fontWeight: 600, cursor: 'pointer' }}>more</span>"
                     </Typography>
                </Box>
            </Box>
          </Box>
          
          {/* Gallery Thumbnails */}
          <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
             {data.gallery.map((img, idx) => (
                 <Box 
                    key={idx}
                    component="img" 
                    src={img} 
                    sx={{ width: 64, height: 64, borderRadius: 2, objectFit: 'cover', cursor: 'pointer', border: '1px solid #eee' }}
                 />
             ))}
             <Box sx={{ 
                 width: 80, height: 64, borderRadius: 2, bgcolor: '#f7f7f7', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 cursor: 'pointer', border: '1px solid #eee'
            }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: TEXT_GREY }}>+5 more</Typography>
             </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

// --- MAIN PAGE LAYOUT ---
export default function CategoriesPage() {
  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', pb: 8 }}>
        
        <NavBar />

        <Container maxWidth="lg">
            
            {/* Breadcrumb-ish Links */}
            <Stack direction="row" spacing={3} sx={{ mb: 3, display: { xs: 'none', md: 'flex' } }}>
                {['Restaurants', 'Home & Garden', 'Auto Services', 'Health & Beauty'].map(cat => (
                    <Typography key={cat} variant="body2" sx={{ fontWeight: 600, color: TEXT_GREY, cursor: 'pointer', '&:hover': { color: BRAND_RED } }}>
                        {cat}
                    </Typography>
                ))}
            </Stack>

            <Divider sx={{ mb: 4, borderColor: '#eee' }} />

            {/* Page Title */}
            <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: TEXT_DARK, mb: 1 }}>
                    Top 10 Best Shopping Near San Francisco, CA
                </Typography>
                <Typography variant="body1" sx={{ color: TEXT_GREY }}>
                    Showing results for <span style={{ fontWeight: 700, color: TEXT_DARK }}>"Shopping"</span>
                </Typography>
            </Box>

            <FilterBar />

            <Grid container spacing={4}>
                {/* Main Content Column */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: TEXT_DARK }}>
                        All Results
                    </Typography>
                    
                    <Stack spacing={3}>
                        <BusinessCard data={BUSINESS_DATA} rank={1} />
                        
                        {/* Mocking a second item to show list style */}
                        <BusinessCard 
                            rank={2}
                            data={{
                                ...BUSINESS_DATA, 
                                name: "Union Square Shopping", 
                                id: 2, 
                                imageUrl: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=2070&auto=format&fit=crop",
                                rating: 4.5,
                                reviewCount: 1024,
                                category: "Shopping Centers",
                                status: "Open Now",
                                nextOpen: "10:00 PM"
                            }} 
                        />
                    </Stack>
                </Grid>

                {/* Sidebar (Map placeholder) */}
                <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Box sx={{ position: 'sticky', top: 100 }}>
                        <Paper 
                            sx={{ 
                                height: 400, 
                                bgcolor: '#f0f0f0', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                border: '1px solid #ddd',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 700, color: TEXT_GREY }}>
                                Interactive Map Area
                            </Typography>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
            
        </Container>
    </Box>
  );
}