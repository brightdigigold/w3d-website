"use client";
import { RootState } from "@/redux/store";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import LoginAside from "./authSection/loginAside";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Footer = () => {
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isLoggedInForTempleReceipt = useSelector((state: RootState) => state.auth.isLoggedInForTempleReceipt);
  const [activeLink, setActiveLink] = useState('home');
  const [openLoginAside, setOpenLoginAside] = useState(false);
  const router = useRouter();

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const handleLoginClick = () => {
    if (!isloggedIn && !isLoggedInForTempleReceipt) {
      setOpenLoginAside(!openLoginAside);
    } else {
      router.push('/donation-receipt');
    }
  };

  return (
    <div className="bottom-0">
      {openLoginAside && (
        <LoginAside
          isOpen={openLoginAside}
          onClose={() => setOpenLoginAside(false)}
          purpose="receipt"
        />
      )}
      {isloggedIn ? (
        <>
          <div className="fixed bottom-0 loginGrad p-2 grid grid-cols-4 w-full z-[40] py-3 border-t xl:hidden">
            <div className=" flex justify-center">
              <Link href="/" className="text-white text-sm" onClick={() => handleLinkClick('home')}>
                <img
                  src={activeLink === 'home' ? "/images/homeNav.png" : "/images/homeNav_alt.png"}
                  className="h-7 mx-auto"
                  alt="Home"
                />
                Home
              </Link>
            </div>
            <div className=" flex justify-center">
              <Link href="/dashboard" className="text-white text-sm" onClick={() => handleLinkClick('dashboard')}>
                <img
                  src={activeLink === 'dashboard' ? "/images/investment.png" : "/images/investment _active.png"}
                  className="h-7 mx-auto"
                  alt="Dashboard"
                />
                Transactions
              </Link>
            </div>
            <div className=" flex justify-center">
              <Link href="/coins" className=" text-white text-sm" onClick={() => handleLinkClick('coins')}>
                <img alt="product pic" src={activeLink === 'coins' ? "/images/products.png" : "/images/products_alt.png"} className="h-7 mx-auto " />
                Products
              </Link>
            </div>

            <div className=" flex justify-center">
              <Link href="/myAccount" className=" text-white text-sm" onClick={() => handleLinkClick('myAccount')}>
                <img alt="user icon" src={activeLink === 'myAccount' ? "/images/profile.png" : "/images/profilealt.png"} className="h-7 mx-auto " />
                Profile
              </Link>
            </div>
          </div>
          <div className="bg-header hidden xl:block ">
            <div className="">
              <div className="mx-auto px-4 sm:px-6 lg:px-16 py-8">
                <div className="grid grid-cols-4 gap-4 lg:gap-4">
                  <div className="mx-auto md:mx-0 w-full lg:pr-4 xl:pr-4 col-span-4 md:col-span-2 lg:col-span-1">
                    <div className=" grid grid-cols-8 gap-6 md:gap-0 place-items-end">
                      <Link href="/" className="col-span-5 md:col-span-8">
                        <Image
                          src="/goldenlogo.png"
                          alt="gold-logo"
                          layout="responsive"
                          width={833}
                          height={512}
                          className="w-full px-8 sm:px-4 md:px-10 lg:px-4"
                        />
                      </Link>
                      {/* <Link className="col-span-5 md:col-span-8" href="/">
                        <img
                          alt="gold-logo"
                          className=" w-full px-8 sm:px-4 md:px-10 lg:px-4"
                          src="/goldenlogo.png"
                        />
                      </Link> */}
                      <div className="col-span-3 md:col-span-8 md:flex gap-8 md:gap-4 justify-around lg:justify-between mx-0 sm:mx-4 md:mt-10 relative">
                        <Link
                          href="https://play.google.com/store/apps/details?id=com.brightdigigold.customer"
                          className="cursor-pointer"
                        >
                          <Image
                            src="https://brightdigigold.s3.ap-south-1.amazonaws.com/google-play-button.png"
                            alt="google play button"
                            width={536}
                            height={166}
                            priority
                            sizes="(max-width: 536px) 100vw, 536px"
                          />
                        </Link>
                        <Link
                          href="https://apps.apple.com/in/app/bright-digi-gold-buy-24k-gold/id1640972173"
                          className="cursor-pointer"
                        >
                          <Image
                            src="https://brightdigigold.s3.ap-south-1.amazonaws.com/app-store-button+(2).png"
                            alt="app store button"
                            width={536}
                            height={166}
                            priority
                            sizes="(max-width: 536px) 100vw, 536px"
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="w-full sm:px-4">
                      <ul className="mt-8 flex gap-1 justify-between">
                        <li className="mb-8">
                          <Link target="_blank" href="https://www.facebook.com/brightdigigold">
                            <img
                              src="/socail1.png"
                              alt="facebook"
                              className="h-6"
                            />
                          </Link>
                        </li>
                        <li className="mb-8">
                          <Link target="_blank" href="https://www.instagram.com/brightdigigold/">
                            <img
                              src="/socail2.png"
                              alt="instagram"
                              className="h-6"
                            />
                          </Link>
                        </li>
                        <li className="mb-8">
                          <Link target="_blank" href="https://www.linkedin.com/company/brightdigigold/mycompany/">
                            <img
                              src="/socail3.png"
                              alt="linkedin"
                              className="h-6"
                            />
                          </Link>
                        </li>
                        <li className="mb-8">
                          <Link target="_blank" href="https://twitter.com/BrightDiGiGold">
                            <img
                              src="/Twitter.png"
                              alt="twitter"
                              className="h-6"
                            />
                          </Link>
                        </li>
                        <li className="mb-8">
                          <Link target="_blank" href="https://www.youtube.com/@brightdigigold">
                            <img
                              src="/socail5.png"
                              alt="youtube"
                              className="h-6"
                            />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <ul className="mt-6 col-span-2 md:col-span-1 lg:pl-20 xl:pl-20">
                    <li className="mb-4">
                      <Link className="text-white" href="/">
                        Home
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link className="text-white" href="/about-us">
                        About Us
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link className="text-white" href="/coins">
                        Coins
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link className="text-white" href="/faqs">
                        FAQs
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        className="text-white"
                        href="/digital-gold-blog"
                      >
                        Blogs
                      </Link>
                    </li>
                    <li className="mb-4">
                      <div
                        onClick={handleLoginClick}
                      >
                        <Link
                          className="text-white"
                          href="#"
                        >
                          Donation Receipt
                        </Link>
                      </div>
                    </li>
                  </ul>
                  <ul className="mt-6 col-span-2 md:col-span-1">
                    <li className="mb-4">
                      <Link className="text-white" href="/contact-us">
                        Contact Us
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link className="text-white" href="/term-and-conditions">
                        Terms of Uses
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link className="text-white" href="/privacy-policy">
                        Privacy Policy
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link className="text-white" href="/shipping-policy">
                        Shipping Policy
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        className="text-white"
                        href="/refund-and-cancellation"
                      >
                        Refunds Policy
                      </Link>
                    </li>
                  </ul>
                  <div className="grid gap-4 w-full mt-0 md:mt-6 col-span-4 lg:col-span-1">
                    <ul className="gap-y-2">
                      <li className="flex mb-4 lg:mb-4 items-center">
                        <MapPinIcon className="h-6 w-8 md:w-8 lg:w-12 text-white mr-4" />
                        <p className="text-white text-sm sm:text-sm xl:text-lg">
                          501, 5th Floor, World Trade Center, Babar Road, New
                          Delhi - 110001
                        </p>
                      </li>
                      <li className="flex mb-4 lg:mb-4 items-center">
                        <PhoneIcon className="h-6 text-white mr-4" />
                        <p className="text-white text-sm sm:text-sm xl:text-lg">
                          <Link href='tel: 9289480033'>
                            +91 92894 80033
                          </Link>
                        </p>
                      </li>
                      <li className="flex mb-4 sm:mb-4 items-center">
                        <EnvelopeIcon className="h-6 text-white mr-4" />
                        <p className="text-white text-sm sm:text-sm xl:text-lg">
                          <Link href='mailto: support@brightdigigold.com'>
                            support@brightdigigold.com
                          </Link>
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-header ">
          <div className="">
            <div className="mx-auto px-4 sm:px-6 lg:px-16 py-8">
              <div className="grid grid-cols-4 gap-4 lg:gap-4">
                <div className="mx-auto md:mx-0 w-full lg:pr-4 xl:pr-4 col-span-4 md:col-span-2 lg:col-span-1">
                  <div className=" grid grid-cols-8 gap-6 md:gap-0 place-items-end">
                    <Link className="col-span-5 md:col-span-8" href="/">
                      <img
                        alt="gold-logo"
                        className=" w-full px-8 sm:px-4 md:px-10 lg:px-4"
                        src="/goldenlogo.png"
                      />
                    </Link>
                    <div className="col-span-3 md:col-span-8 md:flex gap-8 md:gap-4 justify-around lg:justify-between mx-0 sm:mx-4 md:mt-10 relative">
                      <Link
                        href="https://play.google.com/store/apps/details?id=com.brightdigigold.customer"
                        className="cursor-pointer"
                      >
                        <img
                          src="https://brightdigigold.s3.ap-south-1.amazonaws.com/google-play-button.png"
                          className="pb-4 md:pb-0"
                          alt="google play button"
                        />
                      </Link>
                      <Link
                        href="https://apps.apple.com/in/app/bright-digi-gold-buy-24k-gold/id1640972173"
                        className="cursor-pointer"
                      >
                        <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/app-store-button+(2).png" className="" alt="app store pic" />
                      </Link>
                    </div>
                  </div>
                  <div className="w-full sm:px-4">
                    <ul className="mt-8 flex gap-1 justify-between">
                      <li className="mb-8">
                        <Link target="_blank" href="https://www.facebook.com/brightdigigold">
                          <img
                            src="/socail1.png"
                            alt="socail1"
                            className="h-6"
                          />
                        </Link>
                      </li>
                      <li className="mb-8">
                        <Link target="_blank" href="https://www.instagram.com/brightdigigold/">
                          <img
                            src="/socail2.png"
                            alt="socail2"
                            className="h-6"
                          />
                        </Link>
                      </li>
                      <li className="mb-8">
                        <Link target="_blank" href="https://www.linkedin.com/company/brightdigigold/mycompany/">
                          <img
                            src="/socail3.png"
                            alt="socail3"
                            className="h-6"
                          />
                        </Link>
                      </li>
                      <li className="mb-8">
                        <Link target="_blank" href="https://twitter.com/BrightDiGiGold">
                          <img
                            src="/Twitter.png"
                            alt="socail3"
                            className="h-6"
                          />
                        </Link>
                      </li>
                      <li className="mb-8">
                        <Link href="#">
                          <img
                            src="/socail5.png"
                            alt="socail4"
                            className="h-6"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <ul className="mt-6 col-span-2 md:col-span-1 lg:pl-20 xl:pl-20">
                  <li className="mb-4">
                    <Link className="text-white" href="/">
                      Home
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link className="text-white" href="/about-us">
                      About Us
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link className="text-white" href="/coins">
                      Coins
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link className="text-white" href="/faqs">
                      FAQs
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      className="text-white"
                      href="/digital-gold-blog"
                    >
                      Blogs
                    </Link>
                  </li>
                  <li className="mb-4">
                    <div
                      onClick={handleLoginClick}
                    >
                      <Link
                        className="text-white"
                        href="#"
                      >
                        Donation Receipt
                      </Link>
                    </div>
                  </li>
                </ul>
                <ul className="mt-6 col-span-2 md:col-span-1">
                  <li className="mb-4">
                    <Link className="text-white" href="/contact-us">
                      Contact Us
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link className="text-white" href="/term-and-conditions">
                      Terms of Uses
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link className="text-white" href="/privacy-policy">
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link className="text-white" href="/shipping-policy">
                      Shipping Policy
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      className="text-white"
                      href="/refund-and-cancellation"
                    >
                      Refunds Policy
                    </Link>
                  </li>
                </ul>
                <div className="grid gap-4 w-full mt-0 md:mt-6 col-span-4 lg:col-span-1">
                  <ul className="gap-y-2">
                    <li className="flex mb-4 lg:mb-4 items-center">
                      <MapPinIcon className="h-6 w-8 md:w-8 lg:w-12 text-white mr-4" />
                      <p className="text-white text-sm sm:text-sm xl:text-lg">
                        501, 5th Floor, World Trade Center, Babar Road, New Delhi
                        - 110001
                      </p>
                    </li>
                    <li className="flex mb-4 lg:mb-4 items-center">
                      <PhoneIcon className="h-6 text-white mr-4" />
                      <p className="text-white text-sm sm:text-sm xl:text-lg">
                        <Link href='tel: 9289480033'>
                          +91 92894 80033
                        </Link>
                      </p>
                    </li>
                    <li className="flex mb-4 sm:mb-4 items-center">
                      <EnvelopeIcon className="h-6 text-white mr-4" />
                      <p className="text-white text-sm sm:text-sm xl:text-lg">
                        <Link href='mailto: support@brightdigigold.com'>
                          support@brightdigigold.com
                        </Link>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
