
import Cart from "@/components/cart/cartMainPage";
import RequireAuth from "@/components/requireAuth";
import { Metadata } from "next";
import React from "react";

const page = () => {
  return (
    <RequireAuth>
      <div className="pt-24 pb-36 xl:pb-0">
        <Cart />
      </div>
    </RequireAuth>
  );
};

export default page;

export const metadata: Metadata = {
  title: "Cart - Bright DiGi Gold",
  // description:
    // "Bright DiGi Gold allows you to Buy, Sell, Gift and Refer & Earn Digital Gold online conveniently and effectively.",
};
