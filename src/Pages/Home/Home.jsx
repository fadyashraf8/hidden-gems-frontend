import React, { useEffect, useState } from "react";
import Hero from "../../Components/Hero/Hero.jsx";
import Categories from "../../Components/Categories/Categories.jsx";
import GemCard from "../../Components/Gems/GemCard.jsx";
import { getGemsAPI } from "../../Services/GemsAuth";
import { Stack, Typography, Grid, Container } from "@mui/material";
import { useTranslation } from "react-i18next";


export default function Home() {
  const { t } = useTranslation("home");
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGems = async () => {
      try {
        const data = await getGemsAPI();
        console.log("data",data.result.filter(gem => gem.status === 'accepted'));
        
        if (data && data.result) {
          setGems(data.result.filter(gem => gem.status === 'accepted'));
        } 
      } catch (error) {
        console.error("Failed to fetch gems", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGems();
  }, []);

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

  return (
    <>
      <Hero slides={slides} duration={5000} />

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          className="text-gray-900 dark:text-white"
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
            {gems.slice(0, 4).map((gem) => (
              <GemCard key={gem._id} gem={gem} />
            ))}
          </div>
        )}
      </Container>

      <div id="categories">
        <Categories />
      </div>
    </>
  );
}




// comment to test discord