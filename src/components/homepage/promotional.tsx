"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
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
              <img
                className="z-10 w-full"
                src="/Web Banner New App .png"
                alt="App Banner"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
