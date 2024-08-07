"use client";
import CustomCheckout from "@/components/customCheckout/customCheckout";
import RequireAuth from "@/components/requireAuth";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const page = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  return (
    <RequireAuth>
      <div className="">
        <div className="min-h-screen bg-theme flex items-center justify-center">
          <Image
            className=" absolute  opacity-10"
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


