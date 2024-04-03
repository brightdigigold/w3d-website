"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils/motion";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import OtpModal from "../modals/otpModal";
import NextImage from "../nextImage";

const HeroAbout = () => {
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);

  return (
    <div className="bg-theme pt-24 sm:pt-36 py-10 relative" style={{ maxWidth: '1920px' }}>
      {otpModal && <OtpModal />}
      <div className="mx-auto px-4 sm:px-6 lg:px-16">
        <NextImage
          className=" absolute top-48 -left-20 opacity-20 z-10"
          src="/bdgwhite.png"
          alt="Bright Digi Gold"
          width={500} height={500}
        />
        <div className="grid gap-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className=""
          >
            {/* <motion.h1
              variants={fadeIn("right", "spring", 0.2, 1)}
              className="text-2xl sm:text-4xl text-white text-center font-semibold leading-tight mb-28"
            >
              “Buy & Sell 24 karat Digital Gold” <br /> From The Comfort of Your
              Home
            </motion.h1> */}

            <div className="flex items-center justify-center px-4 lg:px-52">
              <motion.div variants={fadeIn("left", "spring", 0.2, 1)}>
                <img
                  className="z-20 relative"
                  src="/Login Screen.png"
                  alt="App login screen"
                />
              </motion.div>
              <motion.div variants={textVariant(1.1)}>
                <img
                  className="-mt-28 z-20 relative"
                  src="/Home Screen.png"
                  alt="app home screen"
                />
              </motion.div>
              <motion.div variants={fadeIn("right", "spring", 0.2, 1)}>
                <img
                  className="z-20 relative"
                  src="/Coin Screen.png"
                  alt="app coin screen"
                />
              </motion.div>
            </div>
            <motion.p
              variants={fadeIn("bottom", "spring", 0.2, 1)}
              className="text-white text-center leading-6  mb-4 mt-6 text-lg"
            >
              A place where digital innovation and quality combine! We at Bright
              Digi Gold are more than simply an organisation; we're a vibrant
              group of enthusiasts with a mission to add our golden touch to the
              digital environment.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroAbout;
