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
  setPurpose,
  setShowOTPmodal,
  setShowProfileForm,
} from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { resetUserDetails, selectUser } from "@/redux/userDetailsSlice";
import LoginAside from "./authSection/loginAside";

interface SidebarAsideProps {
  isOpen: boolean;
  onClose: () => any;
}


const SidebarAside = React.memo(({ isOpen, onClose }: SidebarAsideProps) => {
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const devotee_isNewUser = useSelector((state: RootState) => state.auth.devotee_isNewUser);
  const isLoggedInForTempleReceipt = useSelector((state: RootState) => state.auth.isLoggedInForTempleReceipt);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
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

  // logoutProfile()

  const [openLoginAside, setOpenLoginAside] = useState(false);

  // const handleLoginClick = () => {
  //   if (isloggedIn) {
  //     router.push('/donation-receipt');
  //     onClose();
  //   } else if (isLoggedInForTempleReceipt && devotee_isNewUser) {
  //     dispatch(setShowProfileForm(true));
  //   } else {
  //     setOpenLoginAside(!openLoginAside);
  //   }
  // };

  const handleLoginClick = () => {
    if (isLoggedInForTempleReceipt && devotee_isNewUser) {
      dispatch(setShowProfileForm(true));
      // onClose();
    } else {
      dispatch(setPurpose('receipt'))
      setOpenLoginAside(!openLoginAside);
      // onClose();
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-3/4 loginGrad shadow-lg transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-[999]`}
    >
      {openLoginAside && (
        <LoginAside
          isOpen={openLoginAside}
          onClose={() => {
          setOpenLoginAside(false)
          onClose();
          }}
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
              />
              <p className="text-lg md:text-xl xl:text-4xl text-white ml-0 sm:ml-8 text-center mb-4 sm:mb-0">
                {user?.data?.name}
              </p>
            </div>
          </div>
          <div className="space-y-1 px-2 pb-3 ">
            {isloggedIn && (
              <Link href="/myAccount" prefetch={true}>
                <div
                  onClick={() => onClose()}
                  className={styles.p1}
                >
                  <Image src="/bankmenu.png" alt="Add Bank" width={36} height={20} className="h-5 w-9 mt-2" />
                  <p className="mt-2">Add Bank</p>
                </div>
              </Link>
            )}
            {isloggedIn && (
              <Link href="/myAccount" prefetch={true}>
                <div
                  onClick={() => onClose()}
                  className={styles.p1}
                >
                  <Image src="/locationmenu.png" alt="Add Address" width={40} height={24} className="h-6 w-10" />
                  Add Address
                </div>
              </Link>
            )}
            <Link href="/term-and-conditions" prefetch={true}>
              <div onClick={() => onClose()} className={styles.p1}>
                <Image src="/terms and conditionsmenu.png" alt="Terms of Uses" width={36} height={20} className="h-6 w-9" />
                Terms of Uses
              </div>
            </Link>
            <Link  href="/privacy-policy" prefetch={true}>
              <div onClick={() => onClose()} className={styles.p1}>
                <Image src="/Privacy Policymenu.png" alt="Privacy Policy" width={40} height={24} className="h-6 w-9" />
                Privacy Policy
              </div>
            </Link>
            <Link href="/faqs" prefetch={true}>
              <div onClick={() => onClose()} className={styles.p1}>
                <Image src="/FAQmenu.png" alt="FAQ" width={20} height={24} className="h-6 w-9" />
                FAQ
              </div>
            </Link>
            <Link href="/about-us" prefetch={true}>
              <div onClick={() => onClose()} className={styles.p1}>
                <Image src="/About us.png" alt="About Us" width={20} height={20} className="h-6 w-9" />
                About Us
              </div>
            </Link>
            <Link  href="/refund-and-cancellation" prefetch={true}>
              <div onClick={() => onClose()} className={styles.p1}>
                <Image src="/refundmenu.png" alt="Refund & Cancellation" width={20} height={20} className="h-6 w-9" />
                Refund & Cancellation
              </div>
            </Link>
            <Link  href="/shipping-policy" prefetch={true}>
              <div onClick={() => onClose()} className={styles.p1}>
                <Image src="https://brightdigigold.s3.ap-south-1.amazonaws.com/Shipping+Policy.gif" alt="Shipping Policy" width={32} height={24} className="h-6 w-9" />
                Shipping Policy
              </div>
            </Link>
            <Link href="/contact-us" prefetch={true}>
              <div onClick={() => onClose()} className={styles.p1}>
                <Image src="/images/contacts.png" alt="Contact Us" width={32} height={20} className="h-6 w-9" />
                Contact Us
              </div>
            </Link>
            <div onClick={handleLoginClick} className={styles.p1}>
              <Image src="/receipt.png" alt="Receipt" width={28} height={20} className="h-6 w-9" />
              Donation Receipt
            </div>
            <Link href="/digital-gold-blog" prefetch={true}>
              <div onClick={() => onClose()} className={styles.p1}>
                <Image src="/Blog.png" alt="Blogs" width={40} height={40} className="h-10 w-10" />
                Blogs
              </div>
            </Link>
            <div className=" absolute bottom-3  flex justify-between items-center w-full space-x-4 px-6">
              <Link  href="https://www.facebook.com/brightdigigold">
                <img
                  src="/socail1.png"
                  alt="socail1"
                  className="h-5"
                />
              </Link>
              <Link href="https://www.instagram.com/brightdigigold/">
                <img
                  src="/socail2.png"
                  alt="socail2"
                  className="h-5"
                />
              </Link>
              <Link href="https://www.linkedin.com/company/brightdigigold/mycompany/">
                <img
                  src="/socail3.png"
                  alt="socail3"
                  className="h-5"
                />
              </Link>
              <Link href="https://twitter.com/BrightDiGiGold">
                <img
                  src="/Twitter.png"
                  alt="socail3"
                  className="h-5"
                />
              </Link>
              <Link href="https://www.youtube.com/@brightdigigold">
                <img
                  src="/socail5.png"
                  alt="youtube"
                  className="h-5"
                />
              </Link>
            </div>
            {/* <div className="absolute bottom-3 w-full text-center">
              <p className="flex items-center justify-center text-white px-3 py-2">
                Made with <Image src="/heart.png" alt="heart" width={20} height={20} className="h-5" /> in India
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
});

const styles = {
  p0: "hidden xl:block text-lg semibold text-gray-100 hover:bg-gray-800 hover:text-white rounded-md px-5 py-2",
  p1: "block flex items-center gap-3 rounded-md px-2 py-2 text-sm semibold text-white",
};

export default SidebarAside;
