"use client";
import React from "react";
import goldBarData from "../../../public/lottie/GoldBricks.json";
import Lottie from "lottie-react";

const Succession = () => {
  return (
    <div className="bg-theme py-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 relative">
        <div className="grid md:grid-cols-2 gap-4 place-items-center">
          <h1 className="col-span-2 text-3xl sm:text-5xl text-gold01 text-center extrabold leading-tight mb-2">
            Succession Of Gold <br />
            Over The Years
          </h1>
          <p className="col-span-2 md:col-span-1 text-white text-justify leading-8  mb-4 text-lg">
            We all know that Gold has proven to be a stable Investment, and it
            has shown great consistency and growth in value. While there have
            been fluctuations in Gold prices, its long-term trend has always
            been upwards.
            <br />
            <br />
            With Bright DiGi Gold, Invest your Savings in Digital Gold has been
            considered as a bright and smart saving choice for those looking to
            diversify their investment portfolio and protect their wealth.
          </p>
          <div className="relative col-span-2 md:col-span-1">
            {/* <Lottie
              animationData={goldBarData}
              className="h-72 md:absolute right-20 lg:right-40"
              loop={true}
            /> */}
            <img src="/lottie/GOLDGRAPH.gif" className="h-96 mx-auto" />
          </div>
        </div>
        {/* <CustomButton title="Invest now" /> */}
      </div>
    </div>
  );
};

export default Succession;
