
import { Metadata } from "next";
import React from "react";
import PrivacyPolicy from "@/components/privacyPolicy/privacyPolicy";
import Image from "next/image";

const page = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 pb-28 xl:pb-8 pt-32">
      <div className="container">
        <div className="row pt-5 pb-5">
          <div className="sm:flex justify-between items-center text-center sm:text-left">
            <h1 className="text-2xl sm:text-7xl mb-4 extrabold text-white text-center">
              Privacy Policy
            </h1>
            <Image src="https://brightdigigold.s3.ap-south-1.amazonaws.com/PrivacyPolicy.webp" alt="privacy policy image" className="" width={500} height={500} />
          </div>
        </div>
      </div>
      <PrivacyPolicy />
    </div>
  );
};

export default page;


export const metadata: Metadata = {
  title: "Privacy Policy- Bright DiGi  Gold   ",
  description:
    "Discover Bright DiGi Gold complete privacy policy, with guaranteed safeguarding your privacy and data with utmost care.",
};
