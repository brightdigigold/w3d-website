import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-calendar/dist/Calendar.css';
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux'
// import AuthSlice from "../store/createAuthSlice"
import Loader from '@/components/loader';
// import { useDispatch } from 'react-redux';
import store from '../store/index';
import Layout from '@/components/layout';
import PageLoader from '@/components/pageloader';
import CustomHead from '@/components/CustomHead';
import LogoutTimer from '@/components/LogoutTimer';
import { log } from '@/components/logger';
import { initializeGTM } from '@/components/analytics.js';





export default function App({ Component, pageProps }) {

  // const dispatch = useDispatch();
  // useEffect(()=>{
  //   const tokenTemp = localStorage.getItem("token");
  //   
  //   if(tokenTemp){
  //     dispatch(logInUser(true));
  //   } else {
  //     dispatch(logOutUser(false));
  //   }

  // },[])

  // const [loading, setLoading] = React.useState(false);
  
  React.useEffect(() => {
    initializeGTM(); // Initialize Google Tag Manager
    // const startLoader = () => setLoading(true);
    // const stopLoader = () => setLoading(false);

    // Log pageview on route change

    // Add your loading logic here
    // For example, show the loader during page transitions or data fetching

    // Simulating a loading delay for demonstration purposes
    // startLoader();
    // setTimeout(stopLoader, 2000);
  }, []);
  return <>
    <PageLoader />
    <Provider store={store}>
      <Layout>
            <CustomHead title="Best Platform to Buy & Sell 24K Digital Gold - Bright Digi gold." />
            <Component {...pageProps} />
          {/* <LogoutTimer timeout={10} /> */}
       </Layout>
    </Provider>
    
    <style>{`
    .loader_bg {
        background: #081A24;
      }

    `}</style>
  </>
}
