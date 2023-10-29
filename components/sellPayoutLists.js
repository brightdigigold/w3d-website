import React, { useEffect, useState } from "react";
import style from "./shoppingAddress.module.css";
import { AesEncrypt, AesDecrypt } from "../components/middleware";
import Swal from "sweetalert2";
import axios from "axios";
import { VscVerifiedFilled } from "react-icons/vsc";
import AddAddressModal from "./addAddressModal";
import { IoMdClose } from "react-icons/io";
import BankVerification from "./profileDetails/bankVerification";
import { AiOutlinePlus, AiFillDelete } from "react-icons/ai";
import { log } from "./logger";

const SellPayOutList = ({ upiList, buyReqApiHandler, setUpiId, upiId,closeTheModal }) => {

  const [errorMess, setErrorMess] = useState('');
  log("upiList from props : ", upiList);

  const validate = () => {
    log("validate func called : ", upiId);
    if (upiId) {
      log("upiId in validate : ", upiId);
      return true;
    } else {
      log("feilds not validated")
      return false;
    }
  };
  const buyHandlerApi = () => {
    log("buyHandlerApi func calling")
    if (validate()) {
      log("calling buyReqApiHandler ")
      buyReqApiHandler();
    } else {
      setErrorMess("Please select UPI");
    }
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

  const selectUpiHandler = (e) => {
    log("selectUpiHandler e.target.value : ", e.target.value);
    setUpiId(e.target.value);
  }



  return (
    <div>
      <div className={style.userProfile_bg}>
        {/* <BankVerification  upiList={upiList} setUpiList={setUpiList} toggle={toggle} setToggle={setToggle}/> */}
        <div className="p-3">
          <div className={style._bg}>
            <div className="d-flex justify-content-between align-items-center coupons_close">
              <div className="coupons mb-2">Payout Method</div>
              <div className="close" onClick={closeTheModal}>
                <IoMdClose style={{ color: "#fff" }} />
              </div>
            </div>
            {upiList?.map((item, key) => {
              log("upiList", upiList);
              return (
                <>
                  {item.documentType == "UPI" ? (
                    <>
                      <div className={`${style.profile_address}    mt-3`}>
                        <div className="d-flex justify-content-between align-items-center">
                          <input type="radio" onChange={selectUpiHandler} id="html" name="fav_language" value={item._id} />
                          <div className={style.upirow} id={item._id}>
                            {AesDecrypt(item.value)}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </>
              );
            })}
            {upiList?.map((item, key) => {
              log("upiList", upiList);
              return (
                <>
                  {item.documentType == "BANKACCOUNT" ? (
                    <>
                      <div className={`${style.profile_address} p-3 mt-3`}>
                        <input type="radio" onChange={selectUpiHandler} id="html" name="fav_language" value={item._id} />
                        <div className={style.profile_details}>
                          <div className={style.account_name}>
                            <div className={style.left_side_data}>
                              Account Holder Name
                            </div>
                            <div className={style.right_side_data}>
                              {AesDecrypt(item.bankData.accountName)}
                            </div>
                          </div>
                          <div className={style.account_number}>
                            <div className={style.left_side_data}>
                              Account Number
                            </div>
                            <div className={style.right_side_data}>
                              {AesDecrypt(item.bankData.accountNumber)}
                            </div>
                          </div>
                          <div className={style.bank_name}>
                            <div className={style.left_side_data}>
                              Bank Name
                            </div>
                            <div className={style.right_side_data}>
                              {AesDecrypt(item.bankData.bankName)}
                            </div>
                          </div>
                          <div className={style.bank_ifsc}>
                            <div className={style.left_side_data}>
                              Bank IFSC
                            </div>
                            <div className={style.right_side_data}>
                              {AesDecrypt(item.bankData.ifsc)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </>
              );
            })}
          </div>
          {/* <div className={style.upi_id} onClick={() => setShowCardPopup(true)} >
          <div className={style.upi_id_text}>
            <div className={style.add_upi_id}>Add a new Card</div>
            <div className={style.add_upi_id_desc}>You can save your Credit/Debit cards</div>
          </div>
          <div className={style.add_upi}><AiOutlinePlus style={{ color: "#fff" }} /></div>
        </div> */}
          {errorMess &&
            <div
              className="text-danger text-center"
              style={{ fontSize: "12px", marginTop: "5px" }}>
              {errorMess}
            </div>
          }
          <div className="tap_to_continue">
            <button onClick={buyHandlerApi}>CONTINUE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPayOutList;
