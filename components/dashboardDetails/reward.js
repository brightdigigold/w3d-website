import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { AesEncrypt, AesDecrypt } from "../middleware";
import style from "./dashboardDetails.module.css";
import { log } from "../logger";

const Reward = () => {
  const [userRewards, setUserRewards] = useState([]);
  const [metal, setMetal] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [itemList, setItemList] = useState([]);
  const [size, setSize] = useState(4);

  const redeemReward = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "do you want to redeem",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let dataToBeEncryptPayload = {
          redemptionId: id,
        };
        const resAfterEncryptData = await AesEncrypt(dataToBeEncryptPayload);
        const payloadToSend = {
          payload: resAfterEncryptData,
        };
        const token = localStorage.getItem("token");
        axios
          .post(`${process.env.baseUrl}/user/redeem/reward`, payloadToSend, {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          })
          .then(async (data) => {
            const decryptedData = await AesDecrypt(data.data.payload);

            Swal.fire(
              "Success",
              `You have successfully redeemed rewards`,
              "success"
            );
            getRewards(metal,status,page,size);
          })
          .catch(async (error) => {
            const decryptedData = await AesDecrypt(error.response.data.payload);
            let decryptedResponse = JSON.parse(decryptedData);
            Swal.fire("Oops!", decryptedResponse.message, "error");
          });
      }
    });
  };

  const rewardAction = async (type, id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${type} gift`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let dataToBeEncryptPayload = {
          userGiftingId: id,
        };
        const resAfterEncryptData = await AesEncrypt(dataToBeEncryptPayload);
        const payloadToSend = {
          payload: resAfterEncryptData,
        };
        const token = localStorage.getItem("token");
        axios
          .post(
            `${process.env.baseUrl}/user/gifting/cancellation`,
            payloadToSend,
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
            }
          )
          .then(async (data) => {
            const decryptedData = await AesDecrypt(data.data.payload);

            Swal.fire("Success", decryptedData.message, "success");
            getRewards(metal, status,page,size);
          })
          .catch(async (error) => {
            getRewards(metal, status,page,size);
            const decryptedData = await AesDecrypt(error.response.data.payload);
            let decryptedResponse = JSON.parse(decryptedData);
            Swal.fire("Oops!", decryptedResponse.message, "error");
          });
      }
    });
  };

  const updatePage = (e)=>{
    let moveTo = e.target.value;
    setPage(moveTo);
    getRewards(metal,status,moveTo,size);
  }
  
  const nextPageHandler = () =>{
    log("nextPageHandler : ", page + 1);
    setPage(page+1);
    getRewards(metal,status,page+1,size);
  }
  const prevPageHandler = () =>{
    if(page > 1) {
      log("nextPageHandler : ", page - 1);
      setPage(page-1);
      getRewards(metal,status,page-1,size);
    }
  }

  const handleMetalChange = (e) => {
    setMetal(e.target.value);
    getRewards(e.target.value, status,1,size);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    getRewards(metal, e.target.value,1,size);
  };

  const getRewards = async (metal, status,page,size) => {
    const token = localStorage.getItem("token");
    fetch(
      `${process.env.baseUrl}/user/rewards?page=${page}&limit=${size}&metal=${metal}&status=${status}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await AesDecrypt(data.payload);
        let userRewardsDecrypt = JSON.parse(decryptedData).data.rewardsData;

        log("decryptedData", JSON.parse(decryptedData).data);
        if (userRewardsDecrypt.length > 0) {
          setPage(JSON.parse(decryptedData).data.currentPage);
          setTotalPage(JSON.parse(decryptedData).data.totalPages);
          let itemList = Array.from(
            { length: JSON.parse(decryptedData).data.totalPages },
            (_, index) => index + 1
          );
          setItemList(itemList);
        } else {
          setPage(0);
          // setSize(3);
        }
        setUserRewards(userRewardsDecrypt);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getRewards(metal, status,page,size);
  }, []);

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-9">
            <div className={style.filterreward}>
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
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REDEEM">Redeemed</option>
                </select>
              </div>
            </div>
          </div>
          {itemList.length > 0 && 
          <div className="col-12 col-md-3 mb-4">
            <div className={style.pagination_orders}>
              {/* <div className={style.currentpage}>Current Page </div> */}
              <div className={style.movetopage}>
                <select
                  className="form-control"
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
              <div className={style.order_pagination}>
                {page > 1 && <div onClick={prevPageHandler}>Prev</div>}
                {/* <div>{page}</div> */}
                {page < totalPage && <div onClick={nextPageHandler}>Next</div>}
              </div>
            </div>
          </div>
          }
        </div>
     
        <div className={style.rewards}>
          {userRewards.length == 0 && (
            <div className="d-flex justify-content-center align-items-center nodata mt-2">
              <div style={{ textAlign: "center" }}> No Rewards Found</div>
            </div>
          )}
          {userRewards.length > 0 &&
            userRewards.map((item, key) => {
              return (
                <>
                  <div className={`${style.redeem_bg} mt-4`}>
                    <div className={style.redeem_data}>
                      <div className={style.redeem_left_data}>
                        <div style={{ fontWeight: "700" }}>
                          <span className={style.gold_coupons}>
                            {" "}
                            {item.itemType}{" "}
                          </span>
                        </div>
                        <div className={style.buy}>{item.description}</div>
                      </div>
                      {item.status == "PENDING" && (
                        <div className="d-flex flex-row">
                          <div
                            className={style.redeem_right_data}
                            onClick={() => redeemReward(item._id)}
                          >
                            Redeem
                          </div>
                          {item.rewardsType == "GIFTING" && (
                            <div
                              className={style.redeem_right_data}
                              onClick={() =>
                                rewardAction("cancel", item.user_gifting_id)
                              }
                            >
                              Cancel
                            </div>
                          )}
                        </div>
                      )}

                      {item.rewardsType == "GIFTING" &&
                        item.status == "CANCELLED" && (
                          <div className={style.redeem_right_data}>
                            Cancelled
                          </div>
                        )}

                      {item.rewardsType == "GIFTING" &&
                        item.status == "REDEEM" && (
                          <div className={style.redeem_right_data}>
                            Redeemed
                          </div>
                        )}

                      {item.rewardsType == "GIFTING" &&
                        item.status == "EXPIRED" && (
                          <div className={style.redeem_right_data}>Expired</div>
                        )}

                      {item.rewardsType == "GIFTING" &&
                        item.status == "SEND" && (
                          <div className={style.redeem_right_data}>
                            Redeemed
                          </div>
                        )}

                      {item.rewardsType == "REFERANDEARN" &&
                        item.status == "REDEEM" && (
                          <div className={style.redeem_right_data}>
                            Redeemed
                          </div>
                        )}

                      {item.rewardsType == "GIFTING" &&
                        item.status == "SENT" && (
                          <div
                            className={style.redeem_right_data}
                            onClick={() =>
                              rewardAction("cancel", item.user_gifting_id)
                            }
                          >
                            Cancel
                          </div>
                        )}
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      </div>
      <style>{`
            @media screen and (max-width:767px) {
              .nodata{
                width:100%;
                margin:0 auto;
                height:200px;
              }
            }
            
            `}</style>
    </div>
  );
};

export default Reward;
