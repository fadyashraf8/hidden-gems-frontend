import {
  Container,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import "../NavBar/Navbar.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel.jsx";

const BASE_URL = import.meta.env.VITE_Base_URL;
const ICON_COLOR = "#DD0303";

const CategoryItem = ({ label, path, image }) => (
  <Box
    component={Link}
    to={path}
    sx={{
      textDecoration: "none",
      color: "white",
      width: "90%",
      aspectRatio: "1 / 1", //square
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      boxShadow: 2,
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: 10,
      },
      // --- 2. Background Image Settings (Light Mode Default) ---
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",

      // --- 4. Dark Mode Override ---
      // This selector says: "When a parent (like body) has class .dark, apply these styles to ME (&)"
      ".dark-mode &": {
        backgroundImage: `url(${image})`,
        color: "black",
      },
    }}
  >
    {/* <Icon sx={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: ICON_COLOR, mb: 1 }} />
     */}
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        fontSize: "clamp(0.7rem, 1.4vw, 2rem)",
        textAlign: "center",
        px: 0.5,
        lineHeight: 1.1,
        wordBreak: "break-word",
      }}
    >
      {label}
    </Typography>
  </Box>
);

export default function Categories() {
  const [categoriesData, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerSlide, setItemsPerSlide] = useState(6);

  const fetchCategories = useCallback(async () => {
    try {
      console.log(BASE_URL)
      const res = await axios.get(`${BASE_URL}/categories/allCategories`,
      { withCredentials: true }
      );
      console.log(res.data);
      if (res.data.result) {
        setCategories(res.data.result);
      } 
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(2); // Mobile: 1 item
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(4); // Tablet: 2 items
      } else {
        setItemsPerSlide(6); // Desktop: 3 items
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const groupCategories = (categories, size) => {
    const groups = [];
    for (let i = 0; i < categories.length; i += size) {
      groups.push(categories.slice(i, i + size));
    }
    return groups;
  };
  

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ py: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Show empty state
  if (!categoriesData || categoriesData.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">No categories available</Alert>
      </Container>
    );
  }

  const categoryGroups = groupCategories(categoriesData, itemsPerSlide);

  return (
    <Container maxWidth="md" sx={{ py: 4, px: 0 }}>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: 4,
          fontSize: { xs: "2rem", md: "3rem" },
        }}
      >
        Browse Categories
      </Typography>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {categoryGroups.map((group, groupIndex) => (
            <CarouselItem key={groupIndex}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "2fr", // Mobile: 1 column
                    sm: "repeat(2, 1fr)", // Tablet: 2 columns
                    md: "repeat(3, 1fr)", // Desktop: 3 columns
                  },
                  gap: 2,
                  width: "100%",
                  px: 1,
                }}
              >
                {group.map((category) => (
                  <CategoryItem
                    key={category._id}
                    // Icon={category.Icon}
                    label={category.categoryName}
                    path={
                      "/places/" +
                      encodeURIComponent(
                        category.categoryName ||
                          category.label ||
                          category.name ||
                          ""
                      )
                    }
                    image={category.categoryImage}
                  />
                ))}
              </Box>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Container>
  );
}

