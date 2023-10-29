import React,{useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import LoginAside from "../loginAside/loginAside";
import { AesDecrypt } from '../middleware';
import { useSelector } from 'react-redux';
import { doShowLoginAside,profileFilled } from '../../store/index';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { log } from "../logger";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pagePath = router.pathname;
  log('pagePath',pagePath);
  const [rewarspop,setRewarspop] = useState(false);
  const noFooter = ['/profile','/dashboard/orders','/dashboard/vault','/dashboard/reward','/dashboard/gifting','/dashboard/referearn','/mobilepolicy/refundAndCancellations','/mobilepolicy/privacyPolicy','/mobilepolicy/termsAndConditions','/mobilepolicy/shippingPolicy','/mobilepolicy/about','/payments'];
  const noHeader = ['/mobilepolicy/refundAndCancellations','/mobilepolicy/privacyPolicy','/mobilepolicy/termsAndConditions','/mobilepolicy/shippingPolicy','/mobilepolicy/about','/payments'];

  // const [showAsideMain, setShowAsideMain] = useState(false);
  
  const reduxData = useSelector((state) => {
    return state.auth
  })
  // log("reduxData : ",reduxData)
  useEffect(()=>{
    checkUserIsNew()
    rewardsPending();
  },[])
  const checkUserIsNew = async () => {
    const token = localStorage.getItem("token");

    if(token){
      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders)
        .then((response) => response.json())
        .then(async (data) => {
          // log("isUserProfileFilled in data : ", data);
          const decryptedData = await AesDecrypt(data.payload);
          const userdata = JSON.parse(decryptedData).data;
          log("userdata : ",userdata);
          if(userdata.isBasicDetailsCompleted == false){
            log("doooooooo")
            dispatch(doShowLoginAside(true));
          }else{
            dispatch(profileFilled(true));
          }
        })
        .catch((errorWhileCheckingIsUserNew) => {
          log("errorWhileCheckingIsUserNew : ",errorWhileCheckingIsUserNew);
        });
    } 
    
  };

  const redirectToRedeem = ()=>{
    setRewarspop(false)
    router.push('/dashboard/reward')
  }

  const closeReward = ()=>{
    setRewarspop(false)
  }

  const rewardsPending = async() =>{

    const token = localStorage.getItem("token");

    if(token){

    const configHeaders = {
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }

      fetch(`${process.env.baseUrl}/user/redeemation/count`, configHeaders)
      .then((response) => response.json())
      .then(async (data) => {
        log("data of upi : ", data);
        const decryptedData = await AesDecrypt(data.payload);
        log("decryptedData in upi", decryptedData);
        let decryptedDataList = JSON.parse(decryptedData).data;
        log("decryptedDataList in upi", decryptedDataList);
        if(decryptedDataList.count > 0){
          setRewarspop(true)
        }
      })
      .catch((error) => console.error(error));
    }
  }

  const redirectData = (response) => {
    // handleClick(activeTabClick,'NOTCLEAR');
  };

  //Functions
  const handleCloseAside = () => {
    dispatch(doShowLoginAside(false));
    
  };

  return (
    <>
    <div>
      {/* Add your layout components here */}
      {noHeader.indexOf(pagePath) < 0 && 
      <Header />
      }
      <main>
        {children}
      </main>
      {noFooter.indexOf(pagePath) < 0 && 
        <div className='footer_bg'>
            <Footer />
        </div>
      }
      {/* Login Popup */}
      <div className={`aside-backdrop ${reduxData.showLoginAside ? 'show' : ''}`} />
      <LoginAside
            show={reduxData.showLoginAside}
            redirectData={redirectData}
            onHide={handleCloseAside}
          />
          <style>{`
          .footer_bg{
            margin-top:0px !important;
            background:#092637;
          }
      
          `}</style>
    </div>
    {rewarspop && 
    <>
    <div className={`aside-backdrop ${rewarspop ? 'show' : ''}`} />
    <div className='rewardspop'>
        <div className='rewardscontent'>
          <div className='closeIcon'>
              <Image onClick={closeReward} src="/images/cross.png" width="20" height="20"></Image>
          </div>
          <div className='rewards'>
            <Image src="/images/pop-2up.png" width="300" height="120"></Image>
          </div>
          <div className='redeemButton' onClick={redirectToRedeem}>
            <Image src="/images/redeem.png" width="200" height="20"></Image>
          </div>
        </div>
      </div>
    </>
    }
      </>
  );
};

export default Layout;