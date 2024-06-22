
import dynamic from 'next/dynamic';
import { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from "next";
import { HeroSection, OfferSlider } from '@/components';

const Promotional = dynamic(() => import('../components/homepage/promotional'), { suspense: true });
const Products = dynamic(() => import('../components/homepage/products'), { suspense: true });
const HowItWorks = dynamic(() => import('../components/homepage/howItWorks'), { suspense: true });
const Videos = dynamic(() => import('../components/homepage/youtubevideos'), { suspense: true });
const Marketing = dynamic(() => import('../components/homepage/marketingSlider'), { suspense: true });
const ClientSlider = dynamic(() => import('../components/homepage/clientSlider'), { suspense: true });
const Graph = dynamic(() => import('../components/homepage/graph'), { suspense: true });
const Blog = dynamic(() => import('../components/homepage/blog'), { suspense: true });
const Faq = dynamic(() => import('../components/homepage/faq'), { suspense: true });
const Review = dynamic(() => import('../components/homepage/reviews'), { suspense: true });

export default function Home() {
  return (
    <>
      <HeroSection />
      <OfferSlider />
      <Suspense fallback={<Loading />}>
        <Promotional />
        <Products />
        <HowItWorks />
        <Videos />
        <Marketing />
        <ClientSlider />
        <Graph />
        <Blog />
        <Review />
        <Faq />
      </Suspense>
    </>
  );
}
export const metadata: Metadata = {
  title: "Best Platform to Buy & Sell 24K Digital Gold - Bright DiGi Gold",
  description:
    "Bright DiGi Gold is a trusted and secure platform which allows you to start your digital gold journey with just ₹10 and make your savings grow.  ",
};
