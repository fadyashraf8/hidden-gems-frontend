import React, { useEffect, useState, useRef } from "react";
import { getGemsAPI } from "../../Services/GemsAuth";
import { Box, Typography, Container, Button, Skeleton } from "@mui/material";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, MapPin, ArrowRight, Loader2 } from "lucide-react";
import GemCard from "../../Components/Gems/GemCard";

const LoadingSkeleton = () => (
  <Box
    sx={{
      height: "100vh",
      bgcolor: "#0a0a0a",
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
      sx={{ bgcolor: "#333", mb: 2 }}
    />
    <Skeleton
      variant="rectangular"
      width="100%"
      height={400}
      sx={{ bgcolor: "#333", borderRadius: 4 }}
    />
  </Box>
);

const ParallaxGem = ({ gem, index }) => {
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
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        py: 10,
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
            className="relative w-full lg:w-3/5 h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-red-900/20 group cursor-pointer"
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
              sx={{ fontWeight: 900, color: "white", mb: 2, lineHeight: 1 }}
            >
              {gem.name}
            </Typography>

            <div className="flex items-center gap-2 text-gray-400 mb-6">
              <MapPin className="w-5 h-5 text-[#DD0303]" />
              <Typography variant="h6">
                {gem.address || "Cairo, Egypt"}
              </Typography>
            </div>

            <Typography
              variant="h6"
              sx={{ color: "gray", mb: 6, fontWeight: 300, lineHeight: 1.6 }}
            >
              {gem.description?.substring(0, 150)}...
            </Typography>

            <Button
              onClick={() => navigate(`/gems/${gem._id}`)}
              endIcon={<ArrowRight />}
              sx={{
                color: "white",
                borderColor: "white",
                padding: "15px 40px",
                borderRadius: "50px",
                border: "1px solid rgba(255,255,255,0.3)",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#DD0303",
                  borderColor: "#DD0303",
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

  const topGems = sponsoredGems.slice(0, 2);
  const remainingGems = sponsoredGems.slice(2);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchGems = async () => {
      try {
        const data = await getGemsAPI();
        if (data && data.result) {
          const sponsored = data.result.filter((gem) => gem.isSubscribed);
          setSponsoredGems(sponsored);
        }
      } catch (error) {
        console.error("Error loading gems", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGems();
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div
      ref={scrollRef}
      className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-red-500 selection:text-white"
    >
      {/* === HERO === */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-[#050505] to-[#050505]" />

        <Container maxWidth="xl" className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <Typography
              variant="subtitle1"
              className="tracking-[1em] uppercase text-red-500 mb-4 font-bold"
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
              className="text-gray-400 max-w-2xl mx-auto font-light"
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
      <section className="pb-10">
        {topGems.map((gem, index) => (
          <ParallaxGem key={gem._id} gem={gem} index={index} />
        ))}
      </section>

      {/* === REMAINING GEMS GRID === */}
      {remainingGems.length > 0 && (
        <section className="py-20 bg-[#0a0a0a]">
          <Container maxWidth="xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
                More Premium Extensions
              </Typography>
              <Typography variant="body1" className="text-gray-400">
                Discover more certified high-quality experiences.
              </Typography>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingGems.map((gem) => (
                <motion.div
                  key={gem._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-300"
                >
                  <GemCard gem={gem} darkMode={true} />
                </motion.div>
              ))}
            </div>
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
              bgcolor: "#DD0303",
              color: "white",
              px: 8,
              py: 2,
              borderRadius: "50px",
              fontWeight: "bold",
              fontSize: "1.2rem",
              "&:hover": { bgcolor: "#b90202" },
            }}
          >
            Become a Partner
          </Button>
        </Container>
      </section>
    </div>
  );
}
