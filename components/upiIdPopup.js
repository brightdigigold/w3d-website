import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import Notiflix from "notiflix";
import Image from "next/image";
import { AesEncrypt, AesDecrypt } from "../components/middleware";
import axios from "axios";
import { useRouter } from 'next/router'
import Swal from 'sweetalert2';
import { log } from "./logger";



const UpiIDPopup = (props) => {
  // 
    const router = useRouter();
  const [token, setToken] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [upiError,setUpiError] = useState("");

  const funForAesEncrypt = async (dataToBeEncrypt) => {
    const response = await AesEncrypt(dataToBeEncrypt);
    return response;
  };
  
  const funcForDecrypt = async (dataToBeDecrypt) => {
    const response = await AesDecrypt(dataToBeDecrypt);
    // 
    return response;
  };
  
  const validate = () =>{
    let upiErrorMess = ""
    if(!upiId){
      upiErrorMess = "Please enter UPI id"
    }
    if(upiErrorMess){
      setUpiError(upiErrorMess);
      return false
    }
    return true

  }
  const buyReqApiHandler = async () => {
    if(validate()){
      if(!isSubmitting){
        Notiflix.Loading.custom({svgSize:'180px',customSvgCode: '<object type="image/svg+xml" data="/svg/pageloader.svg">svg-animation</object>'});
        setIsSubmitting(true)
  
        const dataToBeDecrypt = {
          value: upiId,
          isDefault:1
        };
        
        const resAfterEncryptData = await funForAesEncrypt(dataToBeDecrypt);
        
        const payloadToSend = {
          payload: resAfterEncryptData,
        };
        const token = localStorage.getItem("token");
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            onUploadProgress: Notiflix.Loading.circle()
          },
      };
      
        axios
          .post(
            `${process.env.baseUrl}/user/kyc/upi/verify`,
            payloadToSend,
            configHeaders
          )
          .then(async (resAfterSellReq) => {
            
            const decryptedData = await funcForDecrypt(resAfterSellReq.data.payload);
            
            if (JSON.parse(decryptedData).status) {
              Notiflix.Loading.remove();
              setUpiId("");
              Swal.fire(
                "Success",
                `${JSON.parse(decryptedData).message}`,
                "success"
              );
              closeModal();
              props.updatedUPI();
            }
            // setPreviewData(JSON.parse(decryptedData).data);
          })
          .catch(async (errInBuyReq) => {
            Notiflix.Loading.remove();
            const decryptedData = await funcForDecrypt(errInBuyReq?.response?.data?.payload);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `${JSON.parse(decryptedData).message}`,
            });
          }).finally(()=>{
            setIsSubmitting(false)
          });
  
      }
    } else {
      log("fields not validated ")
    }
  };

  const closeModal = () => {
    props.onHide();
  };
  
  const upiIdHandler = (e) => {
    setUpiError("");
    // Replace invalid characters with an empty string
    let upiIdInput =  e.target.value.replace(/[^a-zA-Z0-9.@]/g, '');
    upiIdInput = upiIdInput.replace(/\.+/g, '.');
    let updatedValue = upiIdInput.replace(/\@+/g, '@');
    setUpiId(updatedValue)
  }
  
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop={false}
    >
      <div className="upi_modal">
        <Modal.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center coupons_close">
            <div className="upi_id">Adding UPI ID</div>
            <div className="close" onClick={closeModal}>
              <IoMdClose style={{ color: "#fff" }} />
            </div>
          </div>
          <div className="input_upi">
            <label>UPI ID</label>
            <input type="text" name="upiId" value={upiId} onChange={upiIdHandler} />
            {upiError && <div className='text-danger text-center mt-2'>{upiError}</div>}
          </div>
          <div className="verify_and_add">
            <button onClick={buyReqApiHandler} type="submit">
              VERIFY AND ADD
            </button>
          </div>
        </Modal.Body>
        <style>{`
                .modal-content {
                    background: linear-gradient(0.69deg, #154C6D 0.62%, #12242E 101.27%);
                    border-radius: 8px;
                    }
                .upi_id{
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 150%;
                    text-transform: capitalize;
                    color: #FFFFFF;
                }
                .input_upi label{
                     margin-top:25px;
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 16px;
                    /* identical to box height */


                    color: #FFFFFF;

                }
                .input_upi input{
                    background: rgba(44, 123, 172, 0.2) !important;
                    border-radius: 4px;
                    width:100%;
                    background:#fff;
                    padding:15px;
                    color:#fff;
                    border:none;
                }
                .verify_and_add{
                    border: 1px solid #FFD662;
                    border-radius: 8px;
                    text-align: center;
                    // padding: 10px;
                    font-weight: 700;
                    font-size: 14px;
                    line-height: 150%;
                    text-align: center;
                    text-transform: uppercase;
                    color: #FFD662;
                    margin-top:30px;
                }
                `}</style>
      </div>
    </Modal>
  );
};

export default UpiIDPopup;
