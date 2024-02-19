"use client";
import CustomCheckout from "@/components/customCheckout/customCheckout";
import RequireAuth from "@/components/requireAuth";
import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  return (
    <RequireAuth>
      <div className="mt-20">
        <div className="min-h-screen bg-theme flex items-center justify-center">
          <img
            className="h-7xl absolute -bottom-12 -left-20 opacity-30"
            src="/bdgwhite.png" // Fallback for browsers that do not support srcset
            srcSet="/bdgwhite_small.png 480w,
          /bdgwhite_medium.png 800w,
          /bdgwhite_large.png 1200w"
            sizes="(max-width: 480px) 480px,
         (max-width: 800px) 800px,
         1200px"
            alt="digital gold"
          />
          <CustomCheckout data={data} />
        </div>
      </div>
    </RequireAuth>
  );
};

export default page;


