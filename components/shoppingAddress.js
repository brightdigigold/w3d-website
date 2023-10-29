import React, { useEffect, useState } from "react";
import style from "./shoppingAddress.module.css";
import { AesEncrypt, AesDecrypt } from "../components/middleware";
import Swal from "sweetalert2";
import axios from "axios";
import { VscVerifiedFilled } from "react-icons/vsc";
import AddAddressModal from "./addAddressModal";
import { IoMdClose } from "react-icons/io";
import { log } from "./logger";

const ShoppingAddress = ({
  setAddressId,
  addressId,
  buyReqApiHandler,
  setGstNum,
  gstNum,
  closeTheModal,
}) => {

  const [errorMess, setErrorMess] = useState("");
  const [isGstVerified, setIsGstVerified] = useState(false);
  const [isShowAddAddress, setIsShowAddAddress] = useState(false);
  const [addList, setAddList] = useState([]);
  useEffect(() => {
    userAddressList();
  }, [isShowAddAddress]);
  const userAddressList = () => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.baseUrl}/user/address/list`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.payload);

        setAddList(JSON.parse(decryptedData).data);
      })
      .catch((error) => console.error(error));
  };

  const validate = () => {
    if (addressId) {
      return true;
    }
    return false;
  };
  const buyHandlerApi = () => {
    if (validate()) {
      buyReqApiHandler();
    } else {
      setErrorMess("Please select address");
    }
  };
  const verifyGst = async () => {
    const dataToBeDecrypt = {
      value: gstNum,
    };
    const resAfterEncryptData = await funForAesEncrypt(dataToBeDecrypt);
    //
    const payloadToSend = {
      payload: resAfterEncryptData,
    };
    const token = localStorage.getItem("token");

    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `${process.env.baseUrl}/user/kyc/gst/verify`,
        payloadToSend,
        configHeaders
      )
      .then(async (resAfterVerfiyGst) => {
        const decryptedData = await funcForDecrypt(
          resAfterVerfiyGst.data.payload
        );

        if (JSON.parse(decryptedData).status) {
          setIsGstVerified(true);
          setErrorMess("");
        }
      })
      .catch(async (errInGst) => {
        const decryptedData = await funcForDecrypt(
          errInGst.response.data.payload
        );
        let response = JSON.parse(decryptedData);

        setGstNum("");
        if (JSON.parse(decryptedData).code == 400) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: JSON.parse(decryptedData).message,
          });
        }
      });
  };
  const funcForDecrypt = async (dataToBeDecrypt) => {
    const response = await AesDecrypt(dataToBeDecrypt);
    //
    return response;
  };
  const funForAesEncrypt = async (dataToBeEncrypt) => {
    const response = await AesEncrypt(dataToBeEncrypt);
    //
    return response;
  };
  const gstHandler = (e) => {
    setErrorMess("");
    setGstNum(e.target.value);
  };
  const handleAddress = (addId) => {
    setAddressId(addId);
    setErrorMess(""); 
  };

  return (
    <div>
      <AddAddressModal
        show={isShowAddAddress}
        setIsShowAddAddress={setIsShowAddAddress}
      />
      <div className="d-flex justify-content-between align-items-center coupons_close">
        <div className="coupons mb-2">Product Purchase</div>
        <div className="close" onClick={closeTheModal}>
          <IoMdClose style={{ color: "#fff" }} />
        </div>
      </div>
      {/* <div className={style.userProfile_bg}> */}
      <div className="pt-3 p-2">
        <div className="">
          <div className="container p-0">
            {addList.length > 0 && (
              <div className={style.addressList}>
                {addList?.map((item, key) => {
                  return (
                    <>
                      <div className={style.profile_address} key={key}>
                        <div className="d-flex align-items-center gap-5 pt-3">

                          <div className={style.convert_btn}>
                            <input
                              type="radio"
                              name="address"
                              // checked={checkedState.every((value) => value)}
                              onChange={() => handleAddress(item._id)}
                              style={{height:"25px",width:"25px"}}
                            />
                          </div>

                          <div className="">
                            <div className={style.left_side_address}>
                              Address {key + 1}
                            </div>
                            <div className={style.address1}>
                              {item.address.line1 +
                                " " +
                                item.address.line2 +
                                " " +
                                item.address.city +
                                " " +
                                item.address.state +
                                " " +
                                item.address.pincode}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            )}
            {errorMess &&  <div
                        className="text-danger text-center"
                        style={{ fontSize: "12px", marginTop: "5px" }}
            >
              {errorMess}
            </div>}
            <div className={style.add_details_address}>
              <button onClick={() => setIsShowAddAddress(true)}>
                Add Address
              </button>
            </div>
            <div className={`${style.gst} mt-3`}>
              <label>GST No. (Optional)</label>
              <br />
              <input
                type="text"
                readonly={isGstVerified ? "readonly" : false}
                value={gstNum}
                onChange={gstHandler}
                placeholder="Enter GST No."
              />
              {gstNum.length > 0 ? (
                <>
                  {" "}
                  {isGstVerified ? (
                    <VscVerifiedFilled className={style.verified_icon} />
                  ) : (
                    <div className={style.verified_text} onClick={verifyGst}>
                      <span>Verify</span>
                    </div>
                  )}{" "}
                </>
              ) : (
                ""
              )}
            </div>
         
            <div className={`${style.add_details_address} mt-4`}>
              <button type="submit" onClick={buyHandlerApi}>
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default ShoppingAddress;
