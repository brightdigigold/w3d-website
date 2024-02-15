"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

// import "./styles.css";

const features = [
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/blogs/Maximise-Your-Daily-Savings.png",
    // name: "Maximise Daily Savings With Digital Gold",
    link: "https://blog.brightdigigold.com/2023/04/20/make-a-golden-investment-on-this-akshaya-tritiya/",
  },
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/blogs/How-are-gold-prices-Determined.png",
    link: "https://blog.brightdigigold.com/2023/04/20/make-a-golden-investment-on-this-akshaya-tritiya/",
    // name: "How Are Gold Prices Determined?- Know Complete Information!",
  },
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/blogs/Akshaya-Tritiya.png",
    link: "https://blog.brightdigigold.com/2023/04/20/make-a-golden-investment-on-this-akshaya-tritiya/",
    // name: "Make A Golden Investment On This Akshaya Tritiya",
  },
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/blogs/Buying-gold-coins.png",
    link: "https://blog.brightdigigold.com/2023/04/20/make-a-golden-investment-on-this-akshaya-tritiya/",
    // name: "Buying Gold Coins- Important Things To Know!",
  },
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/blogs/Minor-Steps-and-Great-Savings.png",
    link: "https://blog.brightdigigold.com/2023/04/20/make-a-golden-investment-on-this-akshaya-tritiya/",
    // name: "Minor Steps And Great Savings: How To Effectively Save And Invest On Low Earnings",
  },
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/blogs/Things-to-Remember-Before-Buying-Gold-Jewellery.png",
    link: "https://blog.brightdigigold.com/2023/04/20/make-a-golden-investment-on-this-akshaya-tritiya/",
    // name: "Things To Remember Before Buying Gold Jewellery",
  },
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/blogs/Involved-Risks-And-Their-Solutions.png",
    link: "https://blog.brightdigigold.com/2023/04/20/make-a-golden-investment-on-this-akshaya-tritiya/",
    // name: "Digital Gold Investment: Involved Risks And Their Solutions",
  },
  {
    img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/blogs/Role-of-Technology.png",
    link: "https://blog.brightdigigold.com/2023/04/20/make-a-golden-investment-on-this-akshaya-tritiya/",
    // name: "The Future Is Now: Role Of Gold In Technology",
  },
];
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";

export default function Blog() {
  return (
    <>
      <div className="bg-theme">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-center text-yellow-500 text-3xl sm:text-5xl extrabold mb-0 sm:mb-6">
            Our Blogs
          </h1>
          <Swiper
            loop={true}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 5,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 5,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 5,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 5,
              },
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            effect={"coverflow"}
            // grabCursor={true}
            centeredSlides={true}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            navigation={true}
            modules={[EffectCoverflow, Navigation, Autoplay]}
            className="mySwiperblog"
            style={{ padding: "0 20px !important" }}
          >
            {features.map((feature, index) => (
              <SwiperSlide
                key={`${index}-Slider`}
                className="relative swiper-slide p-0 sm:p-4 pt-10"
              >
                <Link href={feature.link}>
                  <div className="rounded-2xl h-44 sm:h-72 relative">
                    <div className="flex justify-center">
                      <img
                        src={feature.img}
                        className="w-full rounded-2xl cursor-pointer"
                        alt="insite"
                      />
                    </div>
                    {/* <p className="mt-4 text-white text-xs sm:text-sm px-4">
                    {feature.name}
                  </p> */}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
