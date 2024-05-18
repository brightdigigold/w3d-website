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


export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <HeroSection />
      {/* <OfferSlider /> */}
      <Promotional />
      {/* <AkshaytrityaOfferBanner /> */}
      <Products />
      <HowItWorks />
      <Marketing />
      <ClientSlider />
      <Graph />
      <Blog />
      <Review />
      <Faq />
    </Suspense>
  );
}
export const metadata: Metadata = {
  title: "Best Platform to Buy & Sell 24K Digital Gold - Bright DiGi Gold",
  description:
    "Bright DiGi Gold is a trusted and secure platform which allows you to start your digital gold journey with just ₹10 and make your savings grow.  ",
};
