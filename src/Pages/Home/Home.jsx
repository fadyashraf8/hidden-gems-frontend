import React, { useEffect, useState } from "react";
import Hero from "../../Components/Hero/Hero.jsx";
import Categories from "../../Components/Categories/Categories.jsx";
import GemCard from "../../Components/Gems/GemCard.jsx";
import { getGemsAPI } from "../../Services/GemsAuth";
import { Stack, Typography, Grid, Container, Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SurpriseButton from "../../Components/SurpriseButton/SurpriseButton.jsx";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDarkModeEnabled = useSelector((state) => state.darkMode.enabled);

  useEffect(() => {
    // console.log("dark mode is " +dark)
    console.log(isDarkModeEnabled);
    const fetchGems = async () => {
      try {
        const data = await getGemsAPI();
        console.log(
          "data",
          data.result.filter((gem) => gem.status === "accepted")
        );

        if (data && data.result) {
          setGems(data.result.filter((gem) => gem.status === "accepted"));
        }
      } catch (error) {
        console.error("Failed to fetch gems", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGems();
  }, [isDarkModeEnabled]);

  const slides = [
    {
      image: "images/1.jpg",
      title: t("hero_slide_1"),
    },
    {
      image: "images/2.jpg",
      title: t("hero_slide_2"),
    },
    {
      image: "images/3.jpg",
      title: t("hero_slide_3"),
    },
    {
      image: "images/4.jpg",
      title: t("hero_slide_4"),
    },
  ];

  // Filter gems
  const sponsoredGems = gems.filter((gem) => gem.isSubscribed);
  const recentGems = gems.filter((gem) => !gem.isSubscribed);

  return (
    <>
      <SurpriseButton
        style={{
          position: "fixed",
          top: "120px",
          right: "2rem",
          left: "auto",
          zIndex: 999,
        }}
      />
      <Hero slides={slides} duration={5000} />

      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* SPONSORED GEMS SECTION */}
        {sponsoredGems.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              className={
                isDarkModeEnabled ? `dark:text-white` : `text-gray-900`
              }
              sx={{ fontWeight: "bold", textAlign: "center", mb: 6 }}
            >
              Sponsored Gems
            </Typography>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DD0303]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sponsoredGems.map((gem) => (
                  <GemCard
                    key={gem._id}
                    gem={gem}
                    darkMode={isDarkModeEnabled}
                  />
                ))}
              </div>
            )}
          </Box>
        )}

        {/* RECENT GEMS SECTION */}
        <Typography
          variant="h3"
          component="h2"
          className={isDarkModeEnabled ? `dark:text-white` : `text-gray-900`}
          sx={{ fontWeight: "bold", textAlign: "center", mb: 6 }}
        >
          {t("section_recent_title")}
        </Typography>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DD0303]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentGems.slice(0, 4).map((gem) => (
              <GemCard key={gem._id} gem={gem} darkMode={isDarkModeEnabled} />
            ))}
          </div>
        )}

        {/* VIEW ALL PLACES BUTTON */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/places")}
            sx={{
              backgroundColor: isDarkModeEnabled ? "white" : "#DD0303",
              color: isDarkModeEnabled ? "black" : "white",
              padding: "12px 32px",
              borderRadius: "50px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: isDarkModeEnabled
                ? "0 4px 14px 0 rgba(255, 255, 255, 0.2)"
                : "0 4px 14px 0 rgba(221, 3, 3, 0.39)",
              "&:hover": {
                backgroundColor: isDarkModeEnabled ? "#e0e0e0" : "#b90202",
                boxShadow: isDarkModeEnabled
                  ? "0 6px 20px rgba(255, 255, 255, 0.15)"
                  : "0 6px 20px rgba(221, 3, 3, 0.23)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            View All Places
          </Button>
        </Box>
      </Container>

      <div id="categories">
        <Categories />
      </div>
    </>
  );
}
// comment
