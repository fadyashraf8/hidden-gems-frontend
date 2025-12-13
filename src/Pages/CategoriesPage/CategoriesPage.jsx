import "./CategoriesPage.css";
import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Pagination,
  Breadcrumbs,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  InputAdornment,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { THEME } from "../../Components/Places/constants";
import GemCard from "../../Components/Gems/GemCard";
import SubscriptionPlans from "../../Components/Subscription/SubscriptionPlans";
import SurpriseButton from "../../Components/SurpriseButton/SurpriseButton";
import { useSelector } from "react-redux";
import ScrollToTop from "../../Components/ScrollToTop";

export default function CategoriesPage() {
  const { userInfo } = useSelector((state) => state.user || {});
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const title = searchParams.get("title");

  // Base URL from env
  const baseURL = import.meta.env.VITE_Base_URL;

  // Categories for dropdown
  const [categories, setCategories] = useState([]);

  // Filter states
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  // Get page from URL or default to 1
  const pageFromURL = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromURL);

  // Data states
  const [gems, setGems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageTitle, setPageTitle] = useState("All Places");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Clear title parameter and set search on first render
  useEffect(() => {
    if (title) {
      setSearchInput(title);
      // امسح الـ title من الـ URL بس وخلي الـ page زي ما هي
      const params = new URLSearchParams(searchParams);
      params.delete("title");
      setSearchParams(params);
    }
  }, [title]);

  // Fetch gems when dependencies change
  useEffect(() => {
    fetchGems();
  }, [categoryName, currentPage, searchInput, selectedCategory, selectedSort]);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, selectedCategory, selectedSort]);

  // Fetch categories
  const fetchCategories = () => {
    axios
      .get(`${baseURL}/categories`, { withCredentials: true })
      .then((response) => {
        if (response.data.message === "success") {
          setCategories(response.data.result);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  // Fetch gems
  const fetchGems = () => {
    setLoading(true);
    setError("");

    // Build query params object
    const params = {
      page: currentPage,
      status: "accepted", // Only show accepted gems
    };

    // Search keyword
    if (searchInput) {
      params.keyword = searchInput;
    }

    // Category filter
    if (selectedCategory) {
      params.category = selectedCategory;
    }

    // Sort
    if (selectedSort) {
      params.sort = selectedSort;
    }

    // Fetch from API using axios
    axios
      .get(`${baseURL}/gems`, { params, withCredentials: true })
      .then((response) => {
        const data = response.data;

        if (data.message === "success") {
          setGems(data.result || []);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.totalItems || 0);

          // Update page title
          if (categoryName) {
            setPageTitle(`Best ${categoryName} in town`);
          } else {
            setPageTitle("Top Gems in your area");
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching gems:", err);
        setError(err.message || "Error loading data");
        setGems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchInput("");
    setSelectedCategory("");
    setSelectedSort("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchInput || selectedCategory || selectedSort;

  // Get Dark Mode State
  const isDarkMode = useSelector((state) => state.darkMode.enabled);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDarkMode ? "#121212" : "#f8f9fa",
        color: isDarkMode ? "white" : "text.primary",
        transition: "background-color 0.3s ease",
      }}
    >
      <ScrollToTop />

      {/* HEADER SECTION */}
      <Box
        sx={{
          position: "relative",
          bgcolor: isDarkMode ? "#1a1a1a" : "#ffffff",
          pt: { xs: 12, md: 16 }, // Padding top for navbar space
          pb: { xs: 6, md: 8 },
          overflow: "hidden",
          borderBottom: isDarkMode ? "1px solid #333" : "1px solid #eee",
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DD0303] opacity-5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-5 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Breadcrumbs
              separator={
                <ArrowRightIcon
                  fontSize="small"
                  sx={{
                    color: isDarkMode
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.5)",
                  }}
                />
              }
              aria-label="breadcrumb"
            >
              <Link to="/" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isDarkMode
                      ? "rgba(255,255,255,0.7)"
                      : "text.secondary",
                    "&:hover": { color: "#DD0303" },
                  }}
                >
                  Home
                </Typography>
              </Link>
              <Link to="/places" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isDarkMode
                      ? "rgba(255,255,255,0.7)"
                      : "text.secondary",
                    "&:hover": { color: "#DD0303" },
                  }}
                >
                  Places
                </Typography>
              </Link>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? "white" : "text.primary",
                }}
              >
                {categoryName || "All Collection"}
              </Typography>
            </Breadcrumbs>

            <Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "-1px",
                  fontSize: { xs: "2rem", md: "3.5rem" },
                  background: "linear-gradient(to right, #DD0303, #ff5e5e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  display: "inline-block",
                }}
              >
                {pageTitle}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: isDarkMode
                    ? "rgba(255,255,255,0.6)"
                    : "text.secondary",
                  fontWeight: 400,
                  maxWidth: "600px",
                }}
              >
                Discover {totalItems} hidden gems, unified by quality and
                curated for you.
              </Typography>
            </Box>
          </Stack>

          {/* FILTERS BAR */}
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: isDarkMode ? "#252525" : "white",
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.4)"
                : "0 4px 20px rgba(0,0,0,0.05)",
              border: isDarkMode ? "1px solid #333" : "1px solid #f0f0f0",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search for places..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{ color: isDarkMode ? "#888" : "#aaa" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: isDarkMode ? "#1e1e1e" : "#f8f9fa",
                      borderRadius: 3,
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#DD0303" },
                      "&.Mui-focused fieldset": { borderColor: "#DD0303" },
                      color: isDarkMode ? "white" : "inherit",
                    },
                    "& input::placeholder": {
                      color: isDarkMode ? "#666" : "#999",
                      opacity: 1,
                    },
                  }}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    sx={{
                      bgcolor: isDarkMode ? "#1e1e1e" : "#f8f9fa",
                      borderRadius: 3,
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      color: isDarkMode ? "white" : "inherit",
                      "& .MuiSvgIcon-root": {
                        color: isDarkMode ? "white" : "inherit",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em
                        style={{
                          fontStyle: "normal",
                          color: isDarkMode ? "#888" : "#666",
                        }}
                      >
                        All Categories
                      </em>
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Sort */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    sx={{
                      bgcolor: isDarkMode ? "#1e1e1e" : "#f8f9fa",
                      borderRadius: 3,
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      color: isDarkMode ? "white" : "inherit",
                      "& .MuiSvgIcon-root": {
                        color: isDarkMode ? "white" : "inherit",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em
                        style={{
                          fontStyle: "normal",
                          color: isDarkMode ? "#888" : "#666",
                        }}
                      >
                        Sort By: Default
                      </em>
                    </MenuItem>
                    <MenuItem value="name">Name (A-Z)</MenuItem>
                    <MenuItem value="-name">Name (Z-A)</MenuItem>
                    <MenuItem value="-avgRating">Highest Rated</MenuItem>
                    <MenuItem value="createdAt">Oldest</MenuItem>
                    <MenuItem value="-createdAt">Newest</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Clear Button */}
              <Grid
                item
                xs={12}
                md={1}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {hasActiveFilters && (
                  <Button
                    onClick={clearAllFilters}
                    sx={{
                      minWidth: "auto",
                      p: 1.5,
                      borderRadius: "50%",
                      color: "#DD0303",
                      bgcolor: isDarkMode ? "rgba(221, 3, 3, 0.1)" : "#fff0f0",
                      "&:hover": {
                        bgcolor: "#DD0303",
                        color: "white",
                      },
                    }}
                  >
                    <ClearIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* BODY CONTENT */}
      <Container maxWidth="xl" sx={{ pb: 12 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
            <CircularProgress size={60} sx={{ color: "#DD0303" }} />
          </Box>
        ) : (
          <>
            {gems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {gems.map((gem, index) => (
                    // Use GemCard directly for consistent UI
                    <div key={gem._id || index} className="h-full">
                      <div className="h-full transition-transform duration-300 hover:-translate-y-2">
                        <GemCard gem={gem} darkMode={isDarkMode} />
                      </div>
                      {/* NOTE: We are using PlaceCard which currently wraps GemCard or custom logic. 
                             Ideally we should swap to GemCard directly if PlaceCard is legacy. 
                             Let's assume for now we want to replace PlaceCard usage with GemCard 
                             BUT we need to make sure we imported GemCard.
                         */}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 8 }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(e, page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: isDarkMode ? "white" : "inherit",
                          fontSize: "1rem",
                          "&.Mui-selected": {
                            bgcolor: "#DD0303",
                            color: "white",
                            "&:hover": { bgcolor: "#b90202" },
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            ) : (
              !error && (
                <Box sx={{ textAlign: "center", py: 10, opacity: 0.6 }}>
                  <Typography variant="h5">
                    No gems found matching your criteria.
                  </Typography>
                  <Typography variant="body1">
                    Try adjusting your filters.
                  </Typography>
                </Box>
              )
            )}
          </>
        )}
      </Container>

      <SurpriseButton
        style={{
          position: "fixed",
          top: "120px",
          right: "2rem",
          left: "auto",
          zIndex: 999,
        }}
      />
    </Box>
  );
}
