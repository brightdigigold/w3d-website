import Image from 'next/image'
// import PushNotificationLayout from "@/components/PushNotificationLayout";
import React, { useEffect, useState } from 'react'
import CustomHead from '@/components/CustomHead';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Inter } from 'next/font/google'
import SellAndBuy from '@/components/sellAndBuy/sellAndBuy'
import FullScreenSlider from '@/components/fullScreenSlider/fullScreenSlider'
import UpdateMultiItemsAndFaqs from '@/components/updateMultiItemAndFaqs/updateMultiItemAndFaqs'
import Products from '@/components/OurProducts/bannerAndProducts'
import Testimonials from '@/components/testimonials/testimonials';
import PartialSlider from '@/components/partialImageSlider/partialImageSlider'
import Investment from '@/components/investment/investment'
import DownloadApplication from '@/components/downloadApplication/downloadApplication'
import { AesEncrypt, AesDecrypt } from "../components/middleware"
import axios from 'axios'
import TrustedAndSecured from '@/components/trustedAndSecured/trustedAndSecured';
import { log } from '@/components/logger';
const inter = Inter({ subsets: ['latin'] })

const Home = () => {

  const [banner, setBanner] = useState('')


  const funCall = async () => {
    let dataToBeEncryptPayload = {
      type: "buy_banner"
    }
    const resAfterEncryptData = await AesEncrypt(dataToBeEncryptPayload)
    const payloadToSend = {
      payload: resAfterEncryptData
    }
    axios.post(`${process.env.baseUrl}/data/banner/images`, payloadToSend, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async (data) => {
        const decryptedData = await AesDecrypt(data.data.payload);
        setBanner(JSON.parse(decryptedData).data)
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    funCall()
  }, [])

  return (
    <>
      <div className='background'>
      <CustomHead title="Best Platform to Buy & Sell 24K Digital Gold - Bright Digi gold." />
        <div style={{ paddingTop: "20px, overflowY: auto" }}>
          <SellAndBuy />
              <PartialSlider />
          <div className='home_bg'>
            <Products />
          </div>
          <FullScreenSlider />
          <DownloadApplication />
          <div className='home_bg'>
            <Investment />
            <TrustedAndSecured />
          </div>
          <div className='home_bg'>
            <Testimonials />
            {/* <PartialSlider /> */}
          </div>

          <UpdateMultiItemsAndFaqs />

        </div>
      </div>
      <style>{`
      {/* .background{
        background: linear-gradient(0.69deg, rgb(11, 66, 99) 0.62%, rgb(8, 26, 36) 101.27%) no-repeat fixed;
    
      } */}
      .home_bg{
        background:#092637 ;;
        background-repeat: no-repeat;
        background-size: auto;
        background-attachment: fixed;
        height: 100%;
        width: 100%;
      }
      .footer_bg{
        background: linear-gradient(0.69deg, #0B4263 0.62%, #081A24 101.27%);
      }
      `}</style>
    </>
  )
}
export default Home