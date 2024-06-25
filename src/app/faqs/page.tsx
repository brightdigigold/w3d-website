import Faq from '@/components/faqs/faqPage'
import React from 'react'
import { Metadata } from "next";


const page = () => {
  return (
    <div className='mx-auto mt-24 pb-28 xl:pb-8 px-4 sm:px-6 lg:px-16 py-4 text-white'>
      <h1 className="text-white text-center text-2xl sm:text-4xl extrabold">
        FAQs
      </h1>
      <Faq />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Frequently Asked Questions- Bright DiGi Gold   ",
  description:
    "Find answers to frequently asked questions of Bright DiGi Gold, a digital platform for safe and secure gold transactions.  ",
};