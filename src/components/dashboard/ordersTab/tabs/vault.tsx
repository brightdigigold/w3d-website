import Loading from "@/app/loading";
import {
  selectError,
  selectGiftedGoldWeight,
  selectGiftedSilverWeight,
  selectGoldVaultBalance,
  selectLoading,
  selectSilverVaultBalance,
} from "@/redux/vaultSlice";
import React, { memo } from "react";
import { useSelector } from "react-redux";

const Vault = () => {
  const goldVaultBalance = useSelector(selectGoldVaultBalance);
  const giftedGoldWeight = useSelector(selectGiftedGoldWeight);
  const silverVaultBalance = useSelector(selectSilverVaultBalance);
  const giftedSilverWeight = useSelector(selectGiftedSilverWeight);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  return (
    <div className="w-full">
      {loading && <Loading />}
      {error && <p>Error: {error}</p>}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <p className=" text-white  mb-2 mt-3 md:mt-0 tracking-wider extrabold"> Vault Balance</p>
          <div className="py-2 px-4 border-1 rounded-lg bg-themeLight grid grid-cols-5 items-center text-white">
            <div className="">
              <img src="/lottie/New Web Vault.gif" className="h-14 sm:h-24" />
            </div>
            <div className="flex items-center col-span-4  justify-around">
              <div className="flex items-center gap-1">
                <img
                  src="/Goldbarbanner.png"
                  className="h-4 sm:h-8 xl:h-12 inline-block mr-2"
                />
                <div>
                  <p className=" text-sm sm:text-2xl">Gold</p>
                  <p className="text-green-500 text-sm sm:text-lg">{goldVaultBalance} gms</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <img
                  src="/Silverbar.png"
                  className="h-4 sm:h-8 xl:h-12 inline-block mr-2"
                />
                <div>
                  <p className=" text-sm sm:text-2xl"> Silver</p>
                  <p className="text-green-500 text-sm sm:text-lg">{silverVaultBalance} gms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className=" text-white mb-2 tracking-wider extrabold"> Gifted Weight</p>
          <div className="py-2 px-4 border-1 rounded-lg bg-themeLight grid grid-cols-5 items-center text-white">
            <div className=" col-span-1">
              <img src="/lottie/gift.gif" className="h-16 sm:h-24" />
            </div>
            <div className="flex items-center justify-around col-span-4">
              <div className="flex items-center gap-1">
                <img
                  src="/Goldbarbanner.png"
                  className="h-4 sm:h-8 xl:h-12 inline-block mr-2"
                />
                <div>
                  <p className=" text-sm sm:text-2xl">Gold</p>
                  <p className="text-green-500">{giftedGoldWeight} gms</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <img
                  src="/Silverbar.png"
                  className="h-4 sm:h-8 xl:h-12 inline-block mr-2"
                />
                <div>
                  <p className=" text-sm sm:text-2xl"> Silver</p>
                  <p className="text-green-500">{giftedSilverWeight} gms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Vault);
