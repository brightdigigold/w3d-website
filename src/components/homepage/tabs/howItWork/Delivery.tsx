import React, { FC, Fragment } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../../../utils/motion";
import Image from "next/image";

const DeliveryTab: FC<{}> = () => {
  return (
    <Fragment>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-8 mont-font relative">
          <motion.div
            variants={fadeIn("right", "spring", 0.25, 0.25)}
            className="hidden sm:block absolute top-72 sm:top-14 left-[-6%] sm:left-28 md:left-36 lg:left-44 xl:left-56 w-4/6"
          >
            <img
              src="/line.png"
              alt="gold price in india"
              className="h-12 rotate-90 sm:rotate-0 min-w-[440px] sm:min-w-full sm:w-full hidden"
            />
          </motion.div>

          {/* Step 1 */}
          <motion.div variants={fadeIn("right", "spring", 0.2, 0.25)}>
            <p className="text-dark-blue text-md sm:text-lg font-bold text-center my-2">
              Step 1
            </p>
            <div className="mx-auto flex justify-center">
              <div className="z-10 my-2 bg-theme p-4 rounded-full shadow-2xl h-16 w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 xl:h-22 xl:w-22 2xl:h-32 2xl:w-32 flex justify-center items-center">
                <Image
                  src="/delivery01.png"
                  alt="sell digital gold online"
                  layout="intrinsic"
                  width={128}
                  height={128}
                />
              </div>
            </div>
            <p className="text-center font-extrabold text-lg sm:text-xl my-2">
              Select Coin
            </p>
            <p className="text-center text-sm sm:text-lg my-2 px-4">
              Select the coin you wish to purchase.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={fadeIn("right", "spring", 0.5, 1.25)}>
            <p className="text-dark-blue text-md sm:text-lg font-bold text-center my-2">
              Step 2
            </p>
            <div className="mx-auto flex justify-center">
              <div className="z-10 my-2 bg-theme p-4 rounded-full shadow-2xl h-16 w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 xl:h-22 xl:w-22 2xl:h-32 2xl:w-32 flex justify-center items-center">
                <Image
                  src="/sell01.png"
                  alt="24k gold price in india"
                  layout="intrinsic"
                  width={80}
                  height={80}
                />
              </div>
            </div>
            <p className="text-center font-extrabold text-lg sm:text-xl my-2">
              Enter Address
            </p>
            <p className="text-center text-sm sm:text-lg my-2 px-4">
              Enter your Address details.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={fadeIn("right", "spring", 0.75, 1.25)}>
            <p className="text-dark-blue text-md sm:text-lg font-bold text-center my-2">
              Step 3
            </p>
            <div className="mx-auto flex justify-center">
              <div className="z-10 my-2 bg-theme p-4 rounded-full shadow-2xl h-16 w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 xl:h-22 xl:w-22 2xl:h-32 2xl:w-32 flex justify-center items-center">
                <Image
                  src="/delivery031.png"
                  alt="24k gold price"
                  layout="intrinsic"
                  width={40}
                  height={70}
                />
              </div>
            </div>
            <p className="text-center font-extrabold text-lg sm:text-xl my-2">
              Order Placed
            </p>
            <p className="text-center text-sm sm:text-lg my-2 px-4">
              Hurray! Your order has been placed successfully.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </Fragment>
  );
};

export default DeliveryTab;
