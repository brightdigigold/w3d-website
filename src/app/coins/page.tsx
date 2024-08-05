import Coins from '@/components/coins/coinsPage';
import React from 'react';
import { Metadata } from "next";
import Image from "next/image";

const Page = () => {
  return (
    <div className='pb-28 xl:pb-8 '>
      <div className='flex bg-[#C8E9F2] justify-between mx-auto container'>
        <Image
          src="/gaytri.png"
          alt="gold and silver coin banner"
          className="rounded-b md:mt-4"
          width={376}
          height={416}
          priority={true}
          layout='intrinsic'
        />
        <div className='grid place-items-center'>
          <div className='2xl:mt-44'>
            <div className="text-black text-center text-4xl lg:text-5xl">
              GET FREE DELIVERY
            </div>
            <p className='text-black text-center text-5xl pt-2 lg:text-3xl'>
              of Gold and Silver Coins
            </p>
            <p className='text-black text-center text-4xl pt-2 lg:text-2xl'>
              at your Doorstep
            </p>
          </div>
        </div>
        <Image
          src="/Coins stand.png"
          alt="gold and silver coin banner"
          className="rounded-b mt-36"
          width={462}
          height={662}
          priority={true}
          layout='intrinsic'
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
