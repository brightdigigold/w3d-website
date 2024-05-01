"use client";
import React, { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import OtpModal from "@/components/modals/otpModal";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import Image from "next/image";
import { selectGoldVaultBalance, selectSilverVaultBalance, selectLoading } from "@/redux/vaultSlice";
import { selectIsloggedIn, setShowProfileForm } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { selectUser } from "@/redux/userDetailsSlice";
import useFetchProductCoins from "@/hooks/useFetchProductCoins";
import LoginAside from "@/components/authSection/loginAside";
import TabButton from "@/components/coins/tabComponent";
import ButtonLoader from "@/components/buttonLoader";
import VaultBalance from "@/components/coins/vaultBalance";
import { fadeIn } from "@/utils/motion";
import ProductItem from "@/components/coins/productItem";
import SetProfileForNewUser from "@/components/setProfile";
// import { vault } from "../../../../public/images/vault.png"
import {} from "../../../../../public/images/AkshayaTritiyabanner.jpg"

const Coins = ({ params }: any) => {
    const metalTypeOf = params.akshayTrityaOffer;
    // console.log('params', metalTypeOf);
    const [activeTab, setActiveTab] = useState(metalTypeOf);
    const isLoggedIn = useSelector((state: RootState) => (state.auth.isLoggedIn))
    const otpModal = useSelector((state: RootState) => (state.auth.otpModal))
    const showProfileForm = useSelector((state: RootState) => state.auth.showProfileForm);
    const dispatch = useDispatch();
    const isloggedIn = useSelector(selectIsloggedIn);
    const user = useSelector(selectUser);

    const goldVaultBalance = useSelector(selectGoldVaultBalance);
    const silverVaultBalance = useSelector(selectSilverVaultBalance);
    const loading = useSelector(selectLoading);

    const router = useRouter();
    const [openLoginAside, setOpenLoginAside] = useState<boolean>(false);
    const { ProductList, isLoading, error } = useFetchProductCoins(activeTab);

    const Tabs = [
        // { tabName: "ALL" },
        { tabName: "GOLD", src: "/Goldbarbanner.png", alt: "digital gold bar" },
        // { tabName: "SILVER", src: "/Silverbar.png", alt: "digital silver bar" },
    ];

    const onClose = () => {
        dispatch(setShowProfileForm(false));
    };

    const loginOrSetProfileHandler = () => {

        if (!isloggedIn) {
            setOpenLoginAside(true);
            return;
        } else if (!user.data.isBasicDetailsCompleted) {
            dispatch(setShowProfileForm(true));
            return;
        }
    }

    return (
        <div className="pb-28 xl:pb-8 pt-16">
            {openLoginAside && <LoginAside isOpen={openLoginAside} onClose={() => setOpenLoginAside(false)} />}
            {otpModal && <OtpModal />}

            <div className="flex justify-center items-center">
                <Image src="/images/AkshayaTritiyabanner.jpg" alt="gold and silver coin banner" className="rounded-b" width={1600} height={300} />
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
                                <Image className="px-1 py-2 h-10 w-11" src={"../../../../public/images/vault.png"} alt="vault" height={10} width={40} />
                            </div>
                            <div className="text-yellow-600 font-bold text-xxs sm:text-base flex justify-between">
                                <div className="flex items-center">
                                    <div className="flex flex-col border-r-2 border-slate-400 pr-2">
                                        <p className="text-gray-800">GOLD</p>
                                        <p>{goldVaultBalance != null ? goldVaultBalance : <ButtonLoader loading={loading} buttonText={"fetching..."} />}Gm</p>
                                    </div>
                                </div>
                                <div className="flex items-center px-2">
                                    <div className="flex flex-col">
                                        <p className="text-gray-800">SILVER</p>
                                        <p>{silverVaultBalance != null ? silverVaultBalance : <ButtonLoader loading={loading} buttonText={"fetching..."} />}Gm</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isLoading ? <Loading /> : error ? <p className="text-red-500 text-center bold text-lg">{error}</p> : (
                    <motion.div whileInView="show" viewport={{ once: false, amount: 0.25 }}>
                        <motion.div variants={fadeIn("right", "spring", 0.25, 0.25)} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 xl:gap-16 my-6">
                            <Suspense>
                                {ProductList.slice(2, 4).map((item, index) => (
                                    <ProductItem key={index} item={item} isLoggedIn={isLoggedIn} handleLoginClick={() => loginOrSetProfileHandler()} router={router} />
                                ))}
                            </Suspense>
                        </motion.div>
                    </motion.div>
                )}

                {showProfileForm && (
                    <SetProfileForNewUser isOpen={showProfileForm} onClose={onClose} />
                )}

            </div>
        </div>
    );
};

export default Coins;