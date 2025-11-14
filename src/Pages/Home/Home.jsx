import React from "react";
import Hero from "../../Components/Hero/Hero.jsx";
import Categories from "../../Components/Categories/Categories.jsx";
import RestaurantCard from "../../Components/RestaurantCard/RestaurantCard.jsx";
import { Stack, Typography } from "@mui/material";


const slides = [
  {
    image: "1.jpg",
    title: "Discover places you never knew existed",
  },
  {
    image: "2.jpg",
    title: "Weekend escapes you’ll actually love",
  },
  {
    image: "3.jpg",
    title: "Curated by real locals",
  },
  {
    image: "4.jpg",
    title: "Comfy Places, Cozy Prices",
  },
];

export default function Home() {
  return (
    <>
       <Hero slides={slides} duration={5000} />
       <Stack direction="column" spacing={5} sx={{ width: '100%', margin: '0 auto', p: 1 }}>
            
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
                Recent
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
