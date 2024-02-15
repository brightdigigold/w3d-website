"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import "./styles.css";

const features = [
  {
    img: "/piyush.jpg",
    name: "Kiran Palwar",
    pera: "The app's commitment to transparency is commendable. I always know where my money is and how it's performing.",
  },
  {
    img: "/Jyoti.jpg",
    name: "Anuj Lawaniya",
    pera: "I've been using this app for a year now, and the returns on my digital gold investments have been consistently positive.",
  },
  {
    img: "/Minakshi.jpg",
    name: "Krishna Gopal Deb    ",
    pera: "India top app bright digi gold 🥇. By selling instant payment Super is just a simple easy app.    ",
  },
  {
    img: "/Nitin Gupta.jpg",
    name: "Ajay Malik  ",
    pera: "Smooth and efficient. The app simplifies gold investment, making it accessible to everyone. A must-try!",
  },
  {
    img: "/sumit.jpg",
    name: "Ayush Jain",
    pera: "This platform is best for investment in gold. We can buy and sell gold at any time. The app is the best.    ",
  },
];
import { Autoplay } from "swiper/modules";
import { StarIcon } from "@heroicons/react/20/solid";

export default function Review() {
  return (
    <>
      <div className="bg-themeBlue">
        <div className="mx-auto px-4 sm:px-6 lg:px-16 py-8">
          <h1 className="text-center text-gray-800 text-3xl sm:text-5xl extrabold mb-0">
            Users Who Trust Us
          </h1>
          <Swiper
            loop={true}
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
                  <div className="bg-themeLight p-4">
                    {/* <div className="flex justify-center">
                      <img
                        src={feature.img}
                        className="rounded-full absolute -top-10 h-24 w-24 border border-blue-300"
                        alt="insite"
                      />
                    </div> */}

                    <p className="mt-12 text-left  h-12 text-white text-sm">
                      {feature.pera}
                    </p>
                    <p className="mt-8 text-left text-white extrabold text-sm">
                      {feature.name}
                    </p>
                    <div className=" flex mt-2">
                      <StarIcon className=" h-4 text-yellow-500" />
                      <StarIcon className=" h-4 text-yellow-500" />
                      <StarIcon className=" h-4 text-yellow-500" />
                      <StarIcon className=" h-4 text-yellow-500" />
                      <StarIcon className=" h-4 text-yellow-500" />
                    </div>
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
