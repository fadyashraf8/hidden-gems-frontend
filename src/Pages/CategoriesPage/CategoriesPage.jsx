import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { 
  Box, 
  Container, 
  Typography, 
  Rating, 
  Grid, 
  Stack, 
  Divider,
  Paper,
  InputBase,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TuneIcon from '@mui/icons-material/Tune';

// --- CONFIGURATION ---
const BASE_URL = "http://localhost:3000"; 

// --- THEME COLORS ---
const BRAND_RED = '#DD0303'; 
const TEXT_DARK = '#2D2E2F';
const TEXT_GREY = '#6E7072';

const FILTERS = ["Price", "Open Now", "Credit Cards", "Open to All", "Military Discount"];

// --- COMPONENTS ---

const FilterBar = () => (
  <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1, '::-webkit-scrollbar': { display: 'none' } }}>
    <Chip 
        icon={<TuneIcon sx={{ fontSize: '1rem !important' }} />} 
        label="All Filters" 
        variant="outlined" 
        sx={{ borderRadius: 2, fontWeight: 600, color: TEXT_DARK, borderColor: '#ccc', height: 36 }}
    />
    {FILTERS.map((label) => (
        <Chip 
            key={label}
            label={label}
            variant="outlined"
            deleteIcon={<KeyboardArrowDownIcon />}
            onDelete={() => {}} 
            sx={{ borderRadius: 2, fontWeight: 500, color: TEXT_DARK, borderColor: '#ddd', bgcolor: 'white', height: 36, '& .MuiChip-deleteIcon': { color: TEXT_GREY } }}
        />
    ))}
  </Stack>
);

const BusinessCard = ({ data, rank }) => {
  const navigate = useNavigate(); 

  const handleCardClick = () => {
    navigate(`/gems/${data._id}`);
  };

  const mainImage = data.images && data.images.length > 0 
    ? `${BASE_URL}/images/${data.images[0]}` 
    : "https://via.placeholder.com/600x400?text=No+Image";

  const categoryName = data.category && data.category.categoryName 
    ? data.category.categoryName 
    : "Uncategorized";

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
            transition: 'box-shadow 0.2s, transform 0.2s',
            '&:hover': { 
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)' 
            } 
    }}>
      <Grid container>
        {/* IMAGE SECTION */}
        <Grid item xs={12} sm={4}>
          <Box 
            component="img"
            src={mainImage}
            alt={data.name}
            sx={{ width: '100%', height: '100%', minHeight: 200, objectFit: 'cover' }}
          />
        </Grid>

        {/* CONTENT SECTION */}
        <Grid item xs={12} sm={8} sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                
                <Typography variant="h5" sx={{ fontWeight: 800, color: TEXT_DARK, mb: 0.5 }}>
                    {rank}. {data.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={data.avgRating || 0} precision={0.5} readOnly sx={{ color: BRAND_RED, fontSize: '1.2rem' }} />
                    <Typography variant="body2" sx={{ ml: 1, color: TEXT_DARK, fontWeight: 700 }}>
                        0 reviews
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: TEXT_DARK, mb: 0.5 }}>
                    <span style={{ fontWeight: 600 }}>
                       {categoryName}
                    </span>
                    <span style={{ margin: '0 6px', color: TEXT_GREY }}>•</span>
                    {data.price || "$$"} 
                    <span style={{ margin: '0 6px', color: TEXT_GREY }}>•</span>
                    {data.gemLocation}
                </Typography>

                {/* --- SHOW STATUS HERE --- */}
                {/* <Typography variant="body2" sx={{ mb: 1.5, fontSize: '0.9rem' }}>
                    <span style={{ 
                        color: 'green', // Always green since we filter for accepted
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        border: '1px solid green',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                    }}>
                        {data.status}
                    </span>
                </Typography> */}

                <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ color: TEXT_GREY, fontSize: '0.9rem', lineHeight: 1.5 }}>
                        "{data.description ? data.description.substring(0, 100) : ''}..." 
                        <span style={{ color: BRAND_RED, fontWeight: 600, cursor: 'pointer', marginLeft: '5px' }}>more</span>
                      </Typography>
                </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// --- MAIN PAGE LAYOUT ---
export default function CategoriesPage() {
  const { categoryName } = useParams(); 
  
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageTitle, setPageTitle] = useState("All Places");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const gemsRes = await fetch(`${BASE_URL}/gems`, { credentials: "include" });
        if (!gemsRes.ok) throw new Error("Failed to fetch gems");
        const gemsData = await gemsRes.json();
        let fetchedGems = gemsData.result || [];

        // 🟢 1. GLOBAL FILTER: Only show Accepted Gems
        fetchedGems = fetchedGems.filter(gem => gem.status === 'accepted');

        // 2. CATEGORY FILTER
        if (categoryName) {
            
            const targetNameLower = categoryName.toLowerCase();
            setPageTitle(`Best ${categoryName} in Town`);

            fetchedGems = fetchedGems.filter(gem => {
                if (!gem.category) return false; 
                if (typeof gem.category === 'object' && gem.category.categoryName) {
                    return gem.category.categoryName.toLowerCase() === targetNameLower;
                }
                return false;
           });
        } else {
            setPageTitle("Top Gems in San Francisco");
        }

        setGems(fetchedGems);

      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading data");
      }
      setLoading(false);
    }

    fetchData();
  }, [categoryName]);

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', pb: 12, pt: 8}}>
        <Container maxWidth="lg">
            
            <Stack direction="row" spacing={3} sx={{ mb: 3, display: { xs: 'none', md: 'flex' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_GREY }}>
                    Home &gt; Places &gt; <span style={{color: BRAND_RED}}>{categoryName || "All"}</span>
                </Typography>
            </Stack>

            <Divider sx={{ mb: 4, borderColor: '#eee' }} />

            <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: TEXT_DARK, mb: 1 }}>
                    {pageTitle}
                </Typography>
                <Typography variant="body1" sx={{ color: TEXT_GREY }}>
                    Showing {gems.length} results
                </Typography>
            </Box>

            <FilterBar />

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                            <CircularProgress sx={{ color: BRAND_RED }} />
                        </Box>
                    ) : (
                        <Stack spacing={3}>
                            {gems.length > 0 ? (
                                gems.map((gem, index) => (
                                    <BusinessCard 
                                        key={gem._id || index} 
                                        data={gem} 
                                        rank={index + 1} 
                                    />
                                ))
                            ) : (
                                !error && <Typography>No accepted gems found.</Typography>
                            )}
                        </Stack>
                    )}
                </Grid>
            </Grid>
            
        </Container>
    </Box>
  );
}