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

const TabButton = ({ tab, activeTab, handleTabClick }) => (
    <div
        onClick={() => handleTabClick(tab.tabName)}
        className={`ml-2 cursor-pointer flex items-center ${activeTab === tab.tabName ? "opacity-100 extrabold" : "opacity-50"}`}
        aria-pressed={activeTab === tab.tabName}
    >
        {tab.src && <img src={tab.src} alt={tab.alt} className="h-5 mr-2" />}
        <span className="border-r-2 border-slate-400 pr-2">{tab.tabName}</span>
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

    const toggleLoginAside = () => setOpenLoginAside(!openLoginAside);
    const handleTabClick = (tab: string) => setActiveTab(tab);


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
                <img src={"/lottie/ProductBannerNEW.jpg"} alt="gold and silver coin banner" className="rounded-b" />
            </div>
            <div className="container mx-auto">
                <div className="lg:flex flex-row mt-4 md:items-center md:justify-between p-3 rounded-md">
                    <h1 className="text-white mr-4 text-2xl sm:text-4xl extrabold">Coins</h1>
                    <div className="mb-4 md:mb-0 md:mr-4 bg-themeLight px-3 py-2 rounded-md flex items-center">
                        {Tabs.map((tab) => (
                            <TabButton key={tab.tabName} tab={tab} activeTab={activeTab} handleTabClick={setActiveTab} />
                        ))}
                    </div>
                    {isLoggedIn && (<div className="text-white mt-4 lg:mt-0 sm:divide-x sm:flex items-center bg-themeLight rounded-md px-3 p-2">
                        <div className="flex items-center">
                            <img src={"Goldbarbanner.png"} className="h-5" alt="vault" />
                            <div className="text-white ml-2 pr-4 flex">
                                <p className="text-yellow-300 extrabold mr-2">Gold :</p>
                                <p className="text-yellow-300 bold">{goldVaultBalance ? goldVaultBalance : <ButtonLoader loading={loading} buttonText={"fetching..."} />} Gm</p>
                            </div>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                            <img src={"/Silverbar.png"} className="h-5 sm:ml-4" alt="vault" />
                            <div className="ml-2 flex">
                                <p className="text-slate-200 extrabold mr-2">Silver :</p>
                                <p className="text-slate-200 bold">{silverVaultBalance ? silverVaultBalance : <ButtonLoader loading={loading} buttonText={"fetching..."} />} Gm</p>
                            </div>
                        </div>
                    </div>)}
                </div>
                {isLoading ? <Loading /> : error ? <p className="text-red-500 text-center bold text-lg">{error}</p> : (
                    <motion.div whileInView="show" viewport={{ once: false, amount: 0.25 }}>
                        <motion.div variants={fadeIn("right", "spring", 0.25, 0.25)} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 xl:gap-16 my-6">
                            {ProductList.map((item, index) => (
                                <ProductItem key={index} item={item} isLoggedIn={isLoggedIn} handleLoginClick={() => setOpenLoginAside(true)} router={router} />
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Coins;
