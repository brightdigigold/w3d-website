"use client";
import React from 'react'
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const AutosavebannerMobile = () => {
  const userType = useSelector((state: RootState) => state.auth.UserType);

  return (
    <>
        {userType == "corporate" ? <>
        </> :
        <div className='bg-[#C8E9F2] mx-auto sm:hidden'>
        <div className='  w-2/3 mx-auto'>

          <img
            src="/images/homeappbanner.png"
            alt="gold and silver coin banner"
            className="mx-auto pt-5"
          />
        </div>

        <div className="grid place-items-center mt-8 fade-in-up">
          <div className="text-black text-center pt-1 poppins-bold ">
            <h1 className="text-3xl">
              AUTOMATE YOUR
            </h1>
          </div>
          <h4 className="text-black text-center pt-1 poppins-semibold text-2xl">
            GOLD SAVINGS
          </h4>
          <img
            src="/images/dwm.png"
            alt="gold and silver coin banner"
            className="mx-auto pt-5 h-40 w-25"
          />
        </div>

        <img
          src="/images/abhinav.png"
          alt="gold and silver coin banner"
          className="rounded-b  mx-auto mt-8"
        />
      </div>}
    </>


  )
}

export default AutosavebannerMobile
