import React, { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { decrementTimer, resetTimer } from "@/redux/actionTypes";

interface ProgressBarProps {
  metalTypeForProgressBar: string;
  fromCart: boolean;
  displayMetalType: "gold" | "silver" | "both";
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  metalTypeForProgressBar,
  fromCart,
  displayMetalType,
}: ProgressBarProps) => {
  const time = useSelector((state: RootState) => state.time.time);
  const metalPricePerGram = useSelector(
    (state: RootState) => state.shop.metalPrice
  );
  const goldData = useSelector((state: RootState) => state.gold);
  const silverData = useSelector((state: RootState) => state.silver);
  const dispatch = useDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const memoizedDispatch = useCallback(dispatch, []);

  const calculateProgressBarWidth = useCallback(() => {
    const totalSeconds = 300;
    const remainingPercentage = (time / totalSeconds) * 100;
    return `${remainingPercentage}%`;
  }, [time]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const getMetalPrice = useCallback(() => {
    if (displayMetalType.toLowerCase() === "gold") {
      return (
        <span className="text-yellow-700 text-md">
          Gold : ₹{goldData.totalPrice}
        </span>
      );
    } else if (displayMetalType === "silver") {
      return (
        <span className="text-gray-800 text-md">
          Silver : ₹{silverData.totalPrice}
        </span>
      );
    } else {
      // Customize this logic based on how you want to display both metal prices
      return (
        <>
          <span className="text-yellow-700 text-md mr-1">
            Gold : ₹{goldData.totalPrice}
          </span>
          <span className="text-gray-800 text-md block sm:inline">
            {" "}
            Silver : ₹{silverData.totalPrice}
          </span>
        </>
      );
    }
  }, [displayMetalType, goldData.totalPrice, silverData.totalPrice]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (time === 0) {
        clearInterval(intervalRef.current as unknown as number);
        intervalRef.current = null;
        memoizedDispatch(resetTimer());
      } else {
        memoizedDispatch(decrementTimer());
      }
    }, 1000) as unknown as NodeJS.Timeout;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as unknown as number);
        intervalRef.current = null;
      }
    };
  }, [time, memoizedDispatch]);

  return (
    <div className="progress-bar-container">
      <div className="inner-content">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/lottie/Live Price.gif"
              className="h-7 inline-block mr-2"
              alt="Live Price"
            />
            <div className="text-black text-xs sm:text-sm font-semibold">
              {fromCart === true
                ? getMetalPrice()
                : `${displayMetalType.toUpperCase()} : ${getMetalPrice()}`}
            </div>
          </div>
        </div>
        <div className="text-black text-xs sm:text-sm font-semibold">
          Expire in {formatTime(time)}
        </div>
      </div>
      <div
        className="progress-bar"
        style={{ width: calculateProgressBarWidth() }}
      ></div>
    </div>
  );
};

export default ProgressBar;
