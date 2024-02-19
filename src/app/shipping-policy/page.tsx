
import React from "react";
import { Metadata } from "next";
import ShippingPolicy from "@/components/shippingPolicy/shippingPolicy";

const page = () => {
  return (
   <ShippingPolicy/>
  );
};

export default page;
export const metadata: Metadata = {
  title: "Shipping Policy -  Bright DiGi Gold  ",
  description:
    "The Bright DiGi Gold Coin will be delivered to the customer’s doorstep within 12 working days.",
};
