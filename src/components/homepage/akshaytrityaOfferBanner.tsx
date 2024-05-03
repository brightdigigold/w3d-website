'use client'
import Image from 'next/image'
import React from 'react'
import CustomButton from '../customButton'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const AkshaytrityaOfferBanner = () => {
    const router = useRouter()
    return (
        // Add responsive utilities and set position relative
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className=""
        >
            <Link href={`/coins/akshayaTritiya/${'GOLD'}`} >
                <motion.div variants={fadeIn("right", "spring", 0.5, 1)}>
                    <div className="relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-1" style={{ zIndex: 10 }}>
                            {/* Place the button at the bottom-right corner of the image */}
                            {/* <CustomButton
                                containerStyles="px-1 py-1 ml-4 sm:px-5 sm:py-2 sm:text-md text-xxs bg-white rounded-full border-2 border-yellow-400 text-blue-400"
                                handleClick={() => {
                                    console.log('AkshaytrityaOfferBanner')
                                    router.push(`/coins/akshayaTritiya/${'GOLD'}`)
                                }}
                                title='Avail The Offer'
                            /> */}
                        </div>
                        {/* Ensure the Image takes full width of its container */}
                        <Image
                            src="/images/akshayTrityaOffer.jpg"
                            alt="Akshaytritya Offer Banner"
                            layout="responsive"
                            width={1920}
                            height={100}
                            objectFit="cover" // Adjust how image fills the area
                        />
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
}

export default AkshaytrityaOfferBanner
