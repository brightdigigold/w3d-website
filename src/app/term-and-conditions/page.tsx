
import TermsAndCondition from "@/components/termsAndCondition/termsAndCondition";
import { Metadata } from "next";
import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <>
      <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 pb-28 xl:pb-8 pt-32">
        <div className="container">
          <div className="row pt-5 pb-5">
            <div className=" sm:flex justify-between items-center text-center sm:text-left">
              <h1 className="text-2xl sm:text-7xl mb-4 extrabold text-white">
                Terms &<br /> Conditions
              </h1>
              <Image src="/termsAndConditions.Webp" alt="terms and conditions" width={500} height={500} />
            </div>
          </div>
        </div>
      </div>
      <TermsAndCondition />
    </>
  );
};

export default page;
export const metadata: Metadata = {
  title: "Term & Condition -  Bright DiGi Gold  ",
  description:
    " A trusted platform for buying and selling 24k digital gold and silver with its guaranteed purity.   ",
};
