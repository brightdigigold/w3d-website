import Contacts from '@/components/contactUs/contactUsPage'
import React from 'react'
import { Metadata } from "next";


const page = () => {
  return (
    <div className='container py-16 pb-28 xl:pb-8 pt-32'>
      <h1 className="text-white text-center text-2xl sm:text-4xl extrabold">
        Contact Us
      </h1>
      <Contacts />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Contact us - Bright DiGi Gold",
  description:
    "Reach Us at 501, 5th Floor World Trade Centre, Babar Road, New Delhi-110001 Bright Digital Gold Pvt Ltd.  ",
  openGraph: {
    images: [
      {
        url: "https://brightdigigold.s3.ap-south-1.amazonaws.com/contactus.png",
        width: "100%",
        height: "100%",
        alt: 'Contact us',
      },
    ],
  },
};