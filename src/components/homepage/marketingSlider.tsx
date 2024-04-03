"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination } from "swiper/modules";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LoginAside from "../authSection/loginAside";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function Marketing() {
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [openLoginAside, setOpenLoginAside] = useState(false);
  const router = useRouter();

  const features = [
    {
      img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/giftonline.gif",
      alt: "Gifting",
      name: "Start Gifting",
      pera: " Gift 24K pure gold and 99.99% fine silver with your special ones and share the happiness in a unique way.",
      linkName: "Gift Now",
      href: "/dashboard",
    },
    {
      img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/KYC+Verification.gif",
      alt: "Kyc Verification",
      name: "Gold KYC",
      pera: " Simplify your life by completing your KYC effortlessly and embark on a seamless digital gold and silver savings journey.",
      linkName: "KYC Now",
      href: "/myAccount",
    },
    {
      img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/Customer+support.gif",
      alt: "Customer support",
      name: "Customer Support",
      pera: "Trust us to be your reliable partner for your financial journey. Our robust customer support is always there to assist you.",
      linkName: "Contact Us",
      href: "/contact",
    },
    {
      img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/homepagedelivery.gif",
      alt: "Home Delivery",
      name: "Get It Delivered",
      pera: " Say goodbye to hassle and embrace the happiness of owing gold/silver at your fingertips with utmost ease.",
      linkName: "Buy Now",
      href: "/coins",
    },
  ];

  const handleLinkClick = (item: any) => {
    if (!isloggedIn && (item.name === "Start Gifting" && item.name === "Gold KYC")) {
      setOpenLoginAside(true);
    } else {
      router.push(item.href);
    }
  };


  return (
    <>
      <div className="bg-theme" style={{ maxWidth: '1920px' }}>
        {openLoginAside && (
          <LoginAside
            isOpen={openLoginAside}
            onClose={() => setOpenLoginAside(false)}
          />
        )}
        <div className="mx-auto backSlider px-4 sm:px-6 lg:px-16 pb-16">
          <Swiper
            loop={features.length > 1} // Enable loop mode only if there are enough slides
            spaceBetween={30}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination
            modules={[Autoplay, Pagination]}
            className="mySwiper"
          >
            {features.map((item, index) => (
              <SwiperSlide key={`${index}-Slider`} className="relative swiper-slide p-4">
                <div className="grid lg:grid-cols-2 gap-20 place-items-center">
                  <div className="relative mx-auto xl:h-96 pt-10 lg:pt-0" style={{ width: '50%', height: '50%' }}>
                    <Image
                      src={item.img}
                      alt={item.alt}
                      width={800} // Specify the width of your image here
                      height={100} // Specify the height of your image here
                      layout="responsive" // Adjust quality if needed
                    />
                  </div>
                  <div>
                    <h1 className="text-gold01 text-3xl sm:text-5xl extrabold mb-8">
                      {item.name}
                    </h1>
                    <p className="w-full lg:w-3/4 text-white text-lg sm:text-2xl">
                      {item.pera}
                    </p>
                    <div className=" mt-12 flex md:block justify-center">
                      <button
                        className="bg-themeBlue rounded-lg py-3 px-8 extrabold text-center"
                        onClick={() => handleLinkClick(item)}
                      >
                        {item.linkName}
                      </button>
                    </div>
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

