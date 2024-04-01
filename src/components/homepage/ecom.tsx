"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant, } from "../../utils/motion";
import Image from "next/image";

const Ecom = () => {
  return (
    <div className="bg-themeYellow">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className="grid sm:grid-cols-2 gap-6 place-items-center"
        >
          <motion.div
            variants={fadeIn("right", "spring", 0.2, 1)}
            className=" flex items-end relative"
          >
            <Image alt="products" className="mx-auto" width={1920} height={400} src="/goldcoin.png" />
            <Image
              alt="products"
              className=" mx-auto"
              src="/BanyanTree.png"
              width={1920}
              height={400}
            />
          </motion.div>
          <div>
            <motion.h1
              variants={textVariant(1.1)}
              className=" text-right font-bold text-3xl text-gray-700"
            >
              Get Free Delivery <br />
              Pan India
            </motion.h1>
            <Link
              href="#"
              className="text-black text-sm px-6 py-3 rounded-md float-right mt-4 sm:mt-8 bg-yellow-400"
            >
              Place Order
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Ecom;
