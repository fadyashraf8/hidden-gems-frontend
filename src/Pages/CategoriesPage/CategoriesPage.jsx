import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { Box, Container, Typography, Grid, Stack, Divider, CircularProgress, Alert, Pagination, Breadcrumbs } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { BASE_URL, THEME, FEATURED_PATHS} from '../../Components/Places/constants';
//capitalizeWords
import FilterBar from '../../Components/Places/FilterBar';
import PlaceCard from '../../Components/Places/PlaceCard';
import { hover } from 'framer-motion';

const linkStyle = {
    // textDecoration: 'none',     // Remove underline
    '&:hover': { color: THEME.RED },
    color: THEME.GREY,          
    fontWeight: 600,            
    cursor: 'pointer',
    display: 'flex',            // Helps align icons if you add them later
    alignItems: 'center'
};

export default function CategoriesPage() {
  const { categoryName } = useParams(); 
  
  const [filtersApplied, setFiltersApplied] = useState({
    category: "",
    avgRating: "",
    gemLocation: ""
  });
  
  const [gems, setGems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageTitle, setPageTitle] = useState("All Places");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${BASE_URL}/gems?page=${currentPage}`, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch gems");
        
        const data = await response.json();
        let fetchedGems = data.result || [];
        
        // Update pagination state
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
        
        // Filter: Only Accepted Gems
        fetchedGems = fetchedGems.filter(gem => gem.status === 'accepted');
        console.log("Accepted Gems:", fetchedGems);
        // Filter: URL Category param (if exists)
        if (categoryName) {
            setPageTitle(`Best ${categoryName} in town`);
            fetchedGems = fetchedGems.filter(gem => {
              if(!gem.category || !gem.category.categoryName) return false;
              const targetFingerprint = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
              const dbFingerprint = gem.category.categoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
              console.log("Target:", targetFingerprint)
              console.log("DB", dbFingerprint)
              return dbFingerprint === targetFingerprint; // This will match "Spa & Wellness", "Spa & Wellness", and even "Spa And Wellness" perfectly.
            });
            // setTotalItems(fetchedGems.length);
            // setTotalPages(Math.ceil(fetchedGems.length / 10)); // 10 per page
            console.log("CatName:", categoryName);
        } else {
            setPageTitle("Top Gems in your area" );
        }

        setGems(fetchedGems);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName, currentPage]);

  // Client-side filtering logic based on Chip selection
  const visibleGems = useMemo(() => {
    console.log("Applying filters:", filtersApplied);
    return gems.filter(gem => {
      // 1. Rating Filter
      if (filtersApplied.avgRating && (gem.avgRating || 0) < filtersApplied.avgRating) return false;
      // 2. Location Filter
      if (filtersApplied.gemLocation && gem.gemLocation?.toLowerCase() !== filtersApplied.gemLocation.toLowerCase()) return false;
      // 3. Category Filter (Dropdown)
      if (filtersApplied.category && gem.category?._id !== filtersApplied.category) return false;
      
      return true;
    });
  }, [gems, filtersApplied]);
  
  // useEffect(() => {
  //   if(visibleGems.length >= 0){
  //     setTotalItems(visibleGems.length);
  //     setTotalPages(Math.ceil(visibleGems.length / 10)); // 10 per page
  //   }
    
  // }, [visibleGems]);

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', pb: 12, pt: 8}}>
        <Container maxWidth="lg">
            
            <Breadcrumbs 
                separator={<ArrowRightIcon fontSize="small" />} 
                aria-label="breadcrumb"
                sx={{ mb: 3, display: { xs: 'none', md: 'flex' } }}
              >
                  <Link to="/" style={linkStyle}>
                      Home
                  </Link>
                  <Link to="/places" style={linkStyle}>
                      Places
                  </Link>
                  <Typography 
                      variant="body2" 
                      sx={{ fontWeight: 600, color: THEME.RED }}
                  >
                      {categoryName || "All"}
                  </Typography>

              </Breadcrumbs>

            <Divider sx={{ mb: 4, borderColor: '#eee' }} />

            <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: THEME.DARK, mb: 1 }}>
                    {pageTitle}
                </Typography>
                <Typography variant="body1" sx={{ color: THEME.GREY }}>
                    Showing {visibleGems.length} results
                </Typography>
            </Box>

            <FilterBar filtersApplied={filtersApplied} setFiltersApplied={setFiltersApplied} />

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                            <CircularProgress sx={{ color: THEME.RED }} />
                        </Box>
                    ) : (
                        <Stack spacing={3}>
                            {visibleGems.length > 0 ? (
                                <>
                                    {visibleGems.map((gem, index) => (
                                        <PlaceCard 
                                            key={gem._id || index} 
                                            data={gem} 
                                            rank={index + 1} 
                                        />
                                    ))}
                                    {/* Pagination Controls */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                        <Pagination 
                                            count={totalPages} 
                                            page={currentPage} 
                                            onChange={(e, page) => {
                                                setCurrentPage(page);
                                                window.scrollTo(0, 0); // Scroll to top on page change
                                            }}
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    color: THEME.DARK,
                                                    '&.Mui-selected': {
                                                        backgroundColor: THEME.RED,
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: THEME.RED,
                                                        }
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#f0f0f0',
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                </>
                            ) : (
                                !error && <Typography>No gems match your filters.</Typography>
                            )}
                        </Stack>
                    )}
                </Grid>
            </Grid>
            
        </Container>
    </Box>
  );
}