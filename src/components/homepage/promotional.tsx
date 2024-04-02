"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import Image from "next/image";

export default function Promotional() {
  return (
    <>
      <div className=" bg-themeBlue">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className=""
        >
          <div className="grid">
            <motion.div variants={fadeIn("right", "spring", 0.5, 1)}>
              <Image
                className="z-10 w-full"
                src="/images/svg-viewer.svg"
                alt="App Banner"
                width={1920}
                height={400}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
