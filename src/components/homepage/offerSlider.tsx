"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

const features = [
  {
    // img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/offer1+(1).webp",
    img: "/offer1.webp",

  },
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/offer2.jpg",
    // img: "/offer21.jpg",
  },
];

export default function OfferSlider() {
  return (
    <div className="relative">
      <Swiper
        loop={features.length > 1}
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
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {features.map((feature, index) => (
          <SwiperSlide key={`${index}-Slider`} className="relative swiper-slide">
            <Image
              src={feature.img}
              alt="Bdg offer"
              width={1261}
              height={400}
              // sizes="100vw"
              layout="responsive"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
            // style={{
            //   width: "100%",
            //   height: "auto"
            // }} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}