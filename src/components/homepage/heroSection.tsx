"use client";
import React, { useEffect, useState } from "react";
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
import NextImage from "../nextImage";
import Image from "next/image";

const HeroSection = () => {
  const dispatch = useDispatch();
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);
  const showProfileForm = useSelector((state: RootState) => state.auth.showProfileForm);

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
    if (localStorage.getItem('token') != null) {
      dispatch(fetchWalletData() as any);
    }
  };

  useEffect(() => {
    functionToFetchWalletData()
  }, [dispatch]);

  return (
    <>
      <div className="bg-theme pt-28 py-10" >
        {otpModal && <OtpModal />}

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-16">
            <div className="relative">
              <Image
                src="/bdgwhite.png"
                alt="Your Company"
                width={24 * 10}
                height={16 * 10}
                className="absolute  opacity-40 h-72 top-72 hidden sm:block"
              />
            </div>
            {/* <div className="relative">
              <div className="absolute top-72 h-72 opacity-40 bg-cover bg-no-repeat bg-center hidden sm:block" style={{ backgroundImage: `url('../../../public/bdgwhite.png')` }}></div>
            </div> */}

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="hidden lg:block mt-10">
                <motion.h1
                  variants={fadeIn("right", "spring", 0.2, 0.2)}
                  className="text-6xl text-white bold leading-tight mb-12 "
                >
                  <span className="text-themeBlueLight extrabold">
                    Start Your Savings
                  </span>
                  <br />
                  <span className="font-thin flex items-center gap-2">
                    With Just <span className="text-gold01 extrabold mt-3">
                      <NextImage alt="rupees icon" src="/Rupees.png" width={45} height={45} />
                    </span>10
                  </span>
                </motion.h1>
                <motion.div variants={textVariant(1.1)}>
                  <div className="inline-block items-center border-gold rounded-lg px-2 py-1">
                    <img
                      className="h-6 inline-block"
                      src="/Goldbarbanner.png"
                      alt="Digital Gold Bar"
                    />
                    <p className="text-gold01 p-1 px-3 ml-3 lg:text-lg xl:text-xl bold inline-block">
                      Best Platform to Buy & Sell 24K Digital Gold
                    </p>
                  </div>

                  <p className="text-white leading-8  mb-4 mt-6 text-lg pr-28">
                    We at Bright DiGi Gold invite you to embark on a journey of
                    effortless digital savings. In just a few clicks make your
                    savings grow in Digital Gold and Silver.  Your gateway to
                    hassle-free savings is here.
                  </p>
                  <div className="flex items-center">
                    <p className="text-xl bold text-white">Trusted By</p>
                    <img
                      className="h-14 ml-2 mt-2"
                      src="/Startup India.svg"
                      alt="Startupindia logo"
                    />
                  </div>

                  <div className="flex gap-5 mt-8 relative">
                    <Link target="_blank"
                      href="https://play.google.com/store/apps/details?id=com.brightdigigold.customer"
                      className="cursor-pointer"
                    >

                      <NextImage
                        src="https://brightdigigold.s3.ap-south-1.amazonaws.com/google-play-button.png"
                        alt="google play button"
                        width={18 * 12}
                        height={9 * 10}
                      />
                    </Link>
                    <Link target="_blank"
                      href="https://apps.apple.com/in/app/bright-digi-gold-buy-24k-gold/id1640972173"
                      className="cursor-pointer"
                    >
                      <NextImage
                        src="https://brightdigigold.s3.ap-south-1.amazonaws.com/app-store-button+(2).png"
                        width={18 * 12}
                        height={9 * 10}
                        alt="app store button"
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
    </>
  );
};

export default HeroSection;
