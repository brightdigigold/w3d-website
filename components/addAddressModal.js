import React, { useState, useEffect,useRef } from "react";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { AesDecrypt, AesEncrypt } from "../components/middleware";
import CountDown from "./countdown";
import axios from "axios";
import { IoIosClose } from "react-icons/io"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from "next/router";
import * as Yup from "yup";
import style from '../components/profileDetails/profileDetail.module.css'
import Swal from "sweetalert2";
import { log } from "./logger";

const AddAddressModal = (props) => {
  const formikRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [delivered, setDelivered] = useState(false)
  const [state, setState] = useState([]);
  const [commonError,setCommonError] = useState([]);
  const initialValues = {
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  };
  const validationSchema = Yup.object().shape({
    line1: Yup.string().required("Required"),
    line2: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    pincode: Yup.string()
      .matches(/^[1-9][0-9]{5}$/, "PinCode is not valid")
      .required("Required"),
  });

  const fetchPincode = async (pincode)=>{
    setCommonError('')
    if(pincode.length == 6){
        try{
            log('pincode2',pincode);
            const token = localStorage.getItem("token");
            const configHeaders = { headers: {  authorization: `Bearer ${token}`,'Content-Type': 'application/json' } }
            const response = await axios.get(`${process.env.baseUrl}/user/ecom/pincode/${pincode}`, configHeaders);
            const decryptedData = await AesDecrypt(response.data.payload)
            const finalResult = JSON.parse(decryptedData)
            if(finalResult.data.length > 0){

                log('city',finalResult.data[0]['city'])
                log('state',finalResult.data[0]['state'])
                formikRef.current.setFieldValue('city', finalResult.data[0]['city']);
                formikRef.current.setFieldValue('state', finalResult.data[0]['state']);
                setCommonError('')
                setDelivered(true);
            }else{
                formikRef.current.setFieldValue('city','');
                formikRef.current.setFieldValue('state','');
                setCommonError('Sorry, We do not provide service on this pincode')
                setDelivered(false);
            }
            log('fetchpincode',finalResult.data);
        }catch(error){
            
        }
    }
}

  const onSubmit = async (values, { resetForm }) => {
    if(delivered){
    setIsSubmitting(true);
    setCommonError('')
    try {
      const resAfterEncrypt = await AesEncrypt(values);
      const body = {
        payload: resAfterEncrypt,
      };
      const token = localStorage.getItem("token");
      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${process.env.baseUrl}/user/address/create`,
        body,
        configHeaders
      );
      const decryptedData = await AesDecrypt(response.data.payload);
      const finalResult = JSON.parse(decryptedData);
      if (finalResult.status) {
        props.setIsShowAddAddress(false);
        Swal.fire({
          position: "centre",
          icon: "success",
          title: finalResult.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      
      props.setIsShowAddAddress(false);
    } catch (error) {
      
    } finally {
      setIsSubmitting(false);
    }
  }else{
    setCommonError('Sorry, We do not provide service on this pincode')
}
  };
  const closeAddForm = () => {
    props.setIsShowAddAddress(false);

  };
  useEffect(() => {
    fetch(`${process.env.baseUrl}/public/state/list`, {
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await AesDecrypt(data.payload);
        const stateList = JSON.parse(decryptedData).data;
        setState(stateList);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop={false}
    >
      <div className="coupons_modal">
        <Modal.Body >
          <div>
            <div className="p-3">
              <div className={style.cross} onClick={closeAddForm}>
                <IoIosClose />
              </div>
              <Formik  innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  setFieldValue,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form
                    className="pt-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div className={style.user_kyc}>
                      <label>Address Line 1</label>
                      <br />
                      <input
                        name="line1"
                        type="text"
                        placeholder="Enter Your Address"
                        value={values.line1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="line1"
                        component="div"
                        className="error text-danger"
                      />
                    </div>
                    <div className={style.user_kyc}>
                      <label>Address Line 2</label>
                      <br />
                      <input
                        name="line2"
                        type="text"
                        placeholder="Enter Your Address"
                        value={values.line2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="line2"
                        component="div"
                        className="error text-danger"
                      />
                    </div>

                    <div className={style.user_kyc}>
                      <label>PIN Code</label>
                      <br />
                      <input
                        name="pincode"
                        type="text"
                        placeholder="Enter Your Pin Code"
                        value={values.pincode}
                        maxLength={6}
                        onChange={(event)=>{
                          setDelivered(false);
                          const { name, value } = event.target;
                          const updatedValue = value.replace(/[^0-9]/g, '');
                          fetchPincode(updatedValue);
                          setFieldValue("pincode", updatedValue);
                        }}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="pincode"
                        component="div"
                        className="error text-danger"
                      />
                       {commonError && <div className='text-danger'>{commonError}</div>}
                    </div>
                    <div className={style.user_kyc}>
                      <label>City</label>
                      <br />
                      <input
                        name="city"
                        type="text"
                        placeholder="Enter Your City Name"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="error text-danger"
                      />
                    </div>
                    <div className={style.user_kyc}>
                      <label>State</label>
                      <br />
                      <select
                        name="state"
                        id="state"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.state}
                      >
                        <option value="">Please choose an option</option>
                        {state.map((item, key) => {
                          return (
                            <>
                              <option key={item._id} value={item.name}>
                                {item.name}
                              </option>
                            </>
                          );
                        })}
                      </select>
                      <ErrorMessage
                        name="state"
                        component="div"
                        className="error text-danger"
                      />
                      {/* <option value="uttar pradesh">Uttar Pradesh</option>
                                    <option value="uttarakhand">Uttarakhand</option> */}
                    </div>

                    <div className={`mt-5 ${style.edit_details}`}>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        Save Details
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </Modal.Body>
        <style>{`
                .modal-content {
                    margin-top:60px;
                    background: linear-gradient(0.69deg, #154C6D 0.62%, #12242E 101.27%);
                    border-radius: 8px;
                    z-index:9999999;
                    }
                .coupons{
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 150%;
                    text-transform: capitalize;
                    color: #FFFFFF;
                    }
               .products_details{
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-top:20px;
               }
               .left_data{
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 150%;
                color: #FFFFFF;

               }
               .right_data{
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 150%;
                    color: #FFFFFF;
               }
               .border_details{
                margin:15px 0px;
                border: 1px solid #222739;
               }
               .safe_and_secure{
                display:flex;
                justify-content:center;
                align-items:center;
                margin-top:20px;
                gap:1px;
               }
               .safe_secure_text{
                font-weight: 400;
                font-size: 12px;
                line-height: 16px;
                color: #FFFFFF;
               }
                .tap_to_continue{
                     margin-top:20px;
                    width:100%;
                    background: linear-gradient(90.12deg, #C5A643 0.1%, #AE8323 12.05%, #C5A643 22.45%, #CEA83D 33.88%, #BC932E 41.16%, #B28726 47.4%, #C09832 56.75%, #D7B344 68.19%, #EAC954 74.43%, #F6E472 89.5%, #EAC954 99.9%), #63BDFF;
                    border-radius: 8px 8px 8px 8px;
                }
                .tap_to_continue button{
                    font-weight: 700;
                    font-size: 14px;
                    line-height: 18px;
                    text-align: center;
                    text-transform: uppercase;
                    padding:15px;
                    color: #FFFFFF;
                }
                .countdown-container {
                    margin:30px 0px 20px;
                    position: relative;
                    width: 100%;
                    padding:5px;
                    background-color: lightgray;
                    border-radius: 5px;
                    overflow: hidden;
                }
                .low_buy_price{
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 150%;
                    /* identical to box height, or 18px */

                    display: flex;
                    align-items: center;

                    color: #000000;

                }
                .valid_for{
                    font-weight: 700;
                    font-size: 14px;
                    line-height: 150%;
                    /* identical to box height, or 21px */

                    display: flex;
                    align-items: center;
                    text-align: center;

                    color: #000000;
                }
                .progress-bar {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: rgba(0, 205, 57, 0.4);
                  transition: width 1s linear;
                }

                .text-container {
                display:flex;
                justify-content:space-between;
                align-items:center;
                position: relative;
                z-index: 1;
                padding: 5px;
                color: white;
                }

                @keyframes flowAnimation {
                from {
                    left: -100%;
                }
                to {
                    left: 100%;
                }
                }                
                `}</style>
      </div>
    </Modal>
  );
};

export default AddAddressModal;
