"use client";
import "./globals.css";
import { Footer, Navbar } from "@/components";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/redux/store";
import { Provider } from "react-redux";
import Head from "next/head";
import Image from "next/image";

let persistor = persistStore(store);
export default function RootLayout({ children, }: { children: React.ReactNode; }) {

  return (
    <html lang="en">
      <Head>
        <Image src="/bdgwhite.png" alt="Picture of the author" priority />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',${process.env.GOOGLE_TAG});
            `,
          }}
        />
      </Head>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Navbar />
            {children}
            <script async src={`https://www.googletagmanager.com/ns.html?id=${process.env.GOOGLE_TAG}`} />
            <Footer />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
