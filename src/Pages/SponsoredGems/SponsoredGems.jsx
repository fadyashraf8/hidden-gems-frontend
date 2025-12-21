import React, { useEffect, useState, useRef } from "react";
import { getGemsAPI } from "../../Services/GemsAuth";
import {
  Box,
  Typography,
  Container,
  Button,
  Skeleton,
  Pagination,
} from "@mui/material";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, MapPin, ArrowRight, Loader2 } from "lucide-react";
import GemCard from "../../Components/Gems/GemCard";
import axios from "axios";

const LoadingSkeleton = ({ isDarkMode }) => (
  <Box
    sx={{
      height: "100vh",
      bgcolor: isDarkMode ? "#050505" : "#f8f9fa",
      p: 4,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Skeleton
      variant="text"
      width="60%"
      height={100}
      sx={{ bgcolor: isDarkMode ? "#333" : "#e0e0e0", mb: 2 }}
    />
    <Skeleton
      variant="rectangular"
      width="100%"
      height={400}
      sx={{ bgcolor: isDarkMode ? "#333" : "#e0e0e0", borderRadius: 4 }}
    />
  </Box>
);

const ParallaxGem = ({ gem, index, isDarkMode }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.05]);

  return (
    <Box
      ref={ref}
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`flex flex-col ${
            index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
          } gap-12 items-center`}
        >
          <motion.div
            style={{ scale }}
            className="relative w-full lg:w-3/5 h-[400px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-red-900/20 group cursor-pointer"
            onClick={() => navigate(`/gems/${gem._id}`)}
          >
            <img
              src={gem.images?.[0] || "/placeholder.jpg"}
              alt={gem.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

            <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400 w-4 h-4" />
              <Typography
                variant="caption"
                className="text-white font-bold tracking-widest uppercase"
              >
                Sponsored Collection
              </Typography>
            </div>
          </motion.div>

          <motion.div className="w-full lg:w-2/5 text-left">
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                color: isDarkMode ? "white" : "#1a1a1a",
                mb: 2,
                lineHeight: 1,
              }}
            >
              {gem.name}
            </Typography>

            <div
              className={`flex items-center gap-2 mb-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <MapPin className="w-5 h-5 text-[#DD0303]" />
              <Typography variant="h6">
                {gem.address || "Cairo, Egypt"}
              </Typography>
            </div>

            <Typography
              variant="h6"
              sx={{
                color: isDarkMode ? "gray" : "#666",
                mb: 6,
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              {gem.description?.substring(0, 150)}...
            </Typography>

            <Button
              onClick={() => navigate(`/gems/${gem._id}`)}
              endIcon={<ArrowRight />}
              sx={{
                color: isDarkMode ? "white" : "#1a1a1a",
                borderColor: isDarkMode ? "white" : "rgba(26, 26, 26, 0.3)",
                padding: "15px 40px",
                borderRadius: "50px",
                border: isDarkMode
                  ? "1px solid rgba(255,255,255,0.3)"
                  : "1px solid rgba(26, 26, 26, 0.3)",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#DD0303",
                  borderColor: "#DD0303",
                  color: "white",
                  px: 6,
                },
              }}
            >
              Explore Gem
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default function SponsoredGems() {
  const [sponsoredGems, setSponsoredGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const isDarkMode = useSelector((state) => state.darkMode.enabled);

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const topGems = sponsoredGems.slice(0, 3);
  const remainingGems = sponsoredGems.slice(3);

  const paginatedGems = remainingGems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    document
      .getElementById("grid-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchGems = () => {
      axios
        .get(`${import.meta.env.VITE_Base_URL}/gems/subscribed`)
        .then((res) => {
          if (res.data && res.data.result) {
            const activeSponsored = res.data.result.filter(
              (gem) => gem.status === "accepted"
            );
            setSponsoredGems(activeSponsored);
          }
        })
        .catch((error) => {
          console.error("Error loading gems", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchGems();
  }, []);

  if (loading) return <LoadingSkeleton isDarkMode={isDarkMode} />;

  return (
    <div
      ref={scrollRef}
      className={`min-h-screen overflow-x-hidden ${
        isDarkMode ? "bg-[#050505] text-white" : "bg-[#f8f9fa] text-gray-900"
      }`}
    >
      {/* === HERO === */}
      <section
        className={`h-screen flex items-center justify-center relative overflow-hidden ${
          isDarkMode ? "bg-[#050505]" : ""
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-[#050505] to-[#050505]"
              : "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-100/40 via-[#f8f9fa] to-[#ffffff]"
          }`}
        />

        <Container maxWidth="xl" className="relative z-10 text-center ">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <Typography
              variant="subtitle1"
              className="tracking-[1em] uppercase mb-4 font-bold"
              sx={{ color: "red !important" }}
            >
              The Elite Collection
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "3.5rem", sm: "5rem", md: "6rem", lg: "8rem" },
                lineHeight: 0.9,
                letterSpacing: "-0.05em",
                mb: { xs: 8, md: 4 },
              }}
            >
              HIDDEN <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DD0303] to-orange-600">
                LUXURY
              </span>
            </Typography>
            <Typography
              variant="h5"
              className={`max-w-2xl mx-auto font-light ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Explore the city's most exclusive, verified, and premium
              experiences. Hand-picked for the discerning traveler.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 md:mt-24 lg:mt-32 flex flex-col items-center gap-2"
          >
            <div className="w-[1px] h-20 bg-gradient-to-b from-red-500 to-transparent" />
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Scroll to Explore
            </span>
          </motion.div>
        </Container>
      </section>

      {/* === TOP 5 CINEMATIC LIST === */}
      <section className={`pb-10 ${isDarkMode ? "bg-[#050505]" : ""}`}>
        {topGems.map((gem, index) => (
          <ParallaxGem
            key={gem._id}
            gem={gem}
            index={index}
            isDarkMode={isDarkMode}
          />
        ))}
      </section>

      {/* === REMAINING GEMS GRID === */}
      {remainingGems.length > 0 && (
        <section
          id="grid-section"
          className={`py-20 ${isDarkMode ? "bg-[#0A0A0A]" : "bg-white"}`}
        >
          <Container maxWidth="xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ mb: 2, color: isDarkMode ? "white" : "#1a1a1a" }}
              >
                More Premium Extensions
              </Typography>
              <Typography
                variant="body1"
                className={isDarkMode ? "text-gray-400" : "text-gray-600"}
              >
                Discover more certified high-quality experiences.
              </Typography>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedGems.map((gem) => (
                <motion.div
                  key={gem._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isDarkMode
                      ? "bg-[#111] border-white/5 hover:border-red-500/50"
                      : "bg-white border-gray-200 hover:border-red-500/50 shadow-sm"
                  }`}
                >
                  <GemCard gem={gem} darkMode={isDarkMode} />
                </motion.div>
              ))}
            </div>

            {remainingGems.length > itemsPerPage && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <Pagination
                  count={Math.ceil(remainingGems.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: isDarkMode ? "white" : "#1a1a1a",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(26,26,26,0.3)",
                      "&:hover": {
                        bgcolor: isDarkMode
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(221,3,3,0.1)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "#DD0303",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": {
                          bgcolor: "#b90202",
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Container>
        </section>
      )}

      {sponsoredGems.length === 0 && (
        <Box className="h-[50vh] flex items-center justify-center">
          <Typography variant="h4" className="text-gray-500">
            No Elite Gems Found at the Moment.
          </Typography>
        </Box>
      )}

      {/* === FOOTER  === */}
      <section className="py-20 bg-gradient-to-t from-red-900/20 to-[#050505] text-center">
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} mb={4}>
            Want to be on this list?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "black",
              px: 8,
              py: 2,
              borderRadius: "50px",
              fontWeight: "bold",
              fontSize: "1.2rem",
              "&:hover": { bgcolor: "#b90202", color: "white !important" },
            }}
          >
            Become a Partner
          </Button>
        </Container>
      </section>
    </div>
  );
}
