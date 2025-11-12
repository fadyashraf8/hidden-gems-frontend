import React from "react";
import Hero from "../../Components/Hero/Hero.jsx";

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
       <Hero slides={slides} duration={5000} />;
      Home
    </>
  );
}
