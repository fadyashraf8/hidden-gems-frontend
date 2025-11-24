import React from "react";
import Hero from "../../Components/Hero/Hero.jsx";
import Categories from "../../Components/Categories/Categories.jsx";
import RestaurantCard from "../../Components/RestaurantCard/RestaurantCard.jsx";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";



export default function Home() {
  const { t } = useTranslation('home');
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
       <Stack direction="column" spacing={5} sx={{ width: '100%', margin: '0 auto', p: 1 }}>
            <br></br>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
                {t('section_recent_title')}
            </Typography>
            <Stack 
                direction="column" 
                spacing={5} 
                sx={{ 
                    padding: 0 
                }}
            >
                <RestaurantCard />
            </Stack>
            </Stack>
       
       <Categories />
    </>
  );
}
