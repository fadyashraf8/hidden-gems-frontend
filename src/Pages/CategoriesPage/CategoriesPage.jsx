import "./CategoriesPage.css";
import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import translation hook
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
  const { t } = useTranslation("CategoriesPage"); // Initialize hook
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
  
  // NOTE: pageTitle state removed. Title is now calculated dynamically below 
  // to ensure it updates immediately when language switches.

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Clear title parameter and set search on first render
  useEffect(() => {
    if (title) {
      setSearchInput(title);
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

    const params = {
      page: currentPage,
      status: "accepted",
    };

    if (searchInput) params.keyword = searchInput;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSort) params.sort = selectedSort;

    axios
      .get(`${baseURL}/gems`, { params, withCredentials: true })
      .then((response) => {
        const data = response.data;
        if (data.message === "success") {
          setGems(data.result || []);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.totalItems || 0);
          // Removed manual setPageTitle here to support dynamic translation
        }
      })
      .catch((err) => {
        console.error("Error fetching gems:", err);
        setError(err.message || t("categoriesPage.messages.errorLoading"));
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

  // Calculate title dynamically for translation support
  const dynamicPageTitle = categoryName
    ? t("categoriesPage.titles.bestInTown", { category: categoryName })
    : t("categoriesPage.titles.topGems");

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
                {t("categoriesPage.breadcrumbs.home")}
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
                {t("categoriesPage.breadcrumbs.places")}
              </Typography>
            </Link>

            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "white" }}
            >
              {categoryName || t("categoriesPage.breadcrumbs.all")}
            </Typography>
          </Breadcrumbs>

          <Divider sx={{ mb: 4, borderColor: "rgba(255,255,255,0.2)" }} />

          <Box sx={{ textAlign: "left" }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 800, color: "white", mb: 1 }}
            >
              {dynamicPageTitle}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255,255,255,0.85)" }}
            >
              {t("categoriesPage.resultsCount", { count: totalItems })}
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
                  placeholder={t("categoriesPage.filters.searchPlaceholder")}
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
                    {t("categoriesPage.filters.categoryLabel")}
                  </InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label={t("categoriesPage.filters.categoryLabel")}
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
                    <MenuItem value="">
                      {t("categoriesPage.filters.allCategories")}
                    </MenuItem>
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
                    {t("categoriesPage.filters.sortByLabel")}
                  </InputLabel>
                  <Select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    label={t("categoriesPage.filters.sortByLabel")}
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
                    <MenuItem value="">
                      {t("categoriesPage.sortOptions.default")}
                    </MenuItem>
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
                      {t("categoriesPage.sortOptions.nameAZ")}
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
                      {t("categoriesPage.sortOptions.nameZA")}
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
                      {t("categoriesPage.sortOptions.highestRating")}
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
                      {t("categoriesPage.sortOptions.lowestRating")}
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
                      {t("categoriesPage.sortOptions.oldestFirst")}
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
                      {t("categoriesPage.sortOptions.newestFirst")}
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
                  {t("categoriesPage.filters.clearFilters")}
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
                      <Typography>
                        {t("categoriesPage.messages.noGems")}
                      </Typography>
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