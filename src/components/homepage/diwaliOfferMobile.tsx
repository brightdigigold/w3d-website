'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
import Image from 'next/image';

const DiwaliOfferMobile = () => {
    const router = useRouter();

    return (
        <div><Image src="/Diwali Dhamaka 5+5 offer banner (1).jpg" alt='diwali offer' width={7834} height={2934} layout='responsive' onClick={() => { router.push('/coins') }} /></div>
    )
}

export default DiwaliOfferMobile