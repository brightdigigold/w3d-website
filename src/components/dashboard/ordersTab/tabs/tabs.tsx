"use client";
import {
  AesEncrypt,
  formatString,
  funcForDecrypt,
} from "@/components/helperFunctions";
import { Tab } from "@headlessui/react";
import axios from "axios";
import { addDays, format } from "date-fns";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import OrderDetails from "./orderDetails";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaCalendarAlt } from "react-icons/fa";
import Vault from "./vault";
import { Disclosure } from "@headlessui/react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import Link from "next/link";
import { ArrowDownIcon } from "@heroicons/react/20/solid";
import {
  AiOutlineCheckCircle,
  AiOutlineQuestionCircle,
  AiFillCloseCircle,
} from "react-icons/ai";
import { fetchWalletData } from "@/redux/vaultSlice";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/legacy/image";
import { selectUser } from "@/redux/userDetailsSlice";
import TempleUtrCheck from "./templeUtrCheck";

const OrdersTabs = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userType = user.data.type;
  const [userDetails, setUserDetails] = useState("");
  const [status, setStatus] = useState("ALL");
  const [isOpen, setIsOpen] = useState(false);
  const [metalValue, setMetalValue] = useState("ALL");
  const [transactionValue, setTransactionValue] = useState("ALL");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<String>("");
  const [totalPage, setTotalPage] = useState(1);
  const [itemList, setItemList] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState("ALL");
  const [selectedTransactionStatus, setSelectedTransactionStatus] = useState("ALL");
  const [selectedMetalType, setSelectedMetalType] = useState("ALL");
  const [open, setOpen] = useState(false);
  const refOne = useRef<HTMLDivElement>(null);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(`${2023}/${1}/${1}`),
    endDate: new Date(),
    key: "selection",
  });


  const handleSelect = (ranges: any) => {
    const formattedStartDate = ranges.selection.startDate.toISOString().slice(0, 10);
    const formattedEndDate = ranges.selection.endDate.toISOString().slice(0, 10);

    setSelectionRange(ranges.selection);
    handleFilter(
      formattedEndDate,
      formattedStartDate,
      status,
      metalValue,
      transactionValue,
      page,
      size
    );
  };

  const OpenAccord = (item: any) => {
    setIsOpen(!isOpen);
  };

  // hide dropdown on ESC press
  const hideOnEscape = (e: { key: string }) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Hide dropdown on outside click
  const hideOnClickOutside = (e: any) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
    const formattedStartDate = format(selectionRange.startDate, "yyyy-MM-dd")
    const formattedEndDate = format(selectionRange.endDate, "yyyy-MM-dd")
    handleFilter(
      formattedEndDate,
      formattedStartDate,
      status,
      metalValue,
      transactionValue,
      page,
      size
    );

    const token = localStorage.getItem("token");
    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders)
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.payload);
        setUserDetails(JSON.parse(decryptedData).data);
      });
    dispatch(fetchWalletData() as any);
  }, []);

  const handleFilter = async (
    selectDate = "",
    fromDate = "",
    orderStatus = "",
    metal = "",
    transaction = "",
    page: any,
    size: any
  ) => {
    const token = localStorage.getItem("token");
    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const data = {
      to_Date: selectDate,
      from_date: fromDate,
      orderType: transaction,
      status: orderStatus,
      metal: metal,
    };
    const resAfterEncrypt = await AesEncrypt(data);

    const body = {
      payload: resAfterEncrypt,
    };
    axios
      .post(
        `${process.env.baseUrl}/user/order/history?page=${page}&limit=${size}`,
        body,
        configHeaders
      )
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.data.payload);
        let allOrders = JSON.parse(decryptedData).data.order;
        // console.log("allOrders : ", allOrders)
        setDashboardData(allOrders);
        if (allOrders.length > 0) {
          setActiveTab(allOrders[0]);
          setPage(JSON.parse(decryptedData).data.currentPage);
          setTotalPage(JSON.parse(decryptedData).data.totalPages);
          let itemList = Array.from(
            { length: JSON.parse(decryptedData).data.totalPages },
            (_, index) => index + 1
          );
          setItemList(itemList);
        } else {
          // setPage(0);
          // setSize(3);
        }
      })
      .catch((error) => console.error("errordata", error));
  };

  const handleClick = (item: any) => {
    setActiveTab(item);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedTransactionStatus(value)
    setStatus(value);
    const formattedStartDate = format(selectionRange.startDate, "yyyy-MM-dd")
    const formattedEndDate = format(selectionRange.endDate, "yyyy-MM-dd")

    handleFilter(
      formattedEndDate,
      formattedStartDate,
      e.target.value,
      metalValue,
      transactionValue,
      page,
      size
    );
  };

  const handleMetalChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedMetalType(value);
    setMetalValue(value);
    const formattedStartDate = format(selectionRange.startDate, "yyyy-MM-dd")
    const formattedEndDate = format(selectionRange.endDate, "yyyy-MM-dd")

    handleFilter(
      formattedEndDate,
      formattedStartDate,
      status,
      value,
      transactionValue,
      page,
      size
    );
  };

  const handleTransactionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedTransaction(value);
    setTransactionValue(value);
    const formattedStartDate = format(selectionRange.startDate, "yyyy-MM-dd")
    const formattedEndDate = format(selectionRange.endDate, "yyyy-MM-dd")

    handleFilter(
      formattedEndDate,
      formattedStartDate,
      status,
      metalValue,
      e.target.value,
      page,
      size
    );
  };

  const updatePage = (e: any) => {
    let moveTo = e.target.value;
    setPage(moveTo);
    const formattedStartDate = format(selectionRange.startDate, "yyyy-MM-dd")
    const formattedEndDate = format(selectionRange.endDate, "yyyy-MM-dd")

    handleFilter(
      formattedEndDate,
      formattedStartDate,
      status,
      metalValue,
      transactionValue,
      moveTo,
      size
    );
  };

  const nextPageHandler = () => {
    setPage(page + 1);
    const formattedStartDate = format(selectionRange.startDate, "yyyy-MM-dd")
    const formattedEndDate = format(selectionRange.endDate, "yyyy-MM-dd")
    handleFilter(
      formattedEndDate,
      formattedStartDate,
      status,
      metalValue,
      transactionValue,
      page + 1,
      size
    );
  };

  const prevPageHandler = () => {
    if (page > 1) {
      setPage(page - 1);
      const formattedStartDate = format(selectionRange.startDate, "yyyy-MM-dd")
      const formattedEndDate = format(selectionRange.endDate, "yyyy-MM-dd")
      handleFilter(
        formattedEndDate,
        formattedStartDate,
        status,
        metalValue,
        transactionValue,
        page - 1,
        size
      );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-12">
        <Vault />
      </div>
      {dashboardData && dashboardData.length >= 0 && (
        <div className="md:flex flex-row text-white items-center justify-between">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1">Status</p>
              <select
                name="status"
                id="status"
                className="cursor-pointer text-white rounded bg-themeDarkBlue px-3 py-2 w-full md:w-32 focus:outline-none"
                onChange={(e) => {
                  handleStatusChange(e);
                }}
                value={selectedTransactionStatus}
              >
                <option value="ALL">
                  ALL
                </option>
                <option value="PENDING" className="cursor-pointer">
                  Pending
                </option>
                <option value="CANCELLED" className="cursor-pointer">
                  Cancel
                </option>
                <option value="SUCCESS" className="cursor-pointer">
                  Success
                </option>
                <option value="FAILED" className="cursor-pointer">
                  Failed
                </option>
              </select>
            </div>
            <div>
              <p className="text-sm mb-1">Metal</p>
              <select
                name="metal"
                id="metal"
                onChange={(e) => {
                  handleMetalChange(e);
                }}
                value={selectedMetalType}
                className="cursor-pointer text-white rounded bg-themeDarkBlue  px-3 py-2 w-full md:w-32 focus:outline-none"
              >
                <option value="ALL">
                  All
                </option>
                <option value="GOLD">GOLD</option>
                <option value="SILVER">SILVER</option>
              </select>
            </div>
          </div>
          <div>
            <p className=" text-sm mb-1">Select Date</p>
            <div className=" cursor-pointer text-white rounded bg-themeDarkBlue  px-3 py-2 focus:outline-none">
              <input
                value={`${format(selectionRange.startDate, "MM/dd/yyyy")} to ${format(selectionRange.endDate, "MM/dd/yyyy")}`}
                readOnly
                className="text-white placeholder:text-gray-500 cursor-pointer bg-transparent w-52"
                onClick={() => setOpen((open) => !open)}
              />
              <FaCalendarAlt
                className="calendar-icon-to cursor-pointer float-right"
                onClick={() => setOpen((prevOpen) => !prevOpen)}
                size={26}
              />
            </div>
            <div ref={refOne}>
              {open && (
                <DateRangePicker
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                  months={1}
                  editableDateInputs={true}
                  direction="horizontal"
                  className="calendarElement text-black"
                />
              )}
            </div>
          </div>

          <div>
            <p className=" text-sm mb-1">Transaction Type</p>
            <select
              name="status"
              id="status"
              onChange={(e) => {
                handleTransactionChange(e);
              }}
              value={selectedTransaction}
              className="cursor-pointer text-white rounded bg-themeDarkBlue  px-3 py-2 w-full md:w-32 focus:outline-none"
            >
              <option value="ALL">
                All
              </option>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
              <option value="PRODUCT">COINS</option>
              {/* <option value="GIFT">GIFT</option> */}
              <option value="REWARD">REWARD</option>
            </select>
          </div>
        </div>
      )}

      <Tab.Group defaultIndex={0}>
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="col-span-5 md:col-span-5">
            {dashboardData.map((item, key) => (
              <Disclosure as="div" key={key} className="pt-6 ">
                {({ open }) => (
                  <>
                    <dt>
                      {open ? (
                        <Disclosure.Button className="faq-back w-full relative text-sm sm:text-base items-start justify-between text-left text-white rounded-t-2xl px-4 py-4">
                          <span className="text-base bold leading-7 ">
                            {/* {faq.question} */}
                            <div className="grid grid-cols-2 gap-1">
                              <div className="col-span-1 grid grid-cols-6 gap-3 items-center">
                                <div className="flex items-center justify-between col-span-2 sm:col-span-1">
                                  {/* gold coin image */}
                                  {item?.orderType === "PRODUCT" &&
                                    item?.itemType === "GOLD" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-8"
                                        src="/coin1.png"
                                      />
                                    )}
                                  {/* silver coin image */}
                                  {item?.orderType === "PRODUCT" &&
                                    item?.itemType === "SILVER" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/Rectangle.png"
                                      />
                                    )}
                                  {/* cart image */}
                                  {item?.orderType === "CART" &&
                                    item?.itemType === "MIXED" && (
                                      <Image
                                        src="/images/cart.png"
                                        alt="cart"
                                        className=""
                                        width={28}
                                        height={28}
                                      />
                                    )}
                                  {/* digital gold BUY image */}
                                  {item?.orderType === "BUY" &&
                                    item?.itemType === "GOLD" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/Goldbarbanner.png"
                                      />
                                    )}
                                  {/* digital gold SELL image */}
                                  {item?.orderType === "SELL" &&
                                    item?.itemType === "GOLD" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/note.png"
                                      />
                                    )}

                                  {/* digital silver BUY  image */}
                                  {item?.orderType === "BUY" &&
                                    item?.itemType === "SILVER" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/Silverbar.png"
                                      />
                                    )}
                                  {/* digital silver SELL  image */}
                                  {item?.orderType === "SELL" &&
                                    item?.itemType === "SILVER" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/note.png"
                                      />
                                    )}
                                  {/*reward digital silver  image */}
                                  {item?.orderType === "REWARD" &&
                                    item?.itemType === "SILVER" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/Silverbar.png"
                                      />
                                    )}
                                  {/*reward digital gold  image */}
                                  {item?.orderType === "REWARD" &&
                                    item?.itemType === "GOLD" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/Goldbarbanner.png"
                                      />
                                    )}
                                  {/*GIFT  image */}
                                  {item?.orderType === "GIFT" && (
                                    <img
                                      alt="gold-logo"
                                      className="h-6"
                                      src="/Goldbarbanner.png"
                                    />
                                  )}
                                </div>
                                <div className="text-sm sm:text-base lg:text-xl flex-col lg:flex-row justify-start items-center grid  grid-cols-4 gap-1 lg:gap-3 col-span-4 sm:col-span-5">
                                  <div className="flex flex-row col-span-4 lg:col-span-2">
                                    {item?.orderType !== "REWARD" &&
                                      item?.orderType !== "CART" && (
                                        <span className="">
                                          {formatString(item?.itemType)}
                                        </span>
                                      )}

                                    <span className="">
                                      {item?.orderType === "PRODUCT" && (
                                        <p className="ml-1">Coin</p>
                                      )}
                                      {item?.orderType === "CART" && (
                                        <p className="ml-1">Cart</p>
                                      )}
                                      {item?.orderType === "REWARD" &&
                                        "Promotional " +
                                        formatString(item?.itemType)}
                                      {item?.orderType === "BUY" && (
                                        <p className="ml-1">Purchase</p>
                                      )}
                                      {item?.orderType === "SELL" && (
                                        <p className="ml-1"> Sold</p>
                                      )}
                                      {item?.orderType === "GIFT" &&
                                        item?.rewardsType === "SEND" && (
                                          <p>Gift Sent</p>
                                        )}
                                      {item?.orderType === "GIFT" &&
                                        item?.rewardsType === "RECEIVED" && (
                                          <p className="ml-1">Gift Received</p>
                                        )}
                                    </span>
                                  </div>
                                  <div className="col-span-4 lg:col-span-1">
                                    {item?.gram ? item?.gram : item?.totalGram}{" "}
                                    gm
                                  </div>
                                  <div className="flex items-center col-span-4 lg:col-span-1">
                                    <span
                                      className={`text-xs rounded-lg  py-1  ${item?.status === "SUCCESS" ||
                                        item?.status === "COMPLETED"
                                        ? "text-green-500"
                                        : item?.status === "PENDING"
                                          ? "text-yellow-500"
                                          : item?.status === "FAILED"
                                            ? "text-red-500"
                                            : "#fff" // Default color or add another color class
                                        }`}
                                    >
                                      {item?.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-1 grid place-items-end">
                                <div className="flex gap-1 lg:gap-8 flex-col sm:flex-row justify-start items-center ">
                                  {item?.totalAmount !== 0 && (
                                    <p className="text-white bold text-sm sm:text-xl">
                                      ₹{item?.totalAmount}
                                    </p>
                                  )}

                                  {/* <p className="text-white font-extrabold text-xl">₹{item?.totalAmount}</p> */}
                                  <p className="text-xs sm:text-base">
                                    {new Date(
                                      item?.createdAt
                                    ).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                  <p className="text-xs sm:text-base">
                                    {new Date(
                                      item?.createdAt
                                    ).toLocaleTimeString("en-IN", {
                                      hour: "numeric",
                                      minute: "numeric",
                                    })}
                                  </p>
                                  <span className="ml-6 flex h-7 items-center absolute lg:static top-0 right-0">
                                    {open ? (
                                      <FaChevronCircleUp
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <FaChevronCircleDown
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </span>
                        </Disclosure.Button>
                      ) : (
                        <Disclosure.Button className="faq-back w-full relative text-sm sm:text-base items-start justify-between text-left text-white rounded-2xl px-4 py-2">
                          <span className="text-base bold leading-7 ">
                            {/* {faq.question} */}
                            <div className="grid grid-cols-2 gap-1">
                              <div className="col-span-1 grid grid-cols-6 gap-3 items-center">
                                <div className="flex items-center justify-between col-span-2 sm:col-span-1">
                                  {/* gold coin image */}
                                  {item?.orderType === "PRODUCT" &&
                                    item?.itemType === "GOLD" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-8"
                                        src="/coin1.png"
                                      />
                                    )}
                                  {/* silver coin image */}
                                  {item?.orderType === "PRODUCT" &&
                                    item?.itemType === "SILVER" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/Rectangle.png"
                                      />
                                    )}
                                  {/* digital gold BUY image */}
                                  {item?.orderType === "BUY" &&
                                    item?.itemType === "GOLD" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/Goldbarbanner.png"
                                      />
                                    )}
                                  {/* digital gold SELL image */}
                                  {item?.orderType === "SELL" &&
                                    item?.itemType === "GOLD" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/note.png"
                                      />
                                    )}
                                  {/* digital silver BUY  image */}
                                  {item?.orderType === "BUY" &&
                                    item?.itemType === "SILVER" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/Silverbar.png"
                                      />
                                    )}
                                  {/* digital silver SELL  image */}
                                  {item?.orderType === "SELL" &&
                                    item?.itemType === "SILVER" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/note.png"
                                      />
                                    )}
                                  {/*reward digital silver  image */}
                                  {item?.orderType === "REWARD" &&
                                    item?.itemType === "SILVER" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/Silverbar.png"
                                      />
                                    )}
                                  {/*reward digital gold  image */}
                                  {item?.orderType === "REWARD" &&
                                    item?.itemType === "GOLD" && (
                                      <img
                                        alt="gold-logo"
                                        className="h-6"
                                        src="/Goldbarbanner.png"
                                      />
                                    )}
                                  {/*GIFT  image */}
                                  {item?.orderType === "GIFT" && (
                                    <img
                                      alt="gold-logo"
                                      className="h-6"
                                      src="/Goldbarbanner.png"
                                    />
                                  )}
                                  {/* cart image  */}
                                  {item?.orderType === "CART" &&
                                    item?.itemType === "MIXED" && (
                                      <img
                                        src="/images/cart.png"
                                        alt="cart"
                                        className=""
                                        width={28}
                                      />
                                    )}
                                </div>
                                <div className="text-sm sm:text-base lg:text-xl flex-col lg:flex-row justify-start items-center grid  grid-cols-4 gap-1 lg:gap-3 col-span-4 sm:col-span-5">
                                  <div className="flex flex-row col-span-4 lg:col-span-2">
                                    {item?.orderType !== "REWARD" &&
                                      item?.orderType !== "CART" && (
                                        <span className="">
                                          {formatString(item?.itemType)}
                                        </span>
                                      )}

                                    {item?.orderType === "PRODUCT" && (
                                      <p className="ml-1">Coin </p>
                                    )}
                                    {item?.orderType === "CART" && (
                                      <p className="ml-1">Cart </p>
                                    )}
                                    {item?.orderType === "REWARD" &&
                                      " Promotional " +
                                      formatString(item?.itemType)}
                                    {item?.orderType === "BUY" && (
                                      <p className="ml-1">Purchase</p>
                                    )}
                                    {item?.orderType === "SELL" && (
                                      <p className="ml-1"> Sold</p>
                                    )}
                                    {item?.orderType === "GIFT" &&
                                      item?.rewardsType === "SEND" && (
                                        <p>Gift Sent</p>
                                      )}
                                    {item?.orderType === "GIFT" &&
                                      item?.rewardsType === "RECEIVED" && (
                                        <p className="ml-1">Gift Received</p>
                                      )}
                                  </div>
                                  <div className="col-span-4 lg:col-span-1">
                                    {item?.gram ? item?.gram : item?.totalGram}{" "}
                                    gm
                                  </div>
                                  <div className="flex items-center col-span-4 lg:col-span-1">
                                    <span
                                      className={`text-xs rounded-lg  py-1  ${item?.status === "SUCCESS" ||
                                        item?.status === "COMPLETED"
                                        ? "text-green-500"
                                        : item?.status === "PENDING"
                                          ? "text-yellow-500"
                                          : item?.status === "FAILED"
                                            ? "text-red-500"
                                            : "" // Default color or add another color class
                                        }`}
                                    >
                                      {item?.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-1 grid place-items-end">
                                <div className="flex gap-1 lg:gap-8 flex-col lg:flex-row justify-start items-center text-xl">
                                  {item?.totalAmount !== 0 && (
                                    <p className="text-white extrabold text-sm sm:text-xl">
                                      ₹{item?.totalAmount}
                                    </p>
                                  )}

                                  {/* <p className="text-white font-extrabold text-xl">₹{item?.totalAmount}</p> */}
                                  <p className="text-xs sm:text-base">
                                    {new Date(
                                      item?.createdAt
                                    ).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                  <p className="text-xs sm:text-base">
                                    {new Date(
                                      item?.createdAt
                                    ).toLocaleTimeString("en-IN", {
                                      hour: "numeric",
                                      minute: "numeric",
                                    })}
                                  </p>
                                  <span className="ml-6 flex h-6 items-center absolute lg:static top-0 right-0">
                                    {open ? (
                                      <FaChevronCircleUp
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <FaChevronCircleDown
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </span>
                        </Disclosure.Button>
                      )}
                    </dt>
                    <Disclosure.Panel as="dd" className="">
                      <div className="text-base leading-7 text-white rounded-b-2xl px-4 py-2 bg-orderTab">
                        {/* {answer} */}
                        <div className="">
                          <p className="text-base sm:text-xl">
                            Transaction Status
                          </p>
                          <div className="grid grid-cols-3 justify-between pb-3">
                            <div className="flex items-center col-span-2">
                              <div>
                                {item?.status === "SUCCESS" ||
                                  item?.status === "COMPLETED" ? (
                                  <AiOutlineCheckCircle
                                    className="text-green-400"
                                    size={28}
                                  />
                                ) : item?.status === "PENDING" ? (
                                  <AiOutlineQuestionCircle
                                    className="text-yellow-400"
                                    size={28}
                                  />
                                ) : (
                                  <AiFillCloseCircle
                                    className="text-red-400"
                                    size={28}
                                  />
                                )}
                              </div>
                              <div>
                                {item?.status === "SUCCESS" ||
                                  item?.status === "COMPLETED" ? (
                                  <p className="px-2 col-span-1 text-sm sm:text-base">
                                    Payment Success
                                  </p>
                                ) : item?.status === "PENDING" ? (
                                  <p className="px-2 col-span-1 text-sm sm:text-base">
                                    Payment Pending
                                  </p>
                                ) : (
                                  <p className="px-2 col-span-1 text-sm sm:text-base">
                                    Payment Failed
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm sm:text-base">
                                {new Date(item.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                              <p className="text-sm sm:text-base">
                                {new Date(item.createdAt).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="">
                            <div className="grid grid-cols-3  justify-between pb-3">
                              <div className="flex items-center col-span-2">
                                <div className="">
                                  {item?.status === "SUCCESS" ||
                                    item?.status === "COMPLETED" ? (
                                    <AiOutlineCheckCircle
                                      className="text-green-400"
                                      size={28}
                                    />
                                  ) : item?.status === "PENDING" ? (
                                    <AiOutlineQuestionCircle
                                      className="text-yellow-400"
                                      size={28}
                                    />
                                  ) : (
                                    <AiFillCloseCircle
                                      className="text-red-400"
                                      size={28}
                                    />
                                  )}
                                </div>
                                <p className="px-2 col-span-1 text-sm sm:text-base">
                                  {item?.orderType === "PRODUCT" &&
                                    formatString(item?.itemType) +
                                    " Coin Purchase"}
                                  {item?.orderType === "CART" &&
                                    "Cart Purchase"}
                                  {item?.orderType === "REWARD" &&
                                    "Promotional " +
                                    formatString(item?.itemType) +
                                    " Received"}
                                  {item?.orderType === "BUY" &&
                                    formatString(item?.itemType) + " Purchase"}
                                  {item?.orderType === "SELL" && (
                                    <p>
                                      {formatString(item?.itemType) + " Sold"}
                                    </p>
                                  )}
                                  {item?.orderType === "GIFT" &&
                                    item?.rewardsType === "SEND" &&
                                    formatString(`${item?.itemType}`) +
                                    " Gift Sent"}
                                  {item?.orderType === "GIFT" &&
                                    item?.rewardsType === "RECEIVED" &&
                                    formatString(`${item?.itemType}`) +
                                    " Gift Received"}
                                </p>
                              </div>
                              <div className=" text-right">
                                <p className="text-sm sm:text-base">
                                  {new Date(item.updatedAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                                <p className="text-sm sm:text-base">
                                  {new Date(item.updatedAt).toLocaleTimeString(
                                    "en-IN",
                                    {
                                      hour: "numeric",
                                      minute: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between ">
                              <p className="text-sm sm:text-base">Order Id</p>
                              <p className="text-sm sm:text-base">
                                {item?.order_id}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-center">
                            {item?.status == "SUCCESS" && item?.challanUrl && (
                              <Link
                                target="_blank"
                                className=""
                                href={item?.challanUrl}
                              >
                                <div className="text-center m-2 pb-3 flex justify-around">
                                  <button className="border-2 border-yellow-500 bg-theme text-gold01 py-2 px-4 rounded-2xl mt-4 flex items-center">
                                    Download Challan
                                    <ArrowDownIcon className="h-5 ml-2 text-gold01" />
                                  </button>
                                </div>
                              </Link>
                            )}
                            {item?.status == "SUCCESS" && item?.invoiceUrl && (
                              <Link
                                target="_blank"
                                className=""
                                href={item?.invoiceUrl}
                              >
                                <div className="text-center m-2 pb-3 flex justify-around">
                                  <button className="border-2 border-yellow-500 bg-theme  text-gold01 py-2 px-4 rounded-2xl mt-4 flex items-center">
                                    Download Invoice
                                    <ArrowDownIcon className="h-5 ml-2 text-gold01" />
                                  </button>
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
            {dashboardData && dashboardData.length > 0 && (
              <div className="grid grid-cols-3 justify-between items-center bg-themeLight p-4 rounded-xl text-white mt-5">
                <p>Current Page</p>
                <div className="flex justify-end sm:justify-center col-span-2 sm:col-span-1">
                  <select
                    className="cursor-pointer text-white focus:outline-none bg-themeLight px-4 py-1 rounded"
                    onChange={updatePage}
                    value={page}
                  >
                    {itemList.map((number, index) => (
                      <option key={index} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center sm:justify-end col-span-3 sm:col-span-1 mt-2 sm:mt-0">
                  {page > 1 && (
                    <button
                      className="bg-themeLight px-2 py-1 rounded mr-2"
                      onClick={prevPageHandler}
                    >
                      Prev
                    </button>
                  )}
                  {page < totalPage && (
                    <button
                      className="bg-themeLight px-2 py-1 rounded"
                      onClick={(event: any) => {
                        event.preventDefault();
                        nextPageHandler();
                      }}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* <Tab.Panels className="col-span-5 md:col-span-3">
            <div className="text-white">
              <OrderDetails orderDetails={activeTab} />
            </div>
          </Tab.Panels> */}
        </div>
      </Tab.Group>
      {/* if not data to show */}
      {dashboardData && dashboardData.length === 0 && (
        <>
          <div className="text-center text-4xl text-white bg-themeLight py-24 rounded-lg">
            <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/No+Transaction.gif" className="h-40 mx-auto" />
            <p> No Data Found</p>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersTabs;
