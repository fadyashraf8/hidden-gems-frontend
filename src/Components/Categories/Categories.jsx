import { Container, Box, Typography, Alert } from "@mui/material";
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
import LoadingScreen from "@/Pages/LoadingScreen";

const BASE_URL = import.meta.env.VITE_Base_URL;

// ✅ PURE CSS CATEGORY ITEM (NO FRAMER MOTION)
const CategoryItem = ({ label, path, image }) => (
  <div className="h-full p-1 transition-transform duration-300 hover:scale-105 active:scale-95 will-change-transform">
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
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.1)",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(221, 3, 3, 0.3)",
          borderColor: "#DD0303",
        },
        ".dark-mode &": {
          border: "1px solid rgba(255,255,255,0.05)",
        },
      }}
    >
      {/* ✅ Lazy Loaded Image Layer */}
      <img
        src={image}
        alt={label}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ✅ Gradient Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ✅ Text */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          fontSize: "clamp(0.9rem, 1.5vw, 1.5rem)",
          textAlign: "center",
          px: 1,
          lineHeight: 1.2,
          textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          zIndex: 2,
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>
    </Box>
  </div>
);

export default function Categories() {
  const { t } = useTranslation("CategoriesHome");
  const [categoriesData, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories/allCategories`, {
        withCredentials: true,
      });
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

  if (loading) return <LoadingScreen />;

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

  return (
    <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 8 } }}>
      {/* ✅ Title without Framer Motion (no observer work) */}
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontWeight: 900,
          textAlign: "center",
          mb: 6,
          fontSize: { xs: "2rem", md: "3.5rem" },
          textTransform: "uppercase",
          letterSpacing: "-1px",
        }}
      >
        {t("Browse")}
      </Typography>

      <div className="relative px-4 md:px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: false, 
          }}
          className="w-full select-none"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categoriesData.map((category) => (
              <CarouselItem
                key={category._id}
                className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <CategoryItem
                  label={category.categoryName}
                  path={`/places/${encodeURIComponent(
                    category.categoryName || ""
                  )}`}
                  image={category.categoryImage}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex -left-4 bg-white/10 hover:bg-[#DD0303] hover:text-white border-0 backdrop-blur-md" />
          <CarouselNext className="hidden md:flex -right-4 bg-white/10 hover:bg-[#DD0303] hover:text-white border-0 backdrop-blur-md" />
        </Carousel>
      </div>
    </Container>
  );
}
