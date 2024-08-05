import Coins from '@/components/coins/coinsPage';
import React from 'react';
import { Metadata } from "next";
import Image from "next/image";

const Page = () => {
  return (
    <div className='pb-28 xl:pb-8 '>
      <div className='flex bg-[#C8E9F2] justify-between mx-auto max-w-[1600px]'>
        <Image
          src="/gaytri.png"
          alt="gold and silver coin banner "
          className="rounded-b md:mt-4"
          width={476}
          height={0}
          priority={true}
          layout='intrinsic'
        />
        <div className='grid place-items-center'>
          <div className='2xl:mt-44'>
            <div className="text-black text-center pt-1 poppins-bold text-5xl">
              GET FREE DELIVERY
            </div>
            <p className='text-black text-center pt-1 poppins-semibold text-4xl'>
              of Gold and Silver Coins
            </p>
            <p className='text-black text-center pt-1 text-3xl'>
              at your Doorstep
            </p>
          </div>
        </div>
        <img
          src="/Coins stand (1).png"
          alt="gold and silver coin banner"
          className="rounded-b mt-64 h-2/6 w-2/6 mr-5"
        />
      </div>
      <h1 className="text-white text-2xl sm:text-4xl pb-8 extrabold text-center mt-8">
        Our Coins
      </h1>
      <Coins />
    </div>
  );
};

export default Page;

export const metadata: Metadata = {
  title: "Gold Coins and Silver Coins - Bright DiGi Gold",
  description: "Explore our wide range of Gold and Silver coins with 24k purity and 100% safe and secure delivery.",
};
