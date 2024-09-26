"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import useDetectMobileOS from "@/hooks/useDetectMobileOS";
import clsx from "clsx";

// Define the type for the feature object
interface Feature {
    img: string;
    blurDataURL: string;
    redirectIOS?: string;
    redirectAndroid?: string;
}

const features: Feature[] = [
    {
        img: "/NavratriGiveawayBanner.jpg",
        blurDataURL: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSDIAAAABJLUvAQC4A1tXJAAAQU1EVgAA3YAAAADUAAABf///tA==",
        redirectIOS: "https://www.instagram.com/brightdigigold/",
        redirectAndroid: "https://www.instagram.com/brightdigigold/",
    },
    {
        img: "/Leadtowinsilverbanner.jpg",
        blurDataURL: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSDIAAAABJLUvAQC4A1tXJAAAQU1EVgAA3YAAAADUAAABf///tA==",
        redirectIOS: "https://apps.apple.com/in/app/bright-digi-gold-buy-24k-gold/id1640972173",
        redirectAndroid: "https://play.google.com/store/apps/details?id=com.brightdigigold.customer",
    },
];

export default function DussheraBanner() {
    const os = useDetectMobileOS();

    const handleBannerClick = (feature: Feature, index: number) => {
        const url = os === 'iOS' ? feature.redirectIOS : feature.redirectAndroid;
        if (url) {
            window.open(url, '_blank'); // Open the redirect link in a new tab
        }
    };

    return (
        <div className="relative">
            <Swiper
                loop={features.length > 1}
                speed={1500}  // Adjust this value for smoother transitions
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                }}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                className="mySwiper"
            >
                {features.map((feature, index) => (
                    <SwiperSlide
                        key={`${index}-Slider`}
                        className={clsx('relative swiper-slide cursor-pointer')}
                        onClick={() => handleBannerClick(feature, index)}
                    >
                        <Image
                            src={feature.img}
                            alt="Bdg offer"
                            width={3017}
                            height={917}
                            className=""
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                            placeholder="blur"
                            blurDataURL={feature.blurDataURL}
                            layout="responsive"
                            style={{
                                width: "100%",
                                height: "auto",
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <style jsx>{`
                .swiper-slide {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .swiper-slide img {
                    object-fit: cover;
                    max-width: 100%;
                    height: auto;
                    transition: transform 1.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}
