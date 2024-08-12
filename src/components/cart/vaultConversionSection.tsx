import React from 'react';
import CustomButton from '../customButton';

const VaultConversionSection = ({ goldVaultBalance, silverVaultBalance, setMetalTypeToConvert, openConvertMetalModalHandler }) => (
    <>
        <div className="flex flex-col bg-themeLight sm:flex-row justify-between sm:justify-around items-center p-4">
            <div>
                <p className="text-semibold text-xl mb-3 sm:mb-0">
                    Convert From Vault
                </p>
            </div>
            <div>
                <div className="flex items-center bg-themeBlue rounded-xl p-2">
                    <div>
                        <img
                            src={"../../images/vault.png"}
                            alt="digital gold bar"
                            className={`sm:px-1 py-1 sm:py-2 h-10 sm:h-16 cursor-pointer`}
                        />
                    </div>
                    <div className="grid grid-cols-2 justify-between">
                        <div className="px-2 border-r-2 border-gray-400">
                            <div className="text-sm sm:text-lg bold text-black">
                                GOLD
                            </div>
                            <div className="text-yellow-600 bold text-xs sm:text-lg">
                                {goldVaultBalance} gms
                            </div>
                        </div>
                        <div className="px-4">
                            <div className="text-sm sm:text-lg bold text-black">
                                SILVER
                            </div>
                            <div className="text-yellow-600 bold text-xs sm:text-lg">
                                {silverVaultBalance} gms
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-themeLight flex flex-row justify-around items-center pt-3 pb-5 border-b-2 rounded-lg border-yellow-600">
            <div
                onClick={() => {
                    setMetalTypeToConvert("GOLD");
                    openConvertMetalModalHandler('GOLD');
                }}
                className="flex border-2 border-yellow-400 rounded-full p-3 items-center cursor-pointer"
            >
                <img src="/Goldbarbanner.png" className="h-5" style={{ width: "auto" }} alt="vault" />
                <CustomButton title="GOLD" containerStyles="px-3" />
            </div>

            <div
                onClick={() => {
                    setMetalTypeToConvert("SILVER");
                    openConvertMetalModalHandler('SILVER');
                }}
                className="flex border-2 border-yellow-400 rounded-full p-3 items-center cursor-pointer"
            >
                <img src={"Silverbar.png"} className="h-5" style={{ width: "auto" }} alt="vault" />
                <CustomButton title="SILVER" containerStyles="px-3" />
            </div>
        </div>
    </>
);

export default VaultConversionSection;
