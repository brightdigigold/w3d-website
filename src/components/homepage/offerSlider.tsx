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
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// Define the type for the feature object
interface Feature {
  img: string;
  blurDataURL: string;
  redirectIOS?: string;
  redirectAndroid?: string;
  redirectUrl?: string;
}

const features: Feature[] = [
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/promoBannerThree.jpg",
    blurDataURL: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSDIAAAABJLUvAQC4A1tXJAAAQU1EVgAA3YAAAADUAAABf///tA==",
    redirectIOS: "https://apps.apple.com/in/app/bright-digi-gold-buy-24k-gold/id1640972173",
    redirectAndroid: "https://play.google.com/store/apps/details?id=com.brightdigigold.customer",
  },
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/promoBannerTwoNew.jpg",
    blurDataURL: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSDIAAAABJLUvAQC4A1tXJAAAQU1EVgAA3YAAAADUAAABf///tA==",
  },
  {
    img: "/Diwali Dhamaka 5+5 offer banner (1) (1).jpg",
    blurDataURL: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSDIAAAABJLUvAQC4A1tXJAAAQU1EVgAA3YAAAADUAAABf///tA==",
    redirectUrl: "/Coins",
  },
];

export default function OfferSlider() {
  const os = useDetectMobileOS();
  const router = useRouter();
  const userType = useSelector((state: RootState) => state.auth.UserType);
  // console.log("userType: ", userType);

  const handleBannerClick = (feature: Feature) => {
    const url = os === 'iOS' ? feature.redirectIOS : feature.redirectAndroid;
    if (feature.redirectUrl === "/Coins") {
      router.push("/coins");
    } else if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="mt-6">
      {userType == "corporate" ?
        <div className="hidden sm:block">
          <Image
            width={1250}
            height={500}
            alt="gold and silver coin banner"
            src='https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/promoBannerTwoNew.jpg'
            layout='responsive'
          />
        </div> :
        <div className="relative">
          <Swiper
            loop={features.length > 1}
            speed={2000}  // Adjust this value for smoother transitions
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
                className={clsx('relative swiper-slide max-h-full', { 'cursor-pointer': index === 0 || index === 2 })}
                onClick={() => (index === 0 || index === 2) && handleBannerClick(feature)}
              >
                <Image
                  src={feature.img}
                  alt="Bdg offer"
                  width={1250}
                  height={500}
                  className=""
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  placeholder="blur"
                  layout="intrinsic"
                  blurDataURL={feature.blurDataURL}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>}
      <style jsx>{`
        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .swiper-slide img {
          object-fit: cover;
          max-width: 100%;
          height: 80%;
          transition: transform 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
