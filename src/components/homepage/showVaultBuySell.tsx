import { SelectMetalType, SelectPurchaseType, selectMetalPricePerGram } from '@/redux/shopSlice';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { ParseFloat } from '../helperFunctions';
import { selectGoldVaultBalance, selectSilverVaultBalance, selectLoading } from '@/redux/vaultSlice';
import ButtonLoader from '../buttonLoader';

const ShowVaultBuySell = () => {
    const purchaseType = useSelector(SelectPurchaseType);
    const metalType = useSelector(SelectMetalType);
    const metalPricePerGram = useSelector(selectMetalPricePerGram);
    const goldVaultBalance = useSelector(selectGoldVaultBalance);
    const silverVaultBalance = useSelector(selectSilverVaultBalance);
    const loading = useSelector(selectLoading);

    const [props, set] = useSpring(() => ({
        opacity: 1,
        transform: 'translateX(0%)',
        from: {
            opacity: 0,
            transform: 'translateX(-100%)',
        },
        config: {
            duration: 2000, // 2000 milliseconds (2 seconds)
        },
        delay: 1000, // 3 seconds delay
    }));

    useEffect(() => {
        const animationProps = {
            opacity: 1,
            transform: `translateX(${purchaseType === 'sell' ? '0%' : '-100%'})`,
        };
        set(animationProps);
    }, [purchaseType, set]);


    return (
        <animated.div style={props} >
            {purchaseType === "sell" && (
                <div className="bg-themeLight001 p-0 mx-4 mt-4 justify-between rounded-lg border-1 grid grid-cols-4 sm:gap-4 items-center">
                    <div className="col-span-1 justify-center flex items-center">
                        <img src="/lottie/New Web Vault.gif" className="h-14 sm:h-20" alt="Vault animation" />
                    </div>
                    <div className="col-span-3 gap-3 flex justify-around items-center">
                        <div className="flex items-center gap-2 sm:gap-4">
                            {metalType === "gold" ? (
                                <img src="/Goldbarbanner.png" className="h-4 sm:h-6" alt="digital gold bar" />
                            ) : (
                                <img src="/Silverbar.png" className="h-4 sm:h-6" alt="digital silver bar" />
                            )}
                            <p className="text-white text-sm sm:text-lg">
                                {metalType === "gold"
                                    ? goldVaultBalance != null ? goldVaultBalance : <ButtonLoader loading={loading} buttonText={"fetching..."} />
                                    : silverVaultBalance != null ? silverVaultBalance : <ButtonLoader loading={loading} buttonText={"fetching..."} />} gm
                            </p>

                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <img src="/Green Rupees.png" className="w-8 sm:w-10 " alt="rupees" />
                            <p className="text-white text-sm sm:text-lg">
                                ₹{" "}
                                {metalType === "gold"
                                    ? `${ParseFloat(
                                        goldVaultBalance * metalPricePerGram,
                                        2
                                    )}`
                                    : `${ParseFloat(
                                        silverVaultBalance * metalPricePerGram,
                                        2
                                    )}`}{" "}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </animated.div>
    );
};

export default ShowVaultBuySell;
