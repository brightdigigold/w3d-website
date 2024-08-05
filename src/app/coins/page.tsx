import Coins from '@/components/coins/coinsPage'
import React from 'react'
import { Metadata } from "next";
import Image from "next/image";

const page = () => {
  return (
    <div className='pb-28 xl:pb-8 pt-16'>

      {/* <div className='flex bg-[#C8E9F2] justify-between'>
        <Image
          src="/gaytri.png"
          alt="gold and silver coin banner"
          className="rounded-b "
          width={476}
          height={1416}
          priority={true}
          layout='intrinsic'
        />
        <div className='h-screen grid place-items-center'>
          <div className='mt-44'>
            <p className='text-black font-extrabold bg-yellow-300 sm:text-3xl xl:text-5xl'>
              GET FREE DELIVERY
            </p>
            <p className='text-black font-extrabold text-center text-4xl pt-2'>
              of Gold and Silver Coins
            </p>
            <p className='text-black font-extrabold text-center text-3xl pt-2'>
              at your Doorstep
            </p>
          </div>
        </div>

        <Image
          src="/Coins stand.png"
          alt="gold and silver coin banner"
          className="rounded-b"
          width={662}
          height={0}
          priority={true}
          layout='intrinsic'
        />
      </div> */}

      <div className="flex justify-center items-center">
        <Image
          src="https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/ProductBannerNEW.jpg"
          alt="gold and silver coin banner"
          className="rounded-b"
          width={1600}
          height={700}
          priority={true}
          layout='intrinsic'
        />
      </div>
      <h1 className="text-white text-2xl sm:text-4xl extrabold text-center mt-8">Our Coins</h1>
      <Coins />
    </div>
  );
}

export default page
export const metadata: Metadata = {
  title: "Gold Coins and Silver Coins- Bright DiGi Gold  ",
  description: "Explore our wide range of Gold and Silver coins with 24k purity and 100% safe and secure delivery.",
};