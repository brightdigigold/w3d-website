import React from 'react'
import Image from "next/image";
import ButtonLoader from "../buttonLoader";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const VaultBalance = () => {

    const { goldVaultBalance, silverVaultBalance, loading } = useSelector((state: RootState) => ({
        goldVaultBalance: state.vault.goldVaultBalance,
        silverVaultBalance: state.vault.silverVaultBalance,
        loading: state.vault.loading,
    }));

    return (
        <div className=" text-white mt-4 lg:mt-0 sm:divide-x flex items-center bg-themeLight rounded-md px-3 p-2">
            <div className="flex items-center">
                <Image src={"Goldbarbanner.png"} className="h-5" alt="vault" width={32} height={30} />
                <div className="text-white ml-1 pr-4 flex">
                    <p className="text-yellow-300 extrabold mr-2">Gold :</p>
                    <p className="text-yellow-300 bold">{goldVaultBalance != null ? goldVaultBalance : <ButtonLoader loading={loading} buttonText={"fetching..."} />} Gm</p>
                </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-0">
                <Image src={"/Silverbar.png"} className="h-5 sm:ml-4" alt="vault" width={32} height={30} />
                <div className="ml-2 flex items-center">
                    <p className="text-slate-200 extrabold mr-2">Silver :</p>
                    <p className="text-slate-200 extrabold">{silverVaultBalance != null ? silverVaultBalance : <ButtonLoader loading={loading} buttonText={"fetching..."} />} Gm</p>
                </div>
            </div>
        </div>
    )
}

export default VaultBalance