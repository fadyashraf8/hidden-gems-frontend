import React, { useEffect, useState } from "react";
import Hero from "../../Components/Hero/Hero.jsx";
import Categories from "../../Components/Categories/Categories.jsx";
import GemCard from "../../Components/Gems/GemCard.jsx";
import { getGemsAPI } from "../../Services/GemsAuth";
import { Stack, Typography, Container, Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SurpriseButton from "../../Components/SurpriseButton/SurpriseButton.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import axios from "axios";

export default function Home() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const [gems, setGems] = useState([]);
  const [subscribedGems, setSubscribedGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDarkModeEnabled = useSelector((state) => state.darkMode.enabled);

  useEffect(() => {
    const fetchGems = async () => {
      try {
        const data = await getGemsAPI();
        if (data && data.result) {
          setGems(data.result.filter((gem) => gem.status === "accepted"));
        }
      } catch (error) {
        console.error("Failed to fetch gems", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchSubscribedGems = () => {
      axios
        .get(`${import.meta.env.VITE_Base_URL}/gems/subscribed`)
        .then((res) => {
          setSubscribedGems(
            res.data?.result?.filter((gem) => gem.status === "accepted")
          );

          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchSubscribedGems();
    fetchGems();
  }, []);

  const slides = [
    { image: "images/1.jpg", title: t("hero_slide_1") },
    { image: "images/2.jpg", title: t("hero_slide_2") },
    { image: "images/3.jpg", title: t("hero_slide_3") },
    { image: "images/4.jpg", title: t("hero_slide_4") },
  ];

  const displyData = () => {
    console.log(" Subscribed Gems:", subscribedGems);
    console.log("unSubscribed Gems:", gems);
  };
  // Logic:
  // Sponsored -> isSubscribed === true (truthy check)
  // Recent -> !isSubscribed
  const recentGems = gems.filter((gem) => !gem.isSubscribed);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

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
      {/* <button onClick={displyData} className="bg-green-500">Dispaly DAta</button> */}

      {/* === SPONSORED SPOTLIGHT SECTION === */}
      {(loading || subscribedGems.length > 0) && (
        <Box
          sx={{
            background: isDarkModeEnabled
              ? "linear-gradient(135deg, #1a0505 0%, #000000 100%)"
              : "linear-gradient(135deg, #fff0f0 0%, #ffffff 100%)",
            py: 10,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Decorative blurry blobs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#DD0303] opacity-10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-black opacity-5 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />

          <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <Typography
                variant="h2"
                className={isDarkModeEnabled ? "text-white" : "text-black"}
                sx={{
                  fontWeight: 900,
                  textAlign: "left",
                  mb: 2,
                  textTransform: "uppercase",
                  letterSpacing: "-2px",
                  fontSize: { xs: "2.5rem", md: "4rem" },
                }}
              >
                Spotlight <span style={{ color: "#DD0303" }}>Gems</span>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: 600,
                  mb: 8,
                  color: isDarkModeEnabled
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(0,0,0,0.6)",
                  fontSize: "1.1rem",
                }}
              >
                Curated selection of the absolute best experiences in town.
                Don't miss these premium picks.
              </Typography>
            </motion.div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DD0303]"></div>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="flex flex-wrap justify-center gap-6"
              >
                {/* Unified grid with consistent heights and hover effects */}
                {subscribedGems.slice(0, 4).map((gem, index) => (
                  <motion.div
                    key={gem._id}
                    variants={fadeIn}
                    className="h-full w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                  >
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transform: "scale(1)",
                        transition:
                          "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        "&:hover": {
                          transform: "scale(1.05) translateY(-10px)",
                          zIndex: 10,
                        },
                      }}
                    >
                      <GemCard gem={gem} darkMode={isDarkModeEnabled} />
                    </Box>
                  </motion.div>
                ))}
              </motion.div>
            )}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Button
                  onClick={() => navigate("/sponsored")}
                  sx={{
                    position: "relative",
                    bgcolor: "black",
                    color: "white",
                    px: 8,
                    py: 3,
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    borderRadius: "9999px",
                    textTransform: "none",
                    border: "1px solid #333",
                    "&:hover": {
                      bgcolor: "#111",
                    },
                  }}
                >
                  View Elite Collection
                </Button>
              </div>
            </Box>
          </Container>
        </Box>
      )}

      {/* === CATEGORIES CAROUSEL SECTION === */}
      <div id="categories">
        <Categories />
      </div>

      {/* === FRESH FINDS (RECENT) SECTION === */}
      <Box
        sx={{
          py: 12,
          bgcolor: isDarkModeEnabled ? "#121212" : "#f8f9fa",
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Typography
              variant="h2"
              className={
                isDarkModeEnabled ? "dark:text-white" : "text-gray-900"
              }
              sx={{
                fontWeight: 900,
                textAlign: "center",
                mb: 8,
                textTransform: "uppercase",
                letterSpacing: "-1px",
                fontSize: { xs: "2rem", md: "3.5rem" },
              }}
            >
              Fresh{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#DD0303] to-[#ff5e5e]">
                Finds
              </span>
            </Typography>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DD0303]"></div>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4"
            >
              {recentGems.slice(0, 4).map((gem, index) => (
                <motion.div key={gem._id} variants={fadeIn}>
                  <GemCard gem={gem} darkMode={isDarkModeEnabled} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* === THE JOURNEY (CTA) === */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-32 text-center"
          >
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <Button
                onClick={() => navigate("/places")}
                sx={{
                  position: "relative",
                  bgcolor: "black",
                  color: "white",
                  px: 8,
                  py: 3,
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  borderRadius: "9999px",
                  textTransform: "none",
                  border: "1px solid #333",
                  "&:hover": {
                    bgcolor: "#111",
                  },
                }}
              >
                Start Your Search Journey
              </Button>
            </div>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
