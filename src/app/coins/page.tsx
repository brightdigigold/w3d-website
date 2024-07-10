import Coins from '@/components/coins/coinsPage'
import React from 'react'
import { Metadata } from "next";
import Image from "next/legacy/image";

const page = () => {
  return (
    <div className='pb-28 xl:pb-8 pt-16'>
      <div className="flex justify-center items-center">
        <Image src="https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/ProductBannerNEW.jpg" alt="gold and silver coin banner" className="rounded-b" width={1600} height={300} priority={true} />
      </div>
      <h1 className="text-white text-2xl sm:text-4xl extrabold text-center mt-8">Our Coins</h1>
      <Coins />
    </div>
  )
}

export default page
export const metadata: Metadata = {
  title: "Gold Coins and Silver Coins- Bright DiGi Gold  ",
  description: "Explore our wide range of Gold and Silver coins with 24k purity and 100% safe and secure delivery.",
};