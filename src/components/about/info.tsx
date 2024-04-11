"use client";
import React from "react";
import { TypingText } from "../Customtexts";
import { motion } from "framer-motion";
import { fadeIn, slideIn } from "../../utils/motion";

const Info = () => {
  return (
    <div className="bg-themeBlue pt-10" >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className=""
      >
        <div className="mx-auto pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-0">
          <h1 className="text-center text-gray-900 text-3xl sm:text-5xl extrabold mb-6">
            Our Story
          </h1>
          <TypingText title="Our Service" textStyles="text-center" />
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="pl-4 pr-4 lg:pl-8 lg:pr-0">
              <p className="mb-6 text-xl leading-8  pt-10">
                Bright Digi Gold was founded in the Year 2021 with a Simple yet
                Powerful idea – to redefine the standards of excellence in the
                digital sphere. It is a sister concern of Bright Gold (Bright
                Metal Refiners), which has been in the business for a long time
                now. Bright Gold is an organisation to refine and recycle
                precious metals such as gold and silver. As a refiner and
                manufacturer, they are traders, suppliers, and service providers
                as well.
              </p>

              <p className="mb-6 text-xl leading-8">
                Bright DiGi Gold is a technology driven company which makes it
                innovative and convenient for our customers to save smartly in
                digital gold. We endeavour to make your digital gold savings
                such as buying, selling, delivery of digital gold and silver in
                the simplest possible way.
              </p>
              <p className="text-xl leading-8 pb-12">
                Everyone will always expect pure and quality Gold for their
                savings, Bright DiGi Gold will ensure purity and high-quality
                gold in physical form. We offer 24 karat 99.9% pure gold and
                99.99% fine silver with a certificate of purity. You can begin
                to save on our platform with as little as ₹10. Not just that
                your digital gold is secured in the world class vault.
              </p>
            </div>
            <motion.div
              className=" flex items-end  justify-center "
              variants={fadeIn("right", "spring", 0.2, 1)}
            >
              <img src="/lottie/Team Work.gif" className="px-24" alt="team work animation" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Info;
