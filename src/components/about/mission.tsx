"use client";
import React from "react";

import { motion } from "framer-motion";
import { textVariant } from "../../utils/motion";

const Mission = () => {
  return (
    <div className="bg-theme py-10">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-16 relative">
          <img
            className="h-800 absolute top-32 -left-20 opacity-20"
            src="/bdgwhite.png"
            alt="Bright Digi Gold Vision"
          />
          <div className="grid sm:grid-cols-2 gap-4 place-items-center">
            <h1 className="col-span-2 text-3xl sm:text-5xl text-gold01 text-center extrabold leading-tight mb-0 sm:mb-6">
              Our Vision
            </h1>
            <p className="col-span-2 sm:col-span-1 text-white text-left leading-8  mb-4 mt-6 text-lg">
              At Bright Digi Gold, we pioneer innovative solutions in the
              digital space, transforming your savings management. Our
              commitment to transparency and accountability ensures a secure,
              enhanced financial experience. Specializing in digital gold and
              silver services, we empower customers to achieve financial goals
              conveniently from home.
            </p>
            <motion.div
              variants={textVariant(1.1)}
              className=" col-span-2 sm:col-span-1 rounded-2xl bg-themeBlue"
            >
              <img
                src="/lottie/Vision.gif"
                className="mx-auto h-72"
                alt="Bright Digi Gold Vision"
              />
            </motion.div>
            <h1 className="col-span-2 text-3xl sm:text-5xl text-gold01 text-center extrabold leading-tight mb-0 sm:mb-6">
              Our Mission
            </h1>
            <motion.div
              variants={textVariant(1.1)}
              className="col-span-2 sm:col-span-1 rounded-2xl bg-themeBlue px-12"
            >
              <img
                src="/lottie/Mission.gif"
                className="mx-auto h-72"
                alt="Bright Digi Gold Mission"
              />
            </motion.div>
            <p className="col-span-2 sm:col-span-1 text-white text-left leading-8  mb-4 mt-6 text-lg">
              Bright Digi Gold envisions leadership in digital gold trade,
              aiming for a flawless system that offers reliable investment
              solutions. Our vision includes becoming a trusted, transparent,
              and secure brand, making gold savings accessible to diverse
              portfolios. We prioritize strong customer relationships, embodying
              friendliness, approachability, and dedication to providing
              valuable products and services.
            </p>
          </div>
          {/* <CustomButton title="Invest now" /> */}
        </div>
      </motion.div>
    </div>
  );
};

export default Mission;
