import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { Box, Container, Typography, Grid, Stack, Divider, CircularProgress, Alert, Pagination, Breadcrumbs } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { BASE_URL, THEME } from '../../Components/Places/constants';
import FilterBar from '../../Components/Places/FilterBar';
import PlaceCard from '../../Components/Places/PlaceCard';

const ITEMS_PER_PAGE = 10;

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

  // 1. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch data with pagination support
        const response = await fetch(`${BASE_URL}/gems?page=${currentPage}`, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch gems");
        
        const data = await response.json();
        let fetchedGems = data.result || [];
        
        // Extract pagination data from API response
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
        // Filter: Only Accepted Gems
        fetchedGems = fetchedGems.filter(gem => gem.status === 'accepted');
        
        // Filter: URL Category param (Fingerprint logic)
        if (categoryName) {
            setPageTitle(`Best ${categoryName} in town`);
            const targetFingerprint = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '');

            fetchedGems = fetchedGems.filter(gem => {
              if(!gem.category || !gem.category.categoryName) return false;
              const dbFingerprint = gem.category.categoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
              return dbFingerprint === targetFingerprint; 
            });
        } else {
            setPageTitle("Top Gems in your area");
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

  // 2. RESET PAGE ON FILTER CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [filtersApplied, categoryName]);

  // 3. CLIENT-SIDE FILTERING
  const filteredGems = useMemo(() => {
    return gems.filter(gem => {
      // Rating Filter
      if (filtersApplied.avgRating && (gem.avgRating || 0) < filtersApplied.avgRating) return false;
      // Location Filter
      if (filtersApplied.gemLocation && gem.gemLocation?.toLowerCase() !== filtersApplied.gemLocation.toLowerCase()) return false;
      // Category Filter
      if (filtersApplied.category && gem.category?._id !== filtersApplied.category) return false;
      
      return true;
    });
  }, [gems, filtersApplied]);

  // Display all gems from current page (already paginated by API)
  const currentVisibleGems = gems;


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
        
        <Box sx={{ bgcolor: THEME.RED, pt: { xs: 4, md: 5 }, pb: 6, mt: { xs: 7, md: 8 } }}>
            <Container maxWidth="lg">
                <Breadcrumbs 
                    separator={<ArrowRightIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />} 
                    aria-label="breadcrumb"
                    sx={{ mb: 3, display: { xs: 'none', md: 'flex' } }}
                >
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', '&:hover': { color: 'white' } }}>
                            Home
                        </Typography>
                    </Link>

                    <Link to="/places" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', '&:hover': { color: 'white' } }}>
                            Places
                        </Typography>
                    </Link>

                    <Typography 
                        variant="body2" 
                        sx={{ fontWeight: 600, color: 'white' }}
                    >
                        {categoryName || "All"}
                    </Typography>
                </Breadcrumbs>

                <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

                <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                        {pageTitle}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                        Showing {currentVisibleGems.length} results (Page {currentPage} of {totalPages})
                    </Typography>
                </Box>
            </Container>
        </Box>

        {/* LOWER PART: WHITE BACKGROUND (Rest of content) */}
        <Box sx={{ bgcolor: 'white', pb: 12, pt: 4 }}>
            <Container maxWidth="lg">
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
                                {currentVisibleGems.length > 0 ? (
                                    <>
                                        {currentVisibleGems.map((gem, index) => (
                                            <PlaceCard 
                                                key={gem._id || index} 
                                                data={gem} 
                                                rank={index + 1} 
                                            />
                                        ))}

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                                <Pagination 
                                                    count={totalPages} 
                                                    page={currentPage} 
                                                    onChange={(e, page) => {
                                                        setCurrentPage(page);
                                                        window.scrollTo(0, 0); 
                                                    }}
                                                    sx={{
                                                        '& .MuiPaginationItem-root': {
                                                            color: THEME.DARK,
                                                            '&.Mui-selected': {
                                                                backgroundColor: THEME.RED,
                                                                color: 'white',
                                                                '&:hover': { backgroundColor: THEME.RED }
                                                            },
                                                            '&:hover': { backgroundColor: '#f0f0f0' }
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        )}
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
    </Box>
  );
}