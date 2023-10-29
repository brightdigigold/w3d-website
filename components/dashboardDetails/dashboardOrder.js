import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Nav } from "react-bootstrap";
import Image from "next/image";
import style from "./dashboardDetails.module.css";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import Header from "@/components/header/header";
import { AesDecrypt, AesEncrypt } from "../../components/middleware";
import axios from "axios";
import Orders from "./order";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { format, startOfMonth, startOfYear, subYears } from "date-fns";
import { log } from "../logger";
const DashboardOrder = (props) => {
  //

  // const firstDashboardData = props?.dashboardData?.[0];
  // if (firstDashboardData) {
  //     let item = {
  //         _id: firstDashboardData._id,
  //     }
  //
  // }
  // const dashboardData = props?.dashboardData;

  // Get the current date
const currentDate = new Date();
const financialYearStartMonth = 3; // 0-indexed (0 = January, 1 = February, ..., 3 = April)
// Calculate the last financial year start date

  const orderSectionRef = useRef(null);

const currentYear = currentDate.getFullYear();
const lastFinancialYearStart = subYears(startOfYear(currentDate), 1);
lastFinancialYearStart.setMonth(financialYearStartMonth);

  const [dashboardData, setDashboardData] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [showToDate, setShowToDate] = useState(null);
  const [showFromDate, setShowFromDate] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [status, setStatus] = useState("ALL");
  const [transactionValue, setTransactionValue] = useState("ALL");
  const [metalValue, setMetalValue] = useState("ALL");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [screenWidth, setScreenWidth] = useState(null);
  const [range, setRange] = useState([
    {
      startDate:'',
      endDate:'',
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [size, setSize] = useState(9);
  const [pagination, setPagination] = useState(0);
  const refOne = useRef(null);
  const [itemList, setItemList] = useState([]);

  // hide dropdown on ESC press
  const hideOnEscape = (e) => {
    //
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Hide on outside click
  const hideOnClickOutside = (e) => {
    //
    //
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };
  const updateCalender = (item) => {
    setRange([item.selection]);
    log(`page & size updateCalender ${page} : ${size} : ${format(item.selection.endDate, "yyyy-MM-dd")}
    ${format(item.selection.startDate, "yyyy-MM-dd")}`)
    handleFilter(
      format(item.selection.endDate, "yyyy-MM-dd"),
      format(item.selection.startDate, "yyyy-MM-dd"),
      status,
      metalValue,
      transactionValue,
      page,
      size
    );
  };

  const handleClick = (item) => {
    setActiveTab(item);
    if (orderSectionRef.current) {
      orderSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [userDetails, setUserDetails] = useState("");
  const funcForDecrypt = async (dataToBeDecrypt) => {
    const response = await AesDecrypt(dataToBeDecrypt);
    return response;
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    handleFilter(
      range[0].endDate?format(range[0].endDate, "yyyy-MM-dd"):'',
      range[0].startDate?format(range[0].startDate, "yyyy-MM-dd"):'',
      e.target.value,
      metalValue,
      transactionValue,
      page,
      size
    );
  };
  const handleMetalChange = (e) => {
    setMetalValue(e.target.value);
    handleFilter(
      range[0].endDate?format(range[0].endDate, "yyyy-MM-dd"):'',
      range[0].startDate?format(range[0].startDate, "yyyy-MM-dd"):'',
      status,
      e.target.value,
      transactionValue,
      page,
      size
    );
  };

  const handleTransactionChange = (e) => {
    setTransactionValue(e.target.value);
    handleFilter(
      range[0].endDate?format(range[0].endDate, "yyyy-MM-dd"):'',
      range[0].startDate?format(range[0].startDate, "yyyy-MM-dd"):'',
      status,
      metalValue,
      e.target.value,
      page,
      size
    );
  };
  const handleFilter = async (
    selectDate = null,
    fromDate = null,
    orderStatus = null,
    metal = null,
    transaction = null,
    page,
    size
  ) => {
    const token = localStorage.getItem("token");
    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    log(`page =${page} : size=${size} selectDate = ${selectDate} : fromDate = ${fromDate} : transaction = ${transaction} : orderStatus = ${orderStatus} : metal = ${metal} `)

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
      .post(`${process.env.baseUrl}/user/order/history?page=${page}&limit=${size}`, body, configHeaders)
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.data.payload);
        log('orders',JSON.parse(decryptedData).data);
        let allOrders = JSON.parse(decryptedData).data.order;
        log("allOrders : ",allOrders)
        setDashboardData(allOrders);
        if (allOrders.length > 0) {
          setActiveTab(allOrders[0]);
          setPage(JSON.parse(decryptedData).data.currentPage)
          setTotalPage(JSON.parse(decryptedData).data.totalPages)
          let itemList = Array.from({ length: JSON.parse(decryptedData).data.totalPages }, (_, index) => index + 1);
          setItemList(itemList);

        } else {
          setPage(0);
          // setSize(3);
        }
      })
      .catch((error) => console.error("errordata", error));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
    // Function to update the screenWidth state when the window is resized
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add an event listener for the 'resize' event
    window.addEventListener('resize', handleResize);

     // Initial screen width value
      setScreenWidth(window.innerWidth);


    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
    handleFilter(
      range[0].endDate?format(range[0].endDate, "yyyy-MM-dd"):'',
      range[0].startDate?format(range[0].startDate, "yyyy-MM-dd"):'',
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
  }, [toggle]);

  const handleSelect = (date) => {

    var dateFromBeFormat = new Date(date.selection.startDate);
    const formattedFromDate = `${dateFromBeFormat.getFullYear()}-${
      dateFromBeFormat.getMonth() + 1
    }-${dateFromBeFormat.getDate()}`;

    var dateToBeFormat = new Date(date.selection.endDate);
    const formattedToDate = `${dateToBeFormat.getFullYear()}-${
      dateToBeFormat.getMonth() + 1
    }-${dateToBeFormat.getDate()}`;

    setSelectedToDate(formattedToDate);
    setSelectedFromDate(formattedFromDate);
    handleFilter(formattedToDate, formattedFromDate, status);
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);

    // setProducts(filtered);
  };

  //   const selectionRange = {
  //     startDate: startDate,
  //     endDate: endDate,
  //     key: "selection",
  //   };

  const updatePage = (e)=>{
    let moveTo = e.target.value;
    setPage(moveTo);
    handleFilter(range[0].endDate?format(range[0].endDate, "yyyy-MM-dd"):'',range[0].startDate?format(range[0].startDate, "yyyy-MM-dd"):'',status,metalValue,transactionValue,moveTo,size);
  }
  
  const nextPageHandler = () =>{
    log("nextPageHandler : ", page + 1);
    setPage(page+1);
    handleFilter(range[0].endDate?format(range[0].endDate, "yyyy-MM-dd"):'',range[0].startDate?format(range[0].startDate, "yyyy-MM-dd"):'',status,metalValue,transactionValue,page + 1,size);
  }
  const prevPageHandler = () =>{
    if(page > 1) {
      log("nextPageHandler : ", page - 1);
      setPage(page-1);
      handleFilter(range[0].endDate?format(range[0].endDate, "yyyy-MM-dd"):'',range[0].startDate?format(range[0].startDate, "yyyy-MM-dd"):'',status,metalValue,transactionValue,page-1,size);
    }
  }
  const sizeHandler = (e) =>{
    log("sizeHandler e.target.value : ",e.target.value);
    setSize(e.target.value);
    handleFilter(range[0].endDate?format(range[0].endDate, "yyyy-MM-dd"):'',range[0].startDate?format(range[0].startDate, "yyyy-MM-dd"):'',status,metalValue,transactionValue,page,e.target.value);
  }
  return (
    <div>
      <div className={style.dashboard_bg}>
        <div className="container dashboard_orders">
          <div className="row">
            <div className="col-12 col-md-12">
              <div className={style.filter}>
                <div className={style.status}>
                  <label className={style.fromTo}>Status</label>
                  <select
                    name="status"
                    id="status"
                    onChange={handleStatusChange}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="ALL" selected={true}>
                      All
                    </option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancel</option>
                    <option value="SUCCESS">Success</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <div className={style.status}>
                  <label className={style.fromTo}>Metal</label>
                  <select
                    name="metal"
                    id="metal"
                    onChange={handleMetalChange}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="ALL" selected={true}>
                      All
                    </option>
                    <option value="GOLD">GOLD</option>
                    <option value="SILVER">SILVER</option>
                  </select>
                </div>
                <div className={style.datepicker}>
                  <div className={style.datepickerInput}>
                    <div
                      className={style.date_from}
                      onClick={() => setOpen((open) => !open)}
                    >
                      <label className={style.fromTo}>From</label>
                      <input
                        type="text"
                        value={`${range[0].startDate?format(range[0].startDate, "yyyy-MM-dd"):''}`}
                        readOnly
                      />
                      <FaCalendarAlt className="calendar-icon-to" />
                    </div>
                    <div
                      className={style.date_from}
                      onClick={() => setOpen((open) => !open)}
                    >
                      <label className={style.fromTo}>To</label>
                      <input
                        type="text"
                        value={`${range[0].endDate?format(range[0].endDate, "yyyy-MM-dd"):''}`}
                        readOnly
                      />
                      <FaCalendarAlt className="calendar-icon-to" />
                    </div>
                  </div>
                  <div className={style.calender}>
                    <div ref={refOne}>
                      {open && (
                        <DateRange
                          onChange={(item) => updateCalender(item)}
                          editableDateInputs={true}
                          moveRangeOnFirstSelection={false}
                          ranges={range}
                          months={1}
                          direction="horizontal"
                          className="calendarElement"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className={style.status}>
                  <label className={style.fromTo}>Transaction Type</label>
                  <select
                    name="status"
                    id="status"
                    onChange={handleTransactionChange}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="ALL" selected={true}>
                      All
                    </option>
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                    <option value="PRODUCT">COINS</option>
                    <option value="GIFT">GIFT</option>
                    <option value="REWARD">REWARD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {dashboardData.length == 0 ? (
            <>
              <div className="d-flex justify-content-center align-items-center noOrder">
                <div style={{ textAlign: "center" }}> No Orders Found</div>
              </div>
            </>
          ) : (
            <>
              <div className="row">
                <div className="col-md-4 col-12">
                  {dashboardData.length > 0 &&
                    dashboardData?.map((item, key) => {
                      //
                      return (
                        <>
                          <ul className="" key={key}>
                            <li
                              className={`${
                                activeTab._id === item._id ? "active" : "inactive"
                              }`}
                            >
                              <div
                                className="nav-link"
                                onClick={() => handleClick(item)}
                              >
                                <div className={style.dashboard}>
                                  <div className={style.dashboard_img_text}>
                                    <div className="">
                                      <Image
                                        src={
                                          item.itemType == "GOLD"
                                            ? "/images/goldBars.png"
                                            : "/images/silverBars.png"
                                        }
                                        height={25}
                                        width={25}
                                        alt="dashboard"
                                      />
                                    </div>
                                    <div className={style.dashboard_text}>
                                      {item?.orderType == 'PRODUCT'?item.itemType+' COIN':item?.orderType == 'REWARD'?'PROMOTIONAL '+item.itemType:'DIGITAL '+item.itemType}
                                      {item.totalAmount > 0 ?` ₹(${item.totalAmount})`:''}
                                    </div>
                                  </div>
                                  <div className={style.orders}>
                                    {item.status == "PENDING" ? (
                                      <div className={style.order_status}>
                                        Pending
                                      </div>
                                    ) : item.status == "CANCELLED" ? (
                                      <div
                                        className={style.order_status_Cancel}
                                      >
                                        Cancelled
                                      </div>
                                    ) : item.status == "SUCCESS" ? (
                                      <div
                                        className={style.order_status_Completed}
                                      >
                                        Completed
                                      </div>
                                    ) : item.status == "FAILED" ? (
                                      <div
                                        className={style.order_status_Cancel}
                                      >
                                        Failed
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    <div>
                                      {" "}
                                      {activeTab && screenWidth < 720 && activeTab._id == item._id ?
                                      <IoIosArrowDown
                                        style={{ color: "#fff" }}
                                      /> : <IoIosArrowForward
                                        style={{ color: "#fff" }}
                                      />
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {activeTab && screenWidth < 720 && activeTab._id == item._id &&
                                <div className="mt-3" ref={orderSectionRef}>
                                  <Orders orderDetails={activeTab} />
                                </div>
                              }
                            </li>
                          </ul>
                        </>
                      );
                    })}
                </div>
                {screenWidth >=720 &&
                <div className="col-md-8 col-12">
                  {activeTab && 
                            <Orders orderDetails={activeTab} />
                  }

                </div>
                }
                  <div className="col-12 col-md-4 mb-4">
                    <div className={style.pagination_orders}>
                      <div className={style.currentpage}>Current Page </div>
                      <div className={style.movetopage}>
                        <select className="form-control" onChange={updatePage} value={page}>
                        {
                        itemList.map((number, index) => (
                          <option key={index} value={number}>{number}</option>
                        ))}
                        </select>
                      </div>
                      <div className={style.order_pagination}>
                          {page > 1 && <div onClick={prevPageHandler}>Prev</div>}
                          {/* <div>{page}</div> */}
                          {page < totalPage && <div onClick={nextPageHandler}>Next</div>}
                      </div>
                    </div>
                  </div>
              </div> 
            </>
          )}
        </div>
      </div>

      <style>{`
            body{
              background: linear-gradient(0.69deg, #0B4263 0.62%, #081A24 101.27%);
              background-repeat: no-repeat;
              background-size: auto;
              background-attachment: fixed;
              height: 100%;
              width: 100%;
            }
            .noOrder{
            padding:8px;
              background: rgba(44, 123, 172, 0.2);
              border: 1px solid #2C7BAC;
              border-radius: 8px;  
              color:#fff;
              font-size:22px;
              width:50%;
              margin:0 auto;
              height:200px;
            }
           .dashboard_orders ul li {
                list-style:none;
                margin-bottom:20px;
            }
            .dashboard_orders ul {
              padding-left:0 !important;
            }
           .dashboard_orders .active{
              padding:8px;
              background: rgba(44, 123, 172, 0.2);
              border: 1px solid #2C7BAC;
              border-radius: 8px;
            }
           .dashboard_orders .inactive{
                padding:8px;
                background: rgba(44, 123, 172, 0.2);
                border-radius: 8px;
            }
            .calendar-icon-to{
                color: #63BDFF;
                position: absolute;
                right: 5px;
                top: 35px;
             }
             .calendar-icon-from{
                color: #63BDFF;
                position: absolute;
                right: 5px;
                top: 35px;
             }
             
             @media screen and (max-width:767px) {
              .noOrder{
                width:100%;
                margin:0 auto;
                height:200px;
              }
            }


            `}</style>
    </div>
  );
};

export default DashboardOrder;
