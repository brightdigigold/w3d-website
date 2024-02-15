"use client";
import "./globals.css";
import { Footer, Navbar } from "@/components";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/redux/store";
import { Provider } from "react-redux";

let persistor = persistStore(store);
export default function RootLayout({ children, }: { children: React.ReactNode; }) {

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Navbar />
            {children}
            <Footer />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
