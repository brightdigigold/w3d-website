
import React from "react";
import { Metadata } from "next";
import ShippingPolicy from "@/components/shippingPolicy/shippingPolicy";
import Image from "next/image";

const page = () => {
  return (
    <>
      <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 pb-28 xl:pb-8 pt-32">
        <div className="container">
          <div className="row pt-2 pb-5">
            <div className=" sm:flex justify-between items-center text-center sm:text-left">
              <h1 className="text-2xl sm:text-7xl mb-4 extrabold text-white">
                Shipping Policy
              </h1>
              <Image src="/ShippingPolicy.Webp" alt="shiping policy image" className="" width={500} height={500} />
            </div>
          </div>
        </div>
      </div>
      <ShippingPolicy />
    </>
  );
};

export default page;
export const metadata: Metadata = {
  title: "Shipping Policy-  Bright DiGi Gold  ",
  description:
    "The Bright DiGi Gold Coin will be delivered to the customer's doorstep within 12 working days.",
};
