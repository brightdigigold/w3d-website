import {
  Blog,
  ClientSlider,
  Faq,
  Graph,
  HeroSection,
  HowItWorks,
  Marketing,
  OfferSlider,
  Products,
  Promotional,
  Review,
} from "@/components";
import { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from "next";
import Videos from "@/components/homepage/youtubevideos";
import Image from "next/image";
// import {} "../../public/images/maintainanceImage.jpg"


export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      {/* <HeroSection />
      <OfferSlider />
      <Promotional /> */}
      {/* <AkshaytrityaOfferBanner /> */}
      {/* <Products />
      <HowItWorks />
      <Videos />
      <Marketing />
      <ClientSlider />
      <Graph />
      <Blog />
      <Review />
      <Faq /> */}
      <img src="./images/maintainanceImage.jpg" alt="maintanance image" className="inset-0 w-full h-full object-cover" />
    </Suspense>
  );
}
export const metadata: Metadata = {
  title: "Best Platform to Buy & Sell 24K Digital Gold - Bright DiGi Gold",
  description:
    "Bright DiGi Gold is a trusted and secure platform which allows you to start your digital gold journey with just ₹10 and make your savings grow.  ",
};
