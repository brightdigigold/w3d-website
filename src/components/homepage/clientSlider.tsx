"use client";
import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function ClientSlider() {
  return (
    <>
      <div className="bg-white relative">
        <div className="">
          <div className="mx-auto px-4 sm:px-6 lg:px-16 py-8">
            <h1 className="text-center extrabold  text-3xl sm:text-5xl text-gray-700 mb-8">
              We Are Trusted By
            </h1>

            <div className="grid grid-cols-4 gap-2 sm:gap-12  place-items-center">
              <img
                src="/client1.png"
                className="my-2 px-0 sm:px-4 mx-auto"
                alt="insite"
              />
              <img src="/client2.png" className="my-2 mx-auto" alt="insite" />
              <img src="/client4.png" className="my-2  mx-auto" alt="insite" />
              <img src="/client5.png" className="my-2 mx-auto" alt="insite" />
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-12  mt-2 place-items-center">
              <img
                src="/client6.png"
                className="my-2 px-2 sm:px-8 mx-auto"
                alt="insite"
              />
              <img
                src="/client7.png"
                className="my-2 px-2 sm:px-2 mx-auto"
                alt="insite"
              />
              <img
                src="/client8.png"
                className="my-2 px-2 sm:px-8 mx-auto"
                alt="insite"
              />
              <img
                src="/client9.png"
                className="my-2 px-2 sm:px-8 mx-auto"
                alt="insite"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
