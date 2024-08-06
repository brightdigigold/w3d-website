import Coins from '@/components/coins/coinsPage';
import React from 'react';
import { Metadata } from "next";
import CoinBanner from './coinBanner';
import Image from 'next/image';

const Page = () => {
  return (
    <div className='pb-28 xl:pb-8 '>
      <div className='bg-[#C8E9F2] mx-auto sm:hidden'>
        <div className='mx-auto'>
          <Image
            src="/coin gaytri Mobile.png"
            alt="gold and silver coin banner"
            className="mx-auto pt-24"
            width={276}
            height={356}
            layout="intrinsic"
            priority={true}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div className="grid place-items-center mt-8 fade-in-up">
          <div className="text-black text-center pt-1 poppins-bold ">
            <h1 className="text-4xl">
              GET FREE DELIVERY
            </h1>
          </div>
          <h4 className="text-black text-center pt-1 poppins-semibold text-3xl">
            of Gold and Silver Coins
          </h4>
          <h4 className="text-black text-center pt-1 text-2xl">
            at your Doorstep
          </h4>
        </div>

        <img
          src="/Coins stand (1).png"
          alt="gold and silver coin banner"
          className="rounded-b  mx-auto mt-8 p-4"
        />
      </div>
      <div className="hidden sm:block">
        <CoinBanner />
      </div>
      <h2 className="text-white text-2xl sm:text-4xl pb-8 extrabold text-center mt-8">
        Our Coins
      </h2>
      <Coins />
    </div>
  );
};

export default Page;

export const metadata: Metadata = {
  title: "Gold Coins and Silver Coins - Bright DiGi Gold",
  description: "Explore our wide range of Gold and Silver coins with 24k purity and 100% safe and secure delivery.",
};
