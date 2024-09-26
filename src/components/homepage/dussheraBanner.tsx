"use client";
import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import useDetectMobileOS from "@/hooks/useDetectMobileOS";

export default function DussheraBanner() {
    const os = useDetectMobileOS();

    const handleBannerClick = () => {
        const url = os === 'iOS' ? 'https://apps.apple.com/in/app/bright-digi-gold-buy-24k-gold/id1640972173' : 'https://play.google.com/store/apps/details?id=com.brightdigigold.customer';
        if (url) {
            window.open(url, '_blank'); 
        }
    };

    return (
        <div className="relative">
            <Image
                src='/Navratri web banner.jpg'
                alt="Bdg offer"
                onClick={handleBannerClick}
                width={7500}
                height={750}
                className=""
                priority
                loading="eager" 
                layout="responsive"
            />
        </div>
    );
}
