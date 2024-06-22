"use client";
import "./globals.css";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import mixpanel from "mixpanel-browser";
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@/components/navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/footer'), { ssr: false });

let persistor = persistStore(store);
export default function RootLayout({ children, }: { children: React.ReactNode; }) {

  useEffect(() => {
    mixpanel.init(`${process.env.MIX_PANNEL_TOKEN}`, { track_pageview: true });
  }, [])

  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preload" href="/bdgwhite.png" as="image" />
        <link rel="dns-prefetch" href="https://brightdigigold.s3.ap-south-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://nkdqpbbn.apicdn.sanity.io" />
      </head>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Navbar />
            <script async src={`https://www.googletagmanager.com/ns.html?id=${process.env.GOOGLE_TAG}`} />
            {children}
            <Footer />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
