"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RedirectTimer: React.FC = () => {
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      router.push("/dashboard");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return <p className="text-blue-200">Redirecting to dashboard in {remainingTime} seconds...</p>;
};

export default RedirectTimer;
