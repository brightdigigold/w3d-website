import React, { useEffect, useState } from "react";
import style from "./profileDetail.module.css";
import { AiOutlinePlus, AiFillDelete } from "react-icons/ai";
import UpiIDPopup from "../upiIdPopup";
import Notiflix from "notiflix";
import AddCardPopup from "../addCardPopup";
import { AesDecrypt, AesEncrypt } from "../middleware";
import BankVerification from './bankVerification';
import Swal from "sweetalert2";
import axios from 'axios'
import { log } from "../logger";

const User = (props) => {
  log('props in payment', props);
  const [showUpiPopup, setShowUpiPopup] = useState(false);
  const [showCardPopup, setShowCardPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [upiList, setUpiList] = useState([]);
  const [allUpiList, setAllUpiList] = useState([]);
  const [allBankList, setAllBankList] = useState([]);


  const [toggle,setToggle]=useState()


  const fetchAllUPI = async () => {
    const token = localStorage.getItem("token");
    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    fetch(`${process.env.baseUrl}/user/upis`, configHeaders)
      .then((response) => response.json())
      .then(async (data) => {
        log("data of upi : ", data);
        const decryptedData = await AesDecrypt(data.payload);
        log("decryptedData in upi", decryptedData);
        let decryptedDataList = JSON.parse(decryptedData).data;
        log("decryptedDataList in upi", decryptedDataList);
        let UpiList = decryptedDataList.filter(function(value) {
          return value.documentType == 'UPI'; 
        })
        let BankList = decryptedDataList.filter(function(value) {
          return value.documentType == 'UPI'; 
        })
        setAllUpiList(UpiList);
        setAllBankList(BankList);
        setUpiList(decryptedDataList);
      })
      .catch((error) => console.error(error));
  };

  const updatedUPI = async () => {
    fetchAllUPI();
  };
  const deleteUPIAndBankAcc = async (deleteItem) => {

    if(!isSubmitting){
      setIsSubmitting(true)

      log('deleteItem', deleteItem);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You Want to delete this UPI",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          Notiflix.Loading.custom({svgSize:'180px',customSvgCode: '<object type="image/svg+xml" data="/svg/pageloader.svg">svg-animation</object>'});
          let dataToBeEncryptPayload = {
            "id": deleteItem,
          }
          const resAfterEncryptData = await AesEncrypt(dataToBeEncryptPayload)
          // 
          const payloadToSend = {
            payload: resAfterEncryptData
          }
          const token = localStorage.getItem('token')
          const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json', onUploadProgress: Notiflix.Loading.circle() } }
          const response = await axios.post(`${process.env.baseUrl}/user/destroy/upi`, payloadToSend, configHeaders);
          // 
          const decryptedData = await AesDecrypt(response.data.payload)
          // 
          const finalResult = JSON.parse(decryptedData)
  
          if (finalResult.status) {
            Notiflix.Loading.remove();
            props?.setToggle(!props.toggle);
            fetchAllUPI();
            props?.setToggle(!props.toggle);
          } else {
            alert("some error occured please try again");
          }
        }
      }).catch((err) => {
  
      }).finally(()=>{
        setIsSubmitting(false)
      })
    }
  
  }



  useEffect(() => {
    fetchAllUPI();
    setUpiList()
  }, [toggle]);
  return (
    <div>
       {props?.userDetails?.isKycDone == true ? (
        <>
               <UpiIDPopup
        show={showUpiPopup}
        upiList={upiList}
        updatedUPI={updatedUPI}
        onHide={() => setShowUpiPopup(false)}
      />
      <AddCardPopup
        show={showCardPopup}
        onHide={() => setShowCardPopup(false)}
      />
      <div className={style.userProfile_bg}>
        {allBankList && allBankList.length < 4 &&
        <BankVerification  upiList={upiList} setUpiList={setUpiList} toggle={toggle} setToggle={setToggle}/>
        }
        <div className="p-3 pt-3">
          <div className={style._bg}>
            {allUpiList && allUpiList.length < 6 &&
            <div className={style.upi_id} onClick={() => setShowUpiPopup(true)}>
              <div className={style.upi_id_text}>
                <div className={style.add_upi_id}>Add a new UPI ID</div>
                <div className={style.add_upi_id_desc}>
                  You need to have a registered UPI ID
                </div>
              </div>
              <div className={style.add_upi}>
                <AiOutlinePlus style={{ color: "#fff" }} />
              </div>
            </div>
            }
            {upiList?.map((item, key) => {
              log("upiList",upiList)
              return (
                <>
                  {item.documentType == "UPI" ?
                    (
                      <>
                        <div className={`${style.upilist}    mt-3`}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className={style.upirow} id={item._id}>
                              {AesDecrypt(item.value)}
                            </div>
                            <div className={style.deleteicons} >
                              <button onClick={() => deleteUPIAndBankAcc(item._id)}><AiFillDelete /></button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) :""}
                </>
              );
            })}
            {upiList?.map((item, key) => {
              log("upiList",upiList)
              return (
                <>
                  {item.documentType == "BANKACCOUNT" ?
                    (
                      <>
                      <div className={`${style.upilist} p-3 mt-3`}>
                          <div className={style.profile_details}>
                            <div className={style.name}>
                              <div className={style.left_side_data}>Account Holder Name</div>
                              <div className={style.right_side_data}>{AesDecrypt(item.bankData.accountName)}</div>
                            </div>
                            <div className={style.dob}>
                              <div className={style.left_side_data}>Account Number</div>
                              <div className={style.right_side_data}>{AesDecrypt(item.bankData.accountNumber)}</div>
                            </div>
                            <div className={style.email}>
                              <div className={style.left_side_data}>Bank Name</div>
                              <div className={style.right_side_data}>{AesDecrypt(item.bankData.bankName)}</div>
                            </div>
                            <div className={style.gst}>
                              <div className={style.left_side_data}>Bank IFSC</div>
                              <div className={style.right_side_data}>{AesDecrypt(item.bankData.ifsc)}</div>
                            </div>
                          </div>
                          <div className={style.deleteBank}>
                            <button type="submit" onClick={() => deleteUPIAndBankAcc(item._id)}>Delete Details</button>
                          </div>
                        </div>
                      </>
                    ) : ""}

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
        </div>
      </div>
        </>
       ):
       <div className={`${style.userProfile_bg} d-flex justify-content-center align-items-center`}>
        <div className='p-3'>
          <div className="">
                <div className="text-center"> 
                  <h3 className="text-white">Please complete your KYC</h3>
                </div>
          </div>
      </div>
     </div>
       }
    </div>
  );
};

export default User;
