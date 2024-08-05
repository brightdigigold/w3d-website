"use client";
import CustomCheckout from "@/components/customCheckout/customCheckout";
import NextImage from "@/components/nextImage";
import RequireAuth from "@/components/requireAuth";
import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  return (
    <RequireAuth>
      <div className="">
        <div className="min-h-screen bg-theme flex items-center justify-center">
          <NextImage
            className=" absolute -bottom-12 -left-20 opacity-30"
            src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgwhite5.webp"
            alt="digital gold"
            // priority
            width={270}
            height={270}
          />

          <CustomCheckout data={data} />
        </div>
      </div>
    </RequireAuth>
  );
};

export default page;


