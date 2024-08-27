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
      {/* <div className="hidden sm:block">
        <OfferSlider />

      </div> */}


<div className='pb-2 xl:pb-8 '>
        <div className='bg-gradient-to-b from-gray-50 via-[rgb(57,94,128)] to-[rgb(4,67,86)] sm:hidden'>
          <div className='mx-auto'>

            <img
              src="/images/gayatrib.png"
              alt="gold and silver coin banner"
              className="mx-auto pt-5"
            />
          </div>

          <div className="grid place-items-center mt-8 fade-in-up">
            <div className="text-gold01 text-center pt-1 poppins-bold ">
              <h1 className="text-4xl">
                DOUBLE THE JOY
              </h1>
            </div>
            <h4 className="text-white text-center pt-5 poppins-semibold text-2xl">
              Buy Gold and Get Silver Free Of Same Weight
            </h4>

          </div>

          <img
            src="/images/samegoldsilver.png"
            alt="gold and silver coin banner"
            className="rounded-b  mx-auto mt-8 p-4"
          />
        </div>


      </div>
      <div className='pb-2 xl:pb-8 '>
        <div className='bg-[#C8E9F2] mx-auto sm:hidden'>
          <div className='mx-auto'>

            <img
              src="/images/homeappbanner.png"
              alt="gold and silver coin banner"
              className="mx-auto pt-5"
            />
          </div>

          <div className="grid place-items-center mt-8 fade-in-up">
            <div className="text-black text-center pt-1 poppins-bold ">
              <h1 className="text-4xl">
                AUTOMATE YOUR
              </h1>
            </div>
            <h4 className="text-black text-center pt-1 poppins-semibold text-3xl">
              GOLD SAVINGS
            </h4>
            <img
              src="/images/dwm.png"
              alt="gold and silver coin banner"
              className="mx-auto pt-5 h-40 w-25"
            />
          </div>

          <img
            src="/images/abhinav.png"
            alt="gold and silver coin banner"
            className="rounded-b  mx-auto mt-8 p-4"
          />
        </div>
        <div className="hidden sm:block">
          <OfferSlider />

        </div>

      </div>
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
  title: "Bright DiGi Gold | Best Digital Gold Platform To Buy 24K Gold",
  description:
    "Bright DiGi Gold Digital Gold is a trusted platform to buy 24k digital gold starting from ₹10. A safe and secure online way to save and invest in digital gold.",



};
