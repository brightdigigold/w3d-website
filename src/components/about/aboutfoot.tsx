import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import OtpModal from "../modals/otpModal";
const AboutFoot = () => {
  return (
    <div className="py-8 bg-header pb-28 xl:pb-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 relative">
        <h1 className="text-2xl lg:text-3xl xl:text-4xl extrabold text-themeBlueLight text-center">
          Digitalise Your Savings In Digital Gold With Bright DiGi Gold
        </h1>
      </div>
    </div>
  );
};

export default AboutFoot;
