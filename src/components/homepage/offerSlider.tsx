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
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/offer1.jpg",
  },
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/offer2.jpg",
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
              width={3000} // Specify the width of your image here
              height={300} // Specify the height of your image here
              layout="responsive" 
              // This will make the image responsive
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}