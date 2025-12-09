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
import PlaceCard from "../../Components/Places/PlaceCard";
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
      <ScrollToTop />
      {/* UPPER PART: RED BACKGROUND */}
      <Box
        className="upper-part"
        sx={{
          bgcolor: "#dd0303",
          pt: { xs: 4, md: 5 },
          pb: 6,
          mt: { xs: 7, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Breadcrumbs
            separator={
              <ArrowRightIcon
                fontSize="small"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              />
            }
            aria-label="breadcrumb"
            sx={{ mb: 3, display: { xs: "none", md: "flex" } }}
          >
            <Link
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                  "&:hover": { color: "white" },
                }}
              >
                Home
              </Typography>
            </Link>

            <Link
              to="/places"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                  "&:hover": { color: "white" },
                }}
              >
                Places
              </Typography>
            </Link>

            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "white" }}
            >
              {categoryName || "All"}
            </Typography>
          </Breadcrumbs>

          <Divider sx={{ mb: 4, borderColor: "rgba(255,255,255,0.2)" }} />

          <Box sx={{ textAlign: "left" }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 800, color: "white", mb: 1 }}
            >
              {pageTitle}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255,255,255,0.85)" }}
            >
              Showing {totalItems} results
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* LOWER PART: WHITE BACKGROUND */}
      <Box className="lower-part" sx={{ bgcolor: "white", pb: 12, pt: 4 }}>
        <Container maxWidth="lg">
          {/* FILTER BAR - INLINE */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              {/* Search Input */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search gems..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: THEME.GREY }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      height: 56,

                      "&:hover fieldset": {
                        borderColor: THEME.RED,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: THEME.RED,
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      "&.Mui-focused": {
                        color: THEME.RED,
                      },
                    }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Category"
                    sx={{
                      borderRadius: 2,
                      height: 56,
                      width: 150,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: THEME.RED,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: THEME.RED,
                        borderWidth: 2,
                      },
                    }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem
                        key={cat._id}
                        value={cat._id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(220, 38, 38, 0.08)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(220, 38, 38, 0.12)",
                            "&:hover": {
                              backgroundColor: "rgba(220, 38, 38, 0.16)",
                            },
                          },
                        }}
                      >
                        {cat.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Sort By */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      "&.Mui-focused": {
                        color: THEME.RED,
                      },
                    }}
                  >
                    Sort By
                  </InputLabel>
                  <Select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    label="Sort By"
                    sx={{
                      borderRadius: 2,
                      height: 56,
                      width: 150,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: THEME.RED,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: THEME.RED,
                        borderWidth: 2,
                      },
                    }}
                  >
                    <MenuItem value="">Default</MenuItem>
                    <MenuItem
                      value="name"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(220, 38, 38, 0.08)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(220, 38, 38, 0.12)",
                          "&:hover": {
                            backgroundColor: "rgba(220, 38, 38, 0.16)",
                          },
                        },
                      }}
                    >
                      Name (A-Z)
                    </MenuItem>
                    <MenuItem
                      value="-name"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(220, 38, 38, 0.08)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(220, 38, 38, 0.12)",
                          "&:hover": {
                            backgroundColor: "rgba(220, 38, 38, 0.16)",
                          },
                        },
                      }}
                    >
                      Name (Z-A)
                    </MenuItem>
                    <MenuItem
                      value="-avgRating"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(220, 38, 38, 0.08)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(220, 38, 38, 0.12)",
                          "&:hover": {
                            backgroundColor: "rgba(220, 38, 38, 0.16)",
                          },
                        },
                      }}
                    >
                      Highest Rating
                    </MenuItem>
                    <MenuItem
                      value="avgRating"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(220, 38, 38, 0.08)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(220, 38, 38, 0.12)",
                          "&:hover": {
                            backgroundColor: "rgba(220, 38, 38, 0.16)",
                          },
                        },
                      }}
                    >
                      Lowest Rating
                    </MenuItem>
                    <MenuItem
                      value="createdAt"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(220, 38, 38, 0.08)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(220, 38, 38, 0.12)",
                          "&:hover": {
                            backgroundColor: "rgba(220, 38, 38, 0.16)",
                          },
                        },
                      }}
                    >
                      Oldest First
                    </MenuItem>
                    <MenuItem
                      value="-createdAt"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(220, 38, 38, 0.08)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(220, 38, 38, 0.12)",
                          "&:hover": {
                            backgroundColor: "rgba(220, 38, 38, 0.16)",
                          },
                        },
                      }}
                    >
                      Newest First
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Box sx={{ mt: 2 }}>
                <Button
                  startIcon={<ClearIcon />}
                  onClick={clearAllFilters}
                  sx={{
                    color: THEME.RED,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "rgba(220, 38, 38, 0.1)",
                    },
                  }}
                >
                  Clear all filters
                </Button>
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                  <CircularProgress sx={{ color: THEME.RED }} />
                </Box>
              ) : (
                <Stack spacing={3}>
                  {gems.length > 0 ? (
                    <>
                      {gems.map((gem, index) => (
                        <PlaceCard
                          key={gem._id || index}
                          gem={gem}
                          rank={(currentPage - 1) * 10 + index + 1}
                        />
                      ))}

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 4,
                          }}
                        >
                          <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(e, page) => {
                              setCurrentPage(page);
                              const params = new URLSearchParams(searchParams);
                              params.set("page", page.toString());
                              setSearchParams(params);
                              window.scrollTo(0, 0);
                            }}
                            sx={{
                              "& .MuiPaginationItem-root": {
                                color: THEME.DARK,
                                "&.Mui-selected": {
                                  backgroundColor: THEME.RED,
                                  color: "white",
                                  "&:hover": { backgroundColor: THEME.RED },
                                },
                                "&:hover": { backgroundColor: "#f0f0f0" },
                              },
                            }}
                          />
                        </Box>
                      )}
                    </>
                  ) : (
                    !error && (
                      <Typography>No gems match your filters.</Typography>
                    )
                  )}
                </Stack>
              )}
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: "sticky", top: 100 }}>
                {(!userInfo?.subscription ||
                  userInfo?.subscription === "free") &&
                  userInfo?.role !== "admin" && <SubscriptionPlans compact />}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
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
