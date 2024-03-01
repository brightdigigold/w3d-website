"use client";
import React, { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import OtpModal from "@/components/modals/otpModal";
import { useRouter } from "next/navigation";
import LoginAside from "../authSection/loginAside";
import ButtonLoader from "../buttonLoader";
import ProductItem from "./productItem";
import Loading from "@/app/loading";
import useFetchProductCoins from "./useFetchProductCoins";
import Image from "next/image";

const TabButton = ({ tab, activeTab, handleTabClick }) => (
  <div
    onClick={() => handleTabClick(tab.tabName)}
    className={` text-gray-100 cursor-pointer flex items-center ${activeTab === tab.tabName ? "opacity-100 extrabold" : "opacity-50"}`}
    aria-pressed={activeTab === tab.tabName}
  >
    <div>{tab.src && <Image src={tab.src} alt={tab.alt} className="h-4 sm:h-5 ml-1 sm:ml-2" width={28} height={30} />}</div>
    <div className={`text-sm sm:text-base ml-0 sm:ml-2  ${tab.tabName !== 'SILVER' ? "border-r-2 border-slate-400 pr-1" : ""}`}>{tab.tabName}</div>
  </div>
);

const Coins = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const { goldVaultBalance, silverVaultBalance, loading, otpModal, isLoggedIn } = useSelector((state: RootState) => ({
    goldVaultBalance: state.vault.goldVaultBalance,
    silverVaultBalance: state.vault.silverVaultBalance,
    loading: state.vault.loading,
    otpModal: state.auth.otpModal,
    isLoggedIn: state.auth.isLoggedIn,
  }));
  const router = useRouter();
  const [openLoginAside, setOpenLoginAside] = useState<boolean>(false);
  const { ProductList, isLoading, error } = useFetchProductCoins(activeTab);

  const Tabs = [
    { tabName: "ALL" },
    { tabName: "GOLD", src: "Goldbarbanner.png", alt: "digital gold bar" },
    { tabName: "SILVER", src: "Silverbar.png", alt: "digital silver bar" },
  ];

  return (
    <div className="pb-28 xl:pb-8 pt-16">
      {openLoginAside && <LoginAside isOpen={openLoginAside} onClose={() => setOpenLoginAside(false)} />}
      {otpModal && <OtpModal />}

      <div className="flex justify-center items-center">
        <Image src={"/lottie/ProductBannerNEW.jpg"} alt="gold and silver coin banner" className="rounded-b" width={1600} height={300} />
      </div>
      <div className="container mx-auto">
        <h1 className="text-white mr-4 text-2xl sm:text-4xl extrabold text-center m-3">Our Coins</h1>
        <div className="flex justify-between items-center bg-[#2C7BAC33] md:bg-transparent px-1 rounded-md">
          <div className="px-2 py-2 rounded-md md:bg-[#2C7BAC33] flex">
            {Tabs.map((tab) => (
              <TabButton key={tab.tabName} tab={tab} activeTab={activeTab} handleTabClick={setActiveTab} />
            ))}
          </div>
          <div>

            <div className="sm:hidden mt-2 mb-2 flex items-center bg-themeBlue rounded-xl h-fit py-2">
              <div>
                <Image className="px-1 py-2 h-10 w-11" src={"../../images/vault.png"} alt="vault" height={0} width={0} />
              </div>
              <div className="text-yellow-600 font-bold text-xxs sm:text-base flex justify-between">
                <div className="flex items-center">
                  <div className="flex flex-col border-r-2 border-slate-400 pr-2">
                    <p className="text-gray-800">GOLD</p>
                    <p>{goldVaultBalance}Gm</p>
                  </div>
                </div>
                <div className="flex items-center px-2">
                  <div className="flex flex-col">
                    <p className="text-gray-800">SILVER</p>
                    <p>{silverVaultBalance}Gm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block">
            {isLoggedIn && (<div className=" text-white mt-4 lg:mt-0 sm:divide-x flex items-center bg-themeLight rounded-md px-3 p-2">
              <div className="flex items-center">
                <Image src={"Goldbarbanner.png"} className="h-5" alt="vault" width={32} height={30} />
                <div className="text-white ml-1 pr-4 flex">
                  <p className="text-yellow-300 extrabold mr-2">Gold :</p>
                  <p className="text-yellow-300 bold">{goldVaultBalance ? goldVaultBalance : <ButtonLoader loading={loading} buttonText={"fetching..."} />} Gm</p>
                </div>
              </div>
              <div className="flex items-center mt-1 sm:mt-0">
                <Image src={"/Silverbar.png"} className="h-5 sm:ml-4" alt="vault" width={32} height={30} />
                <div className="ml-2 flex items-center">
                  <p className="text-slate-200 extrabold mr-2">Silver :</p>
                  <p className="text-slate-200 extrabold">{silverVaultBalance ? silverVaultBalance : <ButtonLoader loading={loading} buttonText={"fetching..."} />} Gm</p>
                </div>
              </div>
            </div>)}
          </div>
        </div>

        {isLoading ? <Loading /> : error ? <p className="text-red-500 text-center bold text-lg">{error}</p> : (
          <motion.div whileInView="show" viewport={{ once: false, amount: 0.25 }}>
            <motion.div variants={fadeIn("right", "spring", 0.25, 0.25)} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 xl:gap-16 my-6">
              <Suspense>
                {ProductList.map((item, index) => (
                  <ProductItem key={index} item={item} isLoggedIn={isLoggedIn} handleLoginClick={() => setOpenLoginAside(true)} router={router} />
                ))}
              </Suspense>
            </motion.div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Coins;