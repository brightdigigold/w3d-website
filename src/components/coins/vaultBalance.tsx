import React from 'react'
import Image from "next/image";
import ButtonLoader from "../buttonLoader";
import { useSelector } from 'react-redux';
import { selectGoldVaultBalance, selectSilverVaultBalance, selectLoading, selectError } from '@/redux/vaultSlice';

const VaultBalance = () => {
    const goldVaultBalance = useSelector(selectGoldVaultBalance);
    const silverVaultBalance = useSelector(selectSilverVaultBalance);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    return (
        <div className=" text-white mt-4 lg:mt-0 sm:divide-x flex items-center bg-themeLight rounded-md px-3 p-2">
            <div className="flex items-center">
                <Image src={"Goldbarbanner.png"} className="h-5" alt="vault" width={32} height={30} />
                <div className="text-white ml-1 pr-4 flex">
                    <p className="text-yellow-300 extrabold mr-2">Gold :</p>
                    <div className="text-yellow-300 bold flex">{goldVaultBalance != null ? <p>{goldVaultBalance}</p> : <ButtonLoader loading={loading} buttonText={"fetching..."} />} <span className='ml-0.5'>Gm</span></div>
                </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-0">
                <Image src={"/Silverbar.png"} className="h-5 sm:ml-4" alt="vault" width={32} height={30} />
                <div className="ml-2 flex items-center">
                    <p className="text-slate-200 extrabold mr-2">Silver :</p>
                    <div className="text-slate-200 extrabold text-center flex">{silverVaultBalance != null ? <p>{silverVaultBalance}</p> : <ButtonLoader loading={loading} buttonText={"fetching..."} />} <span className='ml-0.5'>Gm</span></div>
                </div>
            </div>
        </div>
    )
}

export default VaultBalance