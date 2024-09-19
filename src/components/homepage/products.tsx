'use client'
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import LoginAside from "../authSection/loginAside";
import OtpModal from "../modals/otpModal";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { selectUser } from "@/redux/userDetailsSlice";
import SetProfileForNewUser from "../setProfile";
import { setShowProfileForm } from "@/redux/authSlice";

const Products = () => {
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);
  const [openLoginAside, setOpenLoginAside] = useState<boolean>(false);
  const router = useRouter();
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const showProfileForm = useSelector((state: RootState) => state.auth.showProfileForm);
  const devotee_isNewUser = useSelector((state: RootState) => state.auth.devotee_isNewUser);
  const isLoggedInForTempleReceipt = useSelector((state: RootState) => state.auth.isLoggedInForTempleReceipt);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    setOpenLoginAside(!openLoginAside);
  };

  const onClose = () => {
    dispatch(setShowProfileForm(false));
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

          {/* {otpModal && <OtpModal />} */}
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
              <Image
                src="/Light_21.png"
                alt="products"
                width={250}
                height={150}
                // layout="fill"
                objectFit="cover"
                className="absolute right-0"
              />
              <Image
                src="/Light_31.png"
                alt="products"
                width={250}
                height={150}
                // layout="fill"
                objectFit="cover"
                className="absolute right-0"
              />
            </div>

            <div className="text-center mx-auto mt-10">
              <Image
                src="https://d2fbpyhlah02sy.cloudfront.net/product/gold/2gm/Group+25.png"
                alt="products"
                layout="intrinsic"
                width={250}
                height={250}
                sizes="(max-width: 250px) 100vw, 250px"
                className="mx-auto"
              />
              <p className="mt-6 text-xs sm:text-base md:text-sm lg:text-md xl:text-lg text-white bold">
                5 Gram Gold Coin
              </p>
            </div>

            <button
              onClick={() => {
                if (isloggedIn) {
                  router.push(`/coins/5-Gram-Gold-Coin`);
                } else if (!isloggedIn && !isLoggedInForTempleReceipt) {
                  handleLoginClick();
                } else if (isLoggedInForTempleReceipt && devotee_isNewUser) {
                  dispatch(setShowProfileForm(true));
                } else if (!user.data.isBasicDetailsCompleted) {
                  dispatch(setShowProfileForm(true));
                }
              }}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              <p className="text-xl semibold">View</p>
            </button>
          </motion.div>

          <motion.div
            variants={fadeIn("right", "spring", 0.5, 0.5)}
            className="bg-themeLight rounded-lg shadow-xl p-4 relative hover:shadow-lg hover:shadow-gray-100 product001"
          >
            <div className="relative">
              <Image
                src="https://brightdigigold.s3.ap-south-1.amazonaws.com/Star_3.webp"
                alt="products"
                width={250}
                height={150}
                // layout="fill"
                objectFit="cover"
                className="absolute right-0"
              />
            </div>

            <div className="text-center mx-auto mt-10">
              <Image
                src="/BanyanTree1.png"
                alt="products"
                layout="intrinsic"
                width={250}
                height={250}
                sizes="(max-width: 250px) 100vw, 250px"
                className="mx-auto"
              />
              <p className="mt-6 text-xs sm:text-base md:text-sm lg:text-md xl:text-lg text-white bold">
                10 Gram Banyan Tree
              </p>
            </div>

            <button
              onClick={() => {
                if (isloggedIn) {
                  router.push(`/coins/10-Gram-Banyan-Tree-Silver-Coin`);
                } else if (!isloggedIn && !isLoggedInForTempleReceipt) {
                  handleLoginClick();
                } else if (isLoggedInForTempleReceipt && devotee_isNewUser) {
                  dispatch(setShowProfileForm(true));
                } else if (!user.data.isBasicDetailsCompleted) {
                  dispatch(setShowProfileForm(true));
                }
              }}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              <p className="text-xl semibold">View</p>
            </button>
          </motion.div>

          <motion.div
            variants={fadeIn("right", "spring", 0.75, 0.75)}
            className="bg-themeLight rounded-lg shadow-xl p-4 relative hover:shadow-lg hover:shadow-gray-100 product001"
          >
            <div className="relative">
              <Image
                src="/Light_21.png"
                alt="products"
                width={250}
                height={250}
                // layout="fill"
                objectFit="cover"
                className="absolute right-0"
              />
              <Image
                src="/Light_31.png"
                alt="products"
                width={250}
                height={150}
                // layout="fill"
                objectFit="cover"
                className="absolute right-0"
              />
            </div>

            <div className="text-center mx-auto mt-10">
              <Image
                src="https://d2fbpyhlah02sy.cloudfront.net/product/gold/2gm/Group+25.png"
                alt="products"
                layout="intrinsic"
                width={250}
                height={250}
                sizes="(max-width: 250px) 100vw, 250px"
                className="mx-auto"
              />
              <p className="mt-6 text-xs sm:text-base md:text-sm lg:text-md xl:text-lg text-white bold">
                10 Gram Gold Coin
              </p>
            </div>

            <button
              onClick={() => {
                if (isloggedIn) {
                  router.push(`/coins/10-Gram-Gold-Coin`);
                } else if (!isloggedIn && !isLoggedInForTempleReceipt) {
                  handleLoginClick();
                } else if (isLoggedInForTempleReceipt && devotee_isNewUser) {
                  dispatch(setShowProfileForm(true));
                } else if (!user.data.isBasicDetailsCompleted) {
                  dispatch(setShowProfileForm(true));
                }
              }}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              <p className="text-xl semibold">View</p>
            </button>
          </motion.div>

          <motion.div
            variants={fadeIn("right", "spring", 1.0, 1.0)}
            className="bg-themeLight rounded-lg shadow-xl p-4 relative hover:shadow-lg hover:shadow-gray-100 product001"
          >
            <div className="relative">
              <Image
                src="https://brightdigigold.s3.ap-south-1.amazonaws.com/Star_3.webp"
                alt="products"
                width={250}
                height={250}
                // layout="fill"
                objectFit="cover"
                className="absolute right-0"
              />
            </div>

            <div className="text-center mx-auto mt-10">
              <Image
                src="https://brightdigigold.s3.ap-south-1.amazonaws.com/BanyanTree.webp"
                alt="products"
                layout="intrinsic"
                width={250}
                height={250}
                sizes="(max-width: 250px) 100vw, 250px"
                className="mx-auto"
              />
              <p className="mt-6 text-xs sm:text-base md:text-sm lg:text-md xl:text-lg text-white bold">
                100 Gram Banyan Tree
              </p>
            </div>

            <button
              onClick={() => {
                if (isloggedIn) {
                  router.push(`/coins/100-Gram-Banyan-Tree-Silver-Coin`);
                } else if (!isloggedIn && !isLoggedInForTempleReceipt) {
                  handleLoginClick();
                } else if (isLoggedInForTempleReceipt && devotee_isNewUser) {
                  dispatch(setShowProfileForm(true));
                } else if (!user.data.isBasicDetailsCompleted) {
                  dispatch(setShowProfileForm(true));
                }
              }}
              className="bg-themeBlue w-full block rounded-full py-2 mt-6 text-center"
            >
              <p className="text-xl semibold">View</p>
            </button>
          </motion.div>
        </div>
      </motion.div>
      {showProfileForm && (
        <SetProfileForNewUser isOpen={showProfileForm} onClose={onClose} />
      )}
    </div>
  );
};

export default Products;
