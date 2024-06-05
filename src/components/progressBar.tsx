import React, { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { decrementTimer, resetTimer } from "@/redux/actionTypes";
import { metalPrice } from "@/api/DashboardServices";
import { setGoldData, setSilverData } from "@/redux/metalSlice";
import { setLiveGoldPrice, setLiveSilverPrice } from "@/redux/cartSlice";
import { setMetalPrice } from "@/redux/shopSlice";
import NextImage from "./nextImage";
import LivePrice from '../../public/lottie/LivePrice.gif'

interface ProgressBarProps {
  purchaseType?: string;
  metalTypeForProgressBar: string;
  fromCart: boolean;
  displayMetalType: "gold" | "silver" | "both";
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  purchaseType,
  metalTypeForProgressBar,
  fromCart,
  displayMetalType,
}: ProgressBarProps) => {
  const time = useSelector((state: RootState) => state.time.time);
  const metalPricePerGram = useSelector((state: RootState) => state.shop.metalPrice);
  const goldData = useSelector((state: RootState) => state.gold);
  const silverData = useSelector((state: RootState) => state.silver);
  const dispatch = useDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const memoizedDispatch = useCallback(dispatch, []);

  console.log("progress bar",{purchaseType,
    metalTypeForProgressBar,
    fromCart,
    displayMetalType})

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
          Gold : ₹{purchaseType === "buy" ? goldData.totalPrice : goldData.salePrice}
        </span>
      );
    } else if (displayMetalType === "silver") {
      return (
        <span className="text-gray-800 text-md">
          Silver : ₹{purchaseType === "buy" ? silverData.totalPrice : silverData.salePrice}
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
  const fetchDataOfMetals = useCallback(async () => {
    try {
      const response: any = await metalPrice(); // Assuming this returns a JSON string
      const metalPriceOfGoldSilver = JSON.parse(response);
      dispatch(setGoldData(metalPriceOfGoldSilver.data.gold[0]));
      dispatch(setSilverData(metalPriceOfGoldSilver.data.silver[0]));
      dispatch(setLiveGoldPrice(metalPriceOfGoldSilver.data.gold[0].totalPrice))
      dispatch(setLiveSilverPrice(metalPriceOfGoldSilver.data.silver[0].totalPrice))
      dispatch(setMetalPrice(metalPriceOfGoldSilver.data.gold[0].totalPrice));
    } catch (error) {
      // alert(error);
    }
  }, [dispatch]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (time === 0) {
        clearInterval(intervalRef.current as unknown as number);
        intervalRef.current = null;
        fetchDataOfMetals()
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
            <NextImage src='https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/LivePrice.gif' alt="Live Price" className="inline-block" style={{ width: "30px", height: "auto" }} width={1} height={1} priority={true} />
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
