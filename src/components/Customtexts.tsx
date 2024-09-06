"use client";

import { motion } from "framer-motion";

// import styles from '../styles';
import { textContainer, textVariant2 } from "../utils/motion";

export const TypingText = (title: any) => (
  <motion.p
    variants={textContainer}
    className={`extrabold text-[14px] text-secondary-white`}
  >
    {Array.from(title).map((Letter: any, index: any) => (
      <motion.span variants={textVariant2} key={index}>
        {Letter === " " ? "\u00A0" : Letter}
      </motion.span>
    ))}
  </motion.p>
);

export const TypingTextservice = (title: any) => (
  <motion.p
    variants={textContainer}
    className={`font-normal text-[24px] text-secondary-white`}
  >
    {Array.from(title).map((Letter: any, index: any) => (
      <motion.span variants={textVariant2} key={index}>
        {Letter === "" ? "\u00A0" : Letter}
      </motion.span>
    ))}
  </motion.p>
);

export const TitleText = (title: any, textStyles: any) => (
  <motion.h2
    variants={textVariant2}
    initial="hidden"
    whileInView="show"
    className={`mt-[8px] bold md:text-[44px] text-[16px] text-white`}
  >
    {title}
  </motion.h2>
);
