"use client";
import "./globals.css";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import mixpanel from "mixpanel-browser";
import dynamic from 'next/dynamic';
import { Poppins } from "next/font/google";
import { initializeNotiflix } from "@/utils/customNotiflix";
import InactivityHandler from "@/components/inactivityHandler";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["400", "500", "600", "700", "800"],
});

const Navbar = dynamic(() => import('@/components/navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/footer'), { ssr: false });

let persistor = persistStore(store);

export default function RootLayout({ children }) {
  useEffect(() => {
    initializeNotiflix();
    mixpanel.init(`${process.env.NEXT_PUBLIC_MIX_PANNEL_TOKEN}`, { track_pageview: true });
  }, []);

  console.log("Root Layout mix panel token", process.env.NEXT_PUBLIC_MIX_PANNEL_TOKEN);
  console.log("Root Layout google tag", process.env.NEXT_PUBLIC_GOOGLE_TAG)

  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://brightdigigold.s3.ap-south-1.amazonaws.com" />
        <link rel="preload" as="image" href="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgwhite5.webp" />
        <link rel="dns-prefetch" href="https://nkdqpbbn.apicdn.sanity.io" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://api.brightdigigold.com" />
        <link rel="preload" href="/font/NunitoSans_Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/font/Lato-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <meta name="google-site-verification" content="CRfShAmCXUTnCd9sfyEoPmBFHZvDQh2TC8UI4fZFPdw" />
        <meta property="og:title" content="Bright DiGi Gold" />
        <meta property="og:description" content="We at Bright DiGi Gold invite you to embark on a journey of effortless digital savings. In just a few clicks make your savings grow in Digital Gold and Silver.  Your gateway to hassle-free savings is here." />
        <meta property="og:image" content="https://brightdigigold.s3.ap-south-1.amazonaws.com/OG.jpg" />
        <meta property="og:url" content="https://www.brightdigigold.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bright DiGi Gold" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* <!-- Twitter Card Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="https://x.com/BrightDiGiGold" />
        <meta name="twitter:title" content="Bright DiGi Gold" />
        <meta name="twitter:description" content="We at Bright DiGi Gold invite you to embark on a journey of effortless digital savings. In just a few clicks make your savings grow in Digital Gold and Silver.  Your gateway to hassle-free savings is here." />
        <meta name="twitter:image" content="https://brightdigigold.s3.ap-south-1.amazonaws.com/OG.jpg" />
      </head>
      <body>
        <Provider store={store}>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <div className={`${poppins.className} `}>
              <Navbar />
              <InactivityHandler />
              {children}
              <Footer />
            </div>
          </PersistGate>
        </Provider>
        <script async src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG}`} />
      </body>
    </html>
  );
}
