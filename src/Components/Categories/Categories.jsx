import {
  Container,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import "../Navbar/Navbar.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel.jsx";
import { useTranslation } from "react-i18next";

const BASE_URL = import.meta.env.VITE_Base_URL;
const ICON_COLOR = "#DD0303";

const CategoryItem = ({ label, path, image }) => (
  <Box
    component={Link}
    to={path}
    sx={{
      textDecoration: "none",
      color: "white",
      width: "100%", 
      aspectRatio: "1 / 1",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      boxShadow: 2,
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
      overflow: "hidden",
      mx: "auto", 
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: 10,
      },
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      ".dark-mode &": {
        backgroundImage: `url(${image})`,
        color: "black",
      },
    }}
  >
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
  const { t } = useTranslation("CategoriesHome");
  
  const [categoriesData, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerSlide, setItemsPerSlide] = useState(6);

  const fetchCategories = useCallback(async () => {
    try {
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
        setItemsPerSlide(2); 
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(4); 
      } else {
        setItemsPerSlide(6); 
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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!categoriesData || categoriesData.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">{t("No")}</Alert>
      </Container>
    );
  }

  const categoryGroups = groupCategories(categoriesData, itemsPerSlide);

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 4, 
        px: { xs: 2, sm: 3, lg: 8 } 
      }}
    >
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
        {t("Browse")}
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
                    xs: "repeat(2, 1fr)", 
                    sm: "repeat(2, 1fr)", 
                    md: "repeat(3, 1fr)", 
                  },
                  gap: { xs: 2, sm: 2.5, md: 3 }, 
                  width: "100%",
                  px: { xs: 1, sm: 2 }, 
                  justifyItems: "center", 
                }}
              >
                {group.map((category) => (
                  <CategoryItem
                    key={category._id}
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