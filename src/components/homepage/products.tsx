"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../../utils/motion";

const Products = () => {
  return (
    <div className="bg-theme">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className="mx-auto px-4 sm:px-6 lg:px-16 py-16"
      >
        <div className="flex justify-between items-center">
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

            <Link
              href={`/coins/1-Gram-Gold-Coin`}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              View
            </Link>
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

            <Link
              href={`/coins/10-Gram-Banyan-Tree-Silver-Coin`}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              View
            </Link>
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

            <Link
              href={`/coins/10-Gram-Gold-Coin`}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              View
            </Link>
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

            <Link
              href={`/coins/100-Gram-Banyan-Tree-Silver-Coin`}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              View
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Products;