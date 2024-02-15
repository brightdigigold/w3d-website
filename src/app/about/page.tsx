
import {
  AboutFoot,
  HeroAbout,
  Info,
  Mission,
  Motive,
  Succession,
} from "@/components";
import Review from "@/components/about/reviewAbout";
import { Metadata } from "next";
import React, { Suspense } from "react";

const About = () => {
  return (
    <main>
      <Suspense fallback={<p className="text-white">Loading...</p>}>
        <HeroAbout />
        <Info />
        <Mission />
        <Motive />
        <Succession />
        <Review />
        <AboutFoot />
      </Suspense>
    </main>
  );
};

export default About;

export const metadata: Metadata = {
  title: "Buy, Sell and Gift Digital Gold Online-Bright Digi Gold",
  description:
    "Bright DiGi Gold allows you to Buy, Sell, Gift and Refer & Earn Digital Gold online conveniently and effectively.",
};
