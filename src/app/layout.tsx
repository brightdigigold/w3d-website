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

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["400", "500", "600", "700", "800"],
});

const Navbar = dynamic(() => import('@/components/navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/footer'), { ssr: false });

let persistor = persistStore(store);

export default function RootLayout({ children }) {

  useEffect(() => {
    mixpanel.init(`${process.env.MIX_PANNEL_TOKEN}`, { track_pageview: true });

    const disableContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', disableContextMenu);

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
    };
  }, []);

  // useEffect(() => {
  //   const disableKeyShortcuts = (e) => {
  //     if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
  //       e.preventDefault();
  //     }
  //   };
  //   document.addEventListener('keydown', disableKeyShortcuts);

  //   return () => {
  //     document.removeEventListener('keydown', disableKeyShortcuts);
  //   };
  // }, []);


  return (
    <html lang="en">
      <head>

        <link rel="preload" href="/font/NunitoSans_Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/font/Lato-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgwhite5.webp" />
        <link rel="preload" as="image" href="https://brightdigigold.s3.ap-south-1.amazonaws.com/offer1.webp" />
        <link rel="dns-prefetch" href="https://brightdigigold.s3.ap-south-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://nkdqpbbn.apicdn.sanity.io" />
        <meta name="google-site-verification" content="CRfShAmCXUTnCd9sfyEoPmBFHZvDQh2TC8UI4fZFPdw" />
      </head>
      <body>
        <Provider store={store}>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <div className={`${poppins.className}`}>
              <Navbar />
              {children}
              <Footer />
            </div>
          </PersistGate>
        </Provider>
        <script async src={`https://www.googletagmanager.com/ns.html?id=${process.env.GOOGLE_TAG}`} />
      </body>
    </html>
  );
}
