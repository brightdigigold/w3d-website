import React from 'react'
import MainBlogPage from '@/components/blog/mainBlogPgae'
import { Metadata } from 'next/types'

const page = () => {
  return (
    <div>
      <h1 className='mt-24 text-yellow-400 text-center extrabold text-3xl sm:text-5xl'>Blogs</h1>
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
