"use client";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { classNames } from "@/components";
import KycTab from "../kyc/kyc";
import PayoutOptionTab from "../payoutOptions/payoutOption";
import ProfileTab from "../profile/profile";
import AddressTab from "../address/address";
import ProfileImage from "../profile/profileImage";
import { selectUser } from "@/redux/userDetailsSlice";
import { useSelector } from "react-redux";
import {
  selectGoldVaultBalance,
  selectSilverVaultBalance,
} from "@/redux/vaultSlice";
import NextImage from "@/components/nextImage";

const data = [
  { id: 1, name: "PROFILE", img: "/24K guaranteed .png" },
  { id: 2, name: "KYC", img: "/kycprofile.png" },
  { id: 3, name: "WITHDRAW", img: "/menusell.png" },
  { id: 4, name: "ADDRESS", img: "/location.png" },
];

const MyAccountTabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const user = useSelector(selectUser);
  const goldVaultBalance = useSelector(selectGoldVaultBalance);
  const silverVaultBalance = useSelector(selectSilverVaultBalance);

  const handleCompleteKYC = () => {
    setSelectedIndex(1);
  };

  return (
    <div className="w-full relative">
      <NextImage
        className=" absolute top-0 left-0 opacity-50"
        src="/bdgwhite.png"
        width={500} height={500}
        alt="Bright Digi Gold"
      />
      <div className="mb-12 grid lg:grid-cols-2 justify-center items-center">
        <div className="sm:flex items-center">
          <ProfileImage />
          <p className="text-lg md:text-xl xl:text-4xl text-white ml-0 sm:ml-8 text-center mb-4 sm:mb-0">
            Welcome, {user?.data?.name}
          </p>
        </div>

        <div className="flex justify-center lg:justify-end items-center gap-2 sm:gap-16 text-sm sm:text-base">
          <div className="flex items-center gap-4 border-1 p-2 rounded-md sm:mb-0">
            <img src="/Goldbarbanner.png" className="h-4 sm:h-8" />
            <p className=" flex flex-col">
              <span className="font-thin text-gray-400">Gold Balance</span>
              <span className="font-bold text-xs sm:text-base text-gray-100">
                {goldVaultBalance} gm
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4 border-1 p-2 rounded-md">
            <img src="/Silverbar.png" className="h-4 sm:h-8" />
            <p className=" flex flex-col">
              <span className="font-thin text-gray-400">Silver Balance</span>
              <span className="font-bold text-xs sm:text-base text-gray-100">
                {silverVaultBalance} gm
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className=" grid lg:grid-cols-2 gap-4 z-40 relative">
        <div>
          <div>
            <p className="p-4 text-white">Personal Details</p>
          </div>
          <KycTab />
          <ProfileTab /> <AddressTab />
        </div>
        <div>
          <div>
            <p className="p-4 text-white">Withdrawal Method</p>
          </div>
          <PayoutOptionTab onCompleteKYC={handleCompleteKYC} />
        </div>
      </div>
    </div>
  );
};

export default MyAccountTabs;
