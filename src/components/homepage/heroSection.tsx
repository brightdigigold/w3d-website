"use client";
import React, { useEffect } from "react";
import BuySell from "./buySell";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils/motion";
import { AesDecrypt } from "../helperFunctions";
import {
  setShowOTPmodal,
  setShowProfileForm,
  profileFilled,
  setIsLoggedInForTempleReceipt,
} from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import OtpModal from "../modals/otpModal";
import SetProfileForNewUser from "../setProfile";
import { fetchWalletData } from "@/redux/vaultSlice";
import Image from "next/image";

const HeroSection = () => {
  const dispatch = useDispatch();
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);
  const showProfileForm = useSelector(
    (state: RootState) => state.auth.showProfileForm
  );

  const onClose = () => {
    dispatch(setShowProfileForm(false));
  };

  useEffect(() => {
    const checkUserIsNew = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        try {
          const response = await fetch(
            `${process.env.baseUrl}/auth/validate/token`,
            configHeaders
          );
          const data = await response.json();
          const decryptedData = await AesDecrypt(data.payload);
          const userdata = JSON.parse(decryptedData).data;
          if (userdata?.isBasicDetailsCompleted) {
            dispatch(setShowOTPmodal(false));
            dispatch(profileFilled(true));
            dispatch(fetchWalletData() as any);
          } else {
            dispatch(setShowProfileForm(false));
          }
        } catch (errorWhileCheckingIsUserNew) {
          alert(errorWhileCheckingIsUserNew);
        }
      }
    };
    dispatch(setShowOTPmodal(false));
    checkUserIsNew();
  }, []);

  useEffect(() => { }, [otpModal]);

  const functionToFetchWalletData = () => {
    if (localStorage.getItem("token") != null) {
      dispatch(fetchWalletData() as any);
    }
  };

  useEffect(() => {
    functionToFetchWalletData();
  }, [dispatch]);


  const line = "We at Bright DiGi Gold invite you to embark on a journey of effortless digital savings. In just a few clicks make your savings grow in Digital Gold and Silver.  Your gateway to hassle-free savings is here."

  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.02,
        staggerChildren: 0.03,
      },
    },
  }

  const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <div className="bg-theme mt-8">
      {otpModal && <OtpModal />}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-16">
          <div className="relative" style={{ width: '100%', height: 'auto' }}>
            <Image
              src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgwhite5.webp"
              alt="Your Company"
              layout="responsive"
              width={270}
              height={270}
              className="hidden sm:block"
              style={{
                position: "absolute",
                top: "206px",
                left: "176px",
                maxWidth: "620px",
                height: "auto",
                opacity: 0.3,
              }}
              priority={true}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="hidden lg:block mt-10">
              <motion.h1
                variants={fadeIn("right", "spring", 0.2, 0.2)}
                className="text-white mb-12"
                style={{ fontSize: "4rem", lineHeight: "2.5rem" }}
              >
                <span className="text-themeBlueLight extrabold">
                  Start Your Savings
                </span>
                <br />
                <span className="font-thin flex items-center bold leading-tight">
                  With Just{" "}
                  <span className="mt-2 ml-2">
                    <Image
                      src="/Rupees.png"
                      alt="rupees icon"
                      width={45}
                      height={45}
                      priority={true}
                      loading="eager"
                    />
                  </span>
                  10 <span className="text-gold01">.</span>
                </span>
              </motion.h1>
              <motion.div variants={textVariant(1.1)}>
                <div className="inline-block items-center border-gold rounded-lg px-2 py-1">
                  <Image
                    width={40}
                    height={40}
                    className="inline-block"
                    src="/Goldbarbanner.png"
                    alt="Digital Gold Bar"
                    priority={true}
                  />
                  <p className="text-gold01 p-1 px-3 ml-3 lg:text-lg xl:text-xl bold inline-block">
                    Best Platform to Buy & Sell 24K Digital Gold
                  </p>
                </div>
                <div className="mb-4 mt-6 pr-28">
                  <motion.h3 className="load-screen--message text-white leading-8 text-lg text-justify"
                    variants={sentence}
                    initial="hidden"
                    animate="visible"
                  >
                    {line.split("").map((char: any, index: any) => {
                      return (
                        <motion.span key={char + "-" + index} variants={letter}>
                          {char}
                        </motion.span>
                      )
                    })}
                  </motion.h3>
                </div>
                <div className="flex items-center">
                  <p className="text-xl bold text-white">Trusted By</p>
                  <Image
                    width={180}
                    height={140}
                    className="ml-2 mt-2"
                    src="/Startup_India.svg"
                    alt="Startupindia logo"
                    priority={true}
                  />
                </div>

                <div className="flex gap-5 mt-8 relative">
                  <Link
                    target="_blank"
                    href="https://play.google.com/store/apps/details?id=com.brightdigigold.customer"
                    className="cursor-pointer"
                  >
                    <Image
                      src="https://brightdigigold.s3.ap-south-1.amazonaws.com/google-play-button.png"
                      alt="google play button"
                      width={256}
                      height={79}
                      priority
                      sizes="(max-width: 128px) 100vw, 128px"
                    />
                  </Link>
                  <Link
                    target="_blank"
                    href="https://apps.apple.com/in/app/bright-digi-gold-buy-24k-gold/id1640972173"
                    className="cursor-pointer"
                  >
                    <Image
                      src="https://brightdigigold.s3.ap-south-1.amazonaws.com/app-store-button+(2).png"
                      width={256}
                      height={79}
                      alt="app store button"
                      priority
                      sizes="(max-width: 128px) 100vw, 128px"
                    />
                  </Link>
                </div>
              </motion.div>
              <div className="flex justify-center mt-4"></div>
            </div>
            <motion.div variants={fadeIn("bottom", "spring", 0.5, 0.5)}>
              <BuySell />
            </motion.div>
          </div>
          {showProfileForm && (
            <SetProfileForNewUser isOpen={showProfileForm} onClose={onClose} />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
