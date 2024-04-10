import React from 'react'
import MainBlogPage from '@/components/blog/mainBlogPgae'
import { Metadata } from 'next/types'

const page = () => {
  return (
    <div>
      <MainBlogPage />
    </div>
  )
}

export const metadata: Metadata = {
  title: "Insights and Inspiration: The Bright DiGi Gold Blog",
  description:
    "Stay ahead in the digital gold revolution with our blog's timely updates, educational resources, and expert perspectives.",
};
export default page
