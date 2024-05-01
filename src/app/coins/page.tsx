import Coins from '@/components/coins/coinsPage'
import React from 'react'
import { Metadata } from "next";

const page = () => {
  return (
    <>
      <Coins />
    </>
  )
}

export default page
export const metadata: Metadata = {
  title: "Gold Coins and Silver Coins- Bright DiGi Gold  ",
  description: "Explore our wide range of Gold and Silver coins with 24k purity and 100% safe and secure delivery.",
};