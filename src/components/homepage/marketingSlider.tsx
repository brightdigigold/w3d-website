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
import { selectUser } from "@/redux/userDetailsSlice";
import { useDispatch } from "react-redux";
import { setShowProfileForm } from '@/redux/authSlice';


export default function Marketing() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const devotee_isNewUser = useSelector((state: RootState) => state.auth.devotee_isNewUser);
  const isLoggedInForTempleReceipt = useSelector((state: RootState) => state.auth.isLoggedInForTempleReceipt);
  const user = useSelector(selectUser);
  const userType = user.data.type;
  const [openLoginAside, setOpenLoginAside] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

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
      href: "/contact-us",
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

  const filteredFeatures = userType === "temple"
    ? features.filter(item => item.name !== "Start Gifting" && item.name !== "Gold KYC")
    : features;

  // const handleLinkClick = (item: any) => {
  //   if (!isloggedIn && (item.name === "Start Gifting" || item.name === "Gold KYC")) {
  //     setOpenLoginAside(true);
  //   } else {
  //     router.push(item.href);
  //   }
  // };

  const handleLinkClick = (item: any) => {
    if (item.name === "Customer Support") {
      // Open the login aside if the user is not logged in and clicks on "Start Gifting" or "Gold KYC"
      router.push(item.href);
    } else if (isLoggedIn) {
      // If the user is logged in, navigate to the item's href or specific path
      router.push(item.href);
    } else if (!isLoggedIn && !isLoggedInForTempleReceipt) {
      // Handle login click if the user is not logged in and not logged in for temple receipt
      setOpenLoginAside(true);
    } else if (isLoggedInForTempleReceipt && devotee_isNewUser) {
      // Show the profile form if the user is logged in for temple receipt and is a new user
      dispatch(setShowProfileForm(true));
    } else if (!user.data.isBasicDetailsCompleted) {
      // Show the profile form if the user's basic details are not completed
      dispatch(setShowProfileForm(true));
    } else {
      // Fallback action if none of the conditions are met, navigate to item's href
      router.push(item.href);
    }
  };


  return (
    <>
      <div className="bg-theme">
        {openLoginAside && (
          <LoginAside
            isOpen={openLoginAside}
            onClose={() => setOpenLoginAside(false)}
            purpose="login"
          />
        )}
        <div className="mx-auto backSlider px-4 sm:px-6 lg:px-16 pb-16">
          <Swiper
            loop={filteredFeatures.length > 1}
            spaceBetween={30}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination
            modules={[Autoplay, Pagination]}
            className="mySwiper"
          >
            {filteredFeatures.map((item, index) => (
              <SwiperSlide key={`${index}-Slider`} className="relative swiper-slide p-4">
                <div className="grid lg:grid-cols-2 gap-6 place-items-center">
                  <div className="relative mx-auto xl:h-96 pt-10 lg:pt-0" style={{ width: "70%", height: "auto" }}>
                    <Image
                      src={item.img}
                      alt={item.alt}
                      width={1200}
                      height={1200}
                      sizes="100vw"
                      style={{
                        width: "100%",
                        height: "auto"
                      }} />
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
