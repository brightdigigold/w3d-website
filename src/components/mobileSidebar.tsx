"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  setIsLoggedIn,
  setIsLoggedInForTempleReceipt,
  setShowOTPmodal,
  setShowProfileForm,
} from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { resetUserDetails, selectUser } from "@/redux/userDetailsSlice";
import LoginAside from "./authSection/loginAside";
// import { resetUserDetails } from "@/redux/userDetailsSlice";

interface SidebarAsideProps {
  isOpen: boolean;
  onClose: () => any;
}

const SidebarAside = ({ isOpen, onClose }: SidebarAsideProps) => {
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef(null);
  const devotee_isNewUser = useSelector((state: RootState) => state.auth.devotee_isNewUser);
  const isLoggedInForTempleReceipt = useSelector((state: RootState) => state.auth.isLoggedInForTempleReceipt);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);


  const logoutProfile = () => {
    localStorage.removeItem("mobile_number");
    localStorage.removeItem("token");
    localStorage.removeItem("isLogIn");
    dispatch(setShowOTPmodal(false));
    dispatch(setIsLoggedInForTempleReceipt(false));
    dispatch(setIsLoggedIn(false));
    dispatch(setShowProfileForm(false));
    dispatch(resetUserDetails());
    router.push("/");
  };

  // logoutProfile();

  const [openLoginAside, setOpenLoginAside] = useState(false);

  const handleLoginClick = () => {
    if (isloggedIn) {
      router.push('/downloadReceipt');
      onClose();
    }
    else if (isLoggedInForTempleReceipt && devotee_isNewUser) {
      dispatch(setShowProfileForm(true));
    } else {
      setOpenLoginAside(!openLoginAside);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-2/3 loginGrad shadow-lg transform overflow-scroll translate-x-${isOpen ? "0" : "full"
        } transition-transform ease-in-out z-[999]`}
    >
      {openLoginAside && (
        <LoginAside
          isOpen={openLoginAside}
          onClose={() => setOpenLoginAside(false)}
          purpose="receipt"
        />
      )}
      <div className="grid h-screen w-full">
        <div className="w-full">
          <button
            onClick={onClose}
            className="absolute top-3 end-2.5 text-white hover:text-gold01 text-xl cursor-pointer"
          >
            <FaTimes className="text-themeBlueLight" />
          </button>
          <div className=" bg-themeDarkBlue flex justify-center pt-6">
            <div className="sm:flex items-center bg-themeDarkBlue">
              <Image
                key={user?.data?.profile_image}
                src={
                  user?.data?.profile_image
                    ? user?.data?.profile_image
                    : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                }
                alt="profile image"
                width={150}
                height={150}
                className="my-4 rounded-full mx-auto h-40 w-40 flex items-center justify-center border-2 border-sky-200"
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
              <p className="text-lg md:text-xl xl:text-4xl text-white ml-0 sm:ml-8 text-center mb-4 sm:mb-0">
                {user?.data?.name}
              </p>
            </div>
          </div>
          <div className="space-y-1 px-2 pb-3 ">
            {/* <Link href="/">
              <div onClick={onClose} className={styles.p1}>
                <IoMdHome size={28} className="text-blue-400" />
                Home
              </div>
            </Link> */}

            {/* {isloggedIn && (
              <Link href="/myAccount">
                <div
                  onClick={() => {
                    onClose();
                  }}
                  className={styles.p1}
                >
                  <img src="/menusell.png" className="h-5" /> Withdraw
                </div>
              </Link>
            )} */}
            {isloggedIn && (
              <Link href="/myAccount" prefetch={true}>
                <div
                  onClick={() => {
                    onClose();
                  }}
                  className={styles.p1}
                >
                  <img src="/bankmenu.png" className="h-5" /> Add Bank
                </div>
              </Link>
            )}
            {isloggedIn && (
              <Link href="/myAccount" prefetch={true}>
                <div
                  onClick={() => {
                    onClose();
                  }}
                  className={styles.p1}
                >
                  <img src="/locationmenu.png" className="h-5" />
                  Add Address
                </div>
              </Link>
            )}

            <Link target="_blank" href="/term-and-conditions" prefetch={true}>
              <div
                onClick={() => {
                  onClose();
                }}
                className={styles.p1}
              >
                <img src="/terms and conditionsmenu.png" className="h-5" />{" "}
                Terms of Uses
              </div>
            </Link>

            <Link target="_blank" href="/privacy-policy" prefetch={true}>
              <div
                onClick={() => {
                  onClose();
                }}
                className={styles.p1}
              >
                <img src="/Privacy Policymenu.png" className="h-5" />
                Privacy Policy
              </div>
            </Link>

            <Link href="/faqs" prefetch={true}>
              <div
                onClick={() => {
                  onClose();
                }}
                className={styles.p1}
              >
                <img src="/FAQmenu.png" className="h-5" /> FAQ
              </div>
            </Link>

            <Link href="/about" prefetch={true}>
              <div
                onClick={() => {
                  onClose();
                }}
                className={styles.p1}
              >
                <img src="/About us.png" className="h-5" /> About Us
              </div>
            </Link>

            <Link target="_blank" href="/refund-and-cancellation" prefetch={true}>
              <div
                onClick={() => {
                  onClose();
                }}
                className={styles.p1}
              >
                <img src="/refundmenu.png" className="h-5" /> Refund &
                Cancellation
              </div>
            </Link>

            <Link target="_blank" href="/shipping-policy" prefetch={true}>
              <div
                onClick={() => {
                  onClose();
                }}
                className={styles.p1}
              >
                <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/Shipping+Policy.gif" className="h-6 w-8" />
                Shipping Policy
              </div>
            </Link>

            <Link href="/contact" prefetch={true}>
              <div
                onClick={() => {
                  onClose();
                }}
                className={styles.p1}
              >
                <img src="/images/contacts.png" className="h-5 w-8" />

                Contact Us
              </div>
            </Link>

            {/* <Link href="/#" prefetch={true}> */}
            <div
              onClick={handleLoginClick}
              className={styles.p1}
            >
              <img src="/images/contacts.png" className="h-5 w-8" />

              Receipt
            </div>
            {/* </Link> */}

            <Link href="/blog" prefetch={true}>
              <div
                onClick={() => {
                  onClose();
                }}
                className={styles.p1}
              >
                <img src="/Blog.png" className="h-12 w-10" />
                Blogs
              </div>
            </Link>

            <div className=" absolute bottom-3">
              <p className=" flex items-center justify-center text-white px-3 py-2">
                Made with <img src="/heart.png" className="h-5" /> in India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const styles = {
  p0: "hidden xl:block text-lg  font-semibold text-gray-100 hover:bg-gray-800 hover:text-white rounded-md px-5 py-2",
  p1: "block flex items-center gap-3 rounded-md px-3 py-2 text-sm  font-semibold text-white",
};
export default SidebarAside;
