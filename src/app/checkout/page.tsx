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
      <div className="mt-20">
        <div className="min-h-screen bg-theme flex items-center justify-center">
          <NextImage
            className=" absolute -bottom-12 -left-20 opacity-30"
            src="/bdgwhite.png"
            alt="digital gold"
            // priority
            width={400} 
            height={300} 
          />

          <CustomCheckout data={data} />
        </div>
      </div>
    </RequireAuth>
  );
};

export default page;


