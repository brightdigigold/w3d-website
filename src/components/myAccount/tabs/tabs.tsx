"use client";
import { useState } from "react";
import Image from "next/image";
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

const MyAccountTabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const user = useSelector(selectUser);
  const userType = user.data.type;
  const goldVaultBalance = useSelector(selectGoldVaultBalance);
  const silverVaultBalance = useSelector(selectSilverVaultBalance);

  const handleCompleteKYC = () => {
    setSelectedIndex(1);
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-center items-center ">
        <Image
          className="absolute top-72 opacity-30 sm:pr-20"
          src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgwhite5.webp"
          width={500} height={500}
          alt="Bright Digi Gold"
        />
      </div>
      <div className="mb-12 grid lg:grid-cols-2 justify-center items-center">
        <div className="sm:flex items-center">
          <ProfileImage />
          <p className="text-lg md:text-xl xl:text-4xl text-white ml-0 sm:ml-8 text-center mb-4 sm:mb-0">
            Welcome, {user?.data?.name}
          </p>
        </div>

        <div className="flex justify-center lg:justify-end items-center gap-2 sm:gap-16 text-sm sm:text-base">
          <div className="flex items-center gap-4 border-1 p-2 rounded-md sm:mb-0">
            <img src="/Goldbarbanner.png" alt="gold banner" className="h-4 sm:h-8" />
            <p className=" flex flex-col">
              <span className="font-thin text-gray-400">Gold Balance</span>
              <span className="font-bold text-xs sm:text-base text-gray-100">
                {goldVaultBalance} gm
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4 border-1 p-2 rounded-md">
            <img src="/Silverbar.png" alt="silver banner" className="h-4 sm:h-8" />
            <p className=" flex flex-col">
              <span className="font-thin text-gray-400">Silver Balance</span>
              <span className="font-bold text-xs sm:text-base text-gray-100">
                {silverVaultBalance} gm
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 z-40 relative">
        <div>
          <p className="p-4 text-white">Personal Details</p>
          {userType !== "corporate" && (<KycTab />)}
          <ProfileTab />
          <AddressTab />
        </div>
        <div>
          <p className="p-4 text-white">Withdrawal Method</p>
          <PayoutOptionTab onCompleteKYC={handleCompleteKYC} />
        </div>
      </div>
    </div>
  );
};

export default MyAccountTabs;
