"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const features = [
  {
    img: "/piyush.jpg",
    name: "Piyush Puri",
    pera: "This app has completely changed the way I manage my savings. I highly recommend this app to anyones who wants to transform their investment.",
  },
  {
    img: "/Jyoti.jpg",
    name: "Jyoti Tiwari",
    pera: "I was hesitant at first to buy digital gold, but this app made the process so simple and easy. The interface is user friendly and instructions are very clear. I now feel confident in my investment.",
  },
  {
    img: "/Minakshi.jpg",
    name: "Meenakshi Sharma",
    pera: "I recently invested in Gold and I would like to share my journey with you all. Bright DiGi Gold made my investment quick and easy. You can buy 24K pure gold with their safe and secure policies.",
  },
  {
    img: "/Nitin Gupta.jpg",
    name: "Nitin Gupta",
    pera: "I would like to share my hands-on experience with Bright DiGi Gold. I purchased 24k gold and I must say it has truly impressed me with its innovative approach to digital gold investment.",
  },
  {
    img: "/sumit.jpg",
    name: "Sumit Singhal",
    pera: "Bright DiGi Gold is a wonderful app. I cannot believe that buying gold could be so easy and convenient. Anyone who wants to invest in gold can definitely go for it without any doubt.",
  },
];
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

export default function Review() {
  return (
    <>
      <div className="bg-themeBlue">
        <div className="mx-auto px-4 sm:px-6 lg:px-16 py-8">
          <h1 className="text-center text-gray-800 text-3xl sm:text-5xl extrabold mb-12">
            Feedback
          </h1>
          <Swiper
             loop={features.length > 1}
            breakpoints={{
              600: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 3,
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
              <SwiperSlide
                key={`${index}-Slider`}
                className="relative swiper-slide p-4 pt-10"
              >
                <div className="bg-theme rounded-2xl border-b-2 border-blue-400  relative">
                  <div className="bg-themeLight h-72 p-4">
                    <div className="flex justify-center">
                      <Image
                        src={feature.img}
                        className="rounded-full absolute -top-10 border border-blue-300"
                        alt="insite"
                        width={100}
                        height={100}
                      />
                    </div>
                    <p className="mt-16 text-center text-white extrabold text-sm">
                      {feature.name}
                    </p>
                    <p className="mt-6 text-center text-white text-sm">
                      {feature.pera}
                    </p>
                    <img
                      alt="user"
                      className="h-8 absolute bottom-2 right-6"
                      src="/images/testimonial2.png"
                    ></img>
                    <img
                      alt="user"
                      className="h-8 absolute top-2 left-6 rotate-180"
                      src="/images/testimonial2.png"
                    ></img>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
