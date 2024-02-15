"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const features = [
  {
    img: "/lottie/offer1.jpg",
  },
  {
    img: "/lottie/offer2.jpg",
  },
];
import { Autoplay } from "swiper/modules";

export default function OfferSlider() {
  return (
    <>
      <div className="relative">
        <div className="">
          <div className="mx-auto">
            <div className="">
              <Swiper
                loop={true}
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
                  <SwiperSlide
                    key={`${index}-Slider`}
                    className="relative swiper-slide"
                  >
                    <div className=" client_grad">
                      <img
                        src={feature.img}
                        className=" mx-auto"
                        alt="Bdg offer"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
