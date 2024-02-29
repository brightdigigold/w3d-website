
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
  title: "Add To Cart - Bright DiGi Gold",
  description: "Discover a quick way to buy gold and silver coins with Bright DiGi Gold’s add to cart feature. ",
};
