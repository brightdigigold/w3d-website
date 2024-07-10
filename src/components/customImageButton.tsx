"use client";
import { customImageButtonProps } from "@/types";
import Image from "next/image";
import { FaDoorClosed } from "react-icons/fa";

const CustomImageButton = ({
  handleClick,
  btnType,
  isDisabled,
  img,
}: customImageButtonProps) => {
  return (
    <button className=" w-full" disabled={isDisabled} onClick={handleClick}>
      <img src={img} className="w-full rounded-full" />
    </button>
  );
};

export default CustomImageButton;
