'use client'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/motion'
import Link from 'next/link'

const AkshaytrityaOfferBanner = () => {
    return (
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
                            
                        </div>
                        <Image
                            src="/images/akshayTrityaOffer.jpg"
                            alt="Akshaytritya Offer Banner"
                            layout="responsive"
                            width={1920}
                            height={100}
                            priority
                            objectFit="cover" 
                        />
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
}

export default AkshaytrityaOfferBanner
