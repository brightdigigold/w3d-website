"use client";
import { funcForDecrypt } from "@/components/helperFunctions";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/api/DashboardServices";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import OtpModal from "@/components/modals/otpModal";
import {
  selectGoldVaultBalance,
  selectSilverVaultBalance,
} from "@/redux/vaultSlice";
import { useRouter } from "next/navigation";
import LoginAside from "../authSection/loginAside";

const Coins = () => {
  const [ProductList, setProductList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const goldVaultBalance = useSelector(selectGoldVaultBalance);
  const silverVaultBalance = useSelector(selectSilverVaultBalance);
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);
  const router = useRouter();
  const [openLoginAside, setOpenLoginAside] = useState<boolean>(false);
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    getAllProducts("ALL");
  }, []);

  const getAllProducts = async (params: any) => {
    try {
      let url = `/public/products?limit=50&page=0`;
      if (params) {
        url = `/public/products?limit=50&page=0&metal=${params}`;
      }
      const response = await api.get(url);
      if (response.status) {
        const coins = await funcForDecrypt(response.data.payload);
        const x = JSON.parse(coins);
        setProductList(x.data);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleLoginClick = () => {
    setOpenLoginAside(!openLoginAside);
  };

  const handleTabClick = (tab: "ALL" | "GOLD" | "SILVER") => {
    setActiveTab(tab);
    getAllProducts(tab);
  };


  return (
    <div className="pb-28 xl:pb-8 pt-16">
      {openLoginAside && (
        <LoginAside
          isOpen={openLoginAside}
          onClose={() => setOpenLoginAside(false)}
        />
      )}

      {otpModal && <OtpModal />}
      <div className="flex justify-center items-center">
        <img
          src={"/lottie/ProductBannerNEW.jpg"}
          alt="gold and silver coin banner"
          className="rounded-b"
        />
      </div>
      <div className="container mx-auto">
        <div className="lg:flex flex-row md:flex-row mt-4 md:items-center md:justify-between p-3 rounded-md">
          <div className="sm:flex items-center">
            <h1 className=" text-white mr-4 text-center text-2xl sm:text-4xl extrabold">
              Coins
            </h1>
            <div className="mb-4 md:mb-0 md:mr-4 bg-themeLight px-3 py-2 rounded-md">
              <div className="text-white flex items-center bold">
                <div
                  onClick={() => {
                    handleTabClick("ALL");
                  }}
                  className={`ml-2 cursor-pointer text-lg border-r-2 border-slate-400 pr-4 bold ${activeTab === "ALL" ? "opacity-100 extrabold" : "opacity-50"
                    }`}
                >
                  All
                </div>
                <img
                  src={"Goldbarbanner.png"}
                  alt="digital gold bar"
                  className={`ml-2 h-5 cursor-pointer bold ${activeTab === "GOLD" ? "opacity-100" : "opacity-50"
                    }`}
                  onClick={() => {
                    handleTabClick("GOLD");
                  }}
                />
                <div
                  onClick={() => {
                    handleTabClick("GOLD");
                  }}
                  className={`ml-2 cursor-pointer text-lg border-r-2 border-slate-400 pr-4 bold ${activeTab === "GOLD" ? "opacity-100" : "opacity-50"
                    }`}
                >
                  Gold
                </div>
                <img
                  src={"/Silverbar.png"}
                  alt="digital silver bar"
                  className={`ml-2 h-5 cursor-pointer ${activeTab === "SILVER" ? "opacity-100" : "opacity-50"
                    }`}
                  onClick={() => {
                    handleTabClick("SILVER");
                  }}
                />
                <div
                  onClick={() => {
                    handleTabClick("SILVER");
                  }}
                  className={`ml-2 cursor-pointer text-lg ${activeTab === "SILVER" ? "opacity-100" : "opacity-50"
                    }`}
                >
                  Silver
                </div>
              </div>
            </div>
          </div>
          {isloggedIn && (<div className="text-white mt-4 lg:mt-0 sm:divide-x sm:flex items-center bg-themeLight rounded-md px-3 p-2">
            <div className="flex items-center">
              <img src={"Goldbarbanner.png"} className="h-5" alt="vault" />
              <div className="text-white ml-2 pr-4 flex">
                <p className="text-yellow-300 extrabold mr-2">Gold :</p>
                <p className="text-yellow-300 bold">{goldVaultBalance} Gm</p>
              </div>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <img src={"/Silverbar.png"} className="h-5 sm:ml-4" alt="vault" />
              <div className="ml-2 flex">
                <p className="text-slate-200 extrabold mr-2">Silver :</p>
                <p className="text-slate-200 bold">{silverVaultBalance} Gm</p>
              </div>
            </div>
          </div>)}
        </div>
        <motion.div
          // initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
        >
          <motion.div
            variants={fadeIn("right", "spring", 0.25, 0.25)}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 xl:gap-16 my-6 "
          >
            {ProductList.map((item, index) => (
              <div
                key={index}
                className="py-4 rounded-md shadow-xl text-center coins_background transition-transform transform hover:scale-105  hover:shadow-lg hover:shadow-sky-100"
              >
                <div
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "bottom",
                    backgroundImage: `url(${item.iteamtype.toLowerCase() === "gold"
                      ? "/images/goldpart.png"
                      : "/images/silverpart.png"
                      })`,
                  }}
                  className=""
                >
                  <div className="flex flex-col items-center px-2">
                    <div>
                      <Image
                        src={item.image.image}
                        alt="Bright digi gold coins"
                        width={150}
                        height={90}
                      />
                    </div>
                    <div className="mt-2 text-xs sm:text-base text-white">
                      {item.name}
                    </div>
                    <div className="text-themeBlueLight text-xs sm:text-lg items-center">
                      Making charges
                      <span className="text-base sm:text-2xl bold ml-1">
                        ₹{item.makingcharges}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (!isloggedIn) {
                          handleLoginClick();
                        } else {
                          router.push(`/coins/${item.slug}`)
                        }
                      }}
                      // href={`/coins/${item.slug}`}
                      className="my-2 bg-themeBlue rounded-2xl extrabold w-3/4 py-2 block"
                    >
                      VIEW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Coins;
