"use client";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../../utils/motion";
import LoginAside from "../authSection/loginAside";
import OtpModal from "../modals/otpModal";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Products = () => {
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);
  const [openLoginAside, setOpenLoginAside] = useState<boolean>(false);
  const router = useRouter();
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const handleLoginClick = () => {
    setOpenLoginAside(!openLoginAside);
  };

  return (
    <div className="bg-theme">

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className="mx-auto px-4 sm:px-6 lg:px-16 py-16"
      >

        <div className="flex justify-between items-center">
          {openLoginAside && (
            <LoginAside
              isOpen={openLoginAside}
              onClose={() => setOpenLoginAside(false)}
            />
          )}

          {otpModal && <OtpModal />}
          <h1 className="text-white text-3xl sm:text-5xl extrabold">
            Our Coins
          </h1>
          <Link
            href="/coins"
            className="bg-themeLight px-3 py-1 text-md text-white rounded border border-gray-500"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <motion.div
            variants={fadeIn("right", "spring", 0.25, 0.25)}
            className="bg-themeLight rounded-lg shadow-xl p-4 relative hover:shadow-lg hover:shadow-gray-100 product001"
          >
            <div className="relative">

              <img
                alt="products"
                className=" absolute right-0"
                src="/Light_2.png"
              />
              <img
                alt="products"
                className=" absolute right-0"
                src="/Light_3.png"
              />

            </div>

            <div className="">
              <img
                alt="products"
                className="h-28 sm:h-40 mx-auto mt-10"
                src="/goldcoin.png"
              />
            </div>
            <p className="mt-6 text-center font-bold text-xs sm:text-base text-white">
              1 Gram Gold Coin
            </p>

            <button
              onClick={() => {
                if (!isloggedIn) {
                  handleLoginClick();
                } else {
                  router.push(`/coins/1-Gram-Gold-Coin`)
                }
              }}
              // href={`/coins/1-Gram-Gold-Coin`}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              View
            </button>
          </motion.div>
          <motion.div
            variants={fadeIn("right", "spring", 0.5, 0.5)}
            className="bg-themeLight rounded-lg shadow-xl p-4 relative hover:shadow-lg hover:shadow-gray-100 product001"
          >
            <div className="relative">
              {/* <img
                alt="products"
                className=" absolute left-0"
                src="/Star_1.png"
              /> */}
              <img
                alt="products"
                className=" absolute right-0"
                src="/Star_3.png"
              />
              <img
                alt="products"
                className=" absolute right-0"
                src="/Star_4.png"
              />
            </div>

            <div className="">
              <img
                alt="products"
                className="h-28 sm:h-40 mx-auto mt-10"
                src="/BanyanTree.png"
              />
            </div>
            <p className="mt-6 text-center font-bold text-xs sm:text-base text-white">
              10 Gram banyan Tree
            </p>

            <button onClick={() => {
              if (!isloggedIn) {
                handleLoginClick();
              } else {
                router.push(`/coins/10-Gram-Banyan-Tree-Silver-Coin`)
              }
            }}
              // href={`/coins/10-Gram-Banyan-Tree-Silver-Coin`}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              View
            </button>
          </motion.div>

          <motion.div
            variants={fadeIn("right", "spring", 0.75, 0.75)}
            className="bg-themeLight rounded-lg shadow-xl p-4 relative hover:shadow-lg hover:shadow-gray-100 product001"
          >
            <div className="relative">

              <img
                alt="products"
                className=" absolute right-0"
                src="/Light_2.png"
              />
              <img
                alt="products"
                className=" absolute right-0"
                src="/Light_3.png"
              />

            </div>

            <div className="">
              <img
                alt="products"
                className="h-28 sm:h-40 mx-auto mt-10"
                src="/goldcoin.png"
              />
            </div>
            <p className="mt-6 text-center font-bold text-xs sm:text-base text-white">
              10 Gram Gold Coin
            </p>

            <button onClick={() => {
              if (!isloggedIn) {
                handleLoginClick();
              } else {
                router.push(`/coins/10-Gram-Gold-Coin`)
              }
            }}
              // href={`/coins/10-Gram-Gold-Coin`}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              View
            </button>
          </motion.div>
          <motion.div
            variants={fadeIn("right", "spring", 1.0, 1.0)}
            className="bg-themeLight rounded-lg shadow-xl p-4 relative hover:shadow-lg hover:shadow-gray-100 product001"
          >
            <div className="relative">
              {/* <img
                alt="products"
                className=" absolute left-0"
                src="/Star_1.png"
              /> */}
              <img
                alt="products"
                className=" absolute right-0"
                src="/Star_3.png"
              />
              <img
                alt="products"
                className=" absolute right-0"
                src="/Star_4.png"
              />
            </div>

            <div className="">
              <img
                alt="products"
                className="h-28 sm:h-40 mx-auto mt-10"
                src="/BanyanTree.png"
              />
            </div>
            <p className="mt-6 text-center font-bold text-xs sm:text-base text-white">
              100 Gram banyan Tree
            </p>

            <button onClick={() => {
              if (!isloggedIn) {
                handleLoginClick();
              } else {
                router.push(`/coins/100-Gram-Banyan-Tree-Silver-Coin`)
              }
            }}
              // href={`/coins/100-Gram-Banyan-Tree-Silver-Coin`}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              View
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Products;