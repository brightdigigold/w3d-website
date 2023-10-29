import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io'
import Image from 'next/image';
import { AesEncrypt, AesDecrypt } from "../components/middleware"
import axios from 'axios';
import CouponAppliedPopup from './couponAppliedPopup';
import Swal from 'sweetalert2';
import { log } from "./logger";

const Coupons = (props) => {
    // 
    
    const [coupon, setCoupons] = useState();
    const [couponError, setCouponError] = useState("");
    
    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }

    function handleChange(e) {
        log("e.target.value : ", e.target.value)
        setCoupons(e.target.value);
    }

    useEffect(() => {
        

    }, [props.show])
   
    const handleCoupons = async (item) => {
        // if (coupon === undefined) {
        //     setCouponError("");
        // } else {
            setCoupons(item.code);
        const data = {
            code: item.code,
            amount:parseFloat(props.amount),
            itemType : props.itemType
        };
        try {
            const resAfterEncrypt = await AesEncrypt(data);
            const body = {
                "payload": resAfterEncrypt
            }
            const token = localStorage.getItem('token')
            const configHeaders = { headers: {'Content-Type': 'application/json' } }
            const response = await axios.post(`${process.env.baseUrl}/user/coupons/validate`, body, configHeaders);
            const decryptedData = await AesDecrypt(response.data.payload)
            const result = JSON.parse(decryptedData);
            props.setCouponsCode(item.code)
            setCouponError("");
            handleApplyCoupon();
        } catch (error) {
            
            setCouponError(`${item.code} is not applicable`);
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Oops...',
            //     text: 'Coupon is not applicable',
            // })
        }
    }

    const handleSubmit = async (e) => {
        // if (coupon === undefined) {
        //     setCouponError("");
        // } else {
        const data = {
            code: coupon,
            amount: parseFloat(props.amount),
            itemType : props.itemType
        };
        e.preventDefault();
        try {
            const resAfterEncrypt = await AesEncrypt(data);
            const body = {
                "payload": resAfterEncrypt
            }
            const token = localStorage.getItem('token')
            const configHeaders = { headers: { 'Content-Type': 'application/json' } }
            const response = await axios.post(`${process.env.baseUrl}/user/coupons/validate`, body, configHeaders);
            const decryptedData = await AesDecrypt(response.data.payload)
            const result = JSON.parse(decryptedData);
            handleApplyCoupon();
        } catch (error) {
            setCouponError(`${coupon} is not applicable`)
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Oops...',
            //     text: 'Coupon is not applicable',
            // })
        }
    }

    // };

    const closeModal = () => {
        props.onHide();
        // props.setCouponsCode('')
    }
    const handleApplyCoupon = () => {
        props.onHide();
        props.handleApplyCoupon();
       
    };
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className='couponspop'
            backdrop={false}
        >
            <div className='coupons_modal'>
                <Modal.Body>
                    <div className='d-flex justify-content-between align-items-center coupons_close'>
                        <div className='coupons' onClick={handleApplyCoupon}>Coupons</div>
                        <div className='close' onClick={closeModal}><IoMdClose style={{ color: "#fff" }} /></div>
                    </div>
                    <div className='input_coupons'>
                        <input type="text" name='coupon' onChange={handleChange}
                            value={coupon} placeholder="Type Coupon Code here" />
                        <div className='apply'>
                        {/* <button onClick={handleSubmit}>Apply</button> */}
                            <button onClick={handleSubmit}>Apply</button>
                        </div>
                    </div>
                    <div className='text-danger text-center mt-2'>{couponError}</div>
                    {props.couponsList?.map((item, index) => {
                        return (
                            <>
                                <div key={index} className='coupons_code_bg'>
                                    <div className='p-3'>
                                        <div className='d-flex justify-content-start'>
                                            <div className='star'><Image src={"/images/sale.png"} height={20} width={20} alt='sale' /></div>
                                            <div className='coupons_code_text'>{item.description}</div>
                                        </div>
                                    </div>
                                    <div className='tap_to_apply'>
                                        <button type="submit" onClick={() => handleCoupons(item)}>Tap to apply</button>
                                    </div>
                                </div>
                            </>
                        )

                    })}

                    {/* <div className='coupons_code_bg'>
                        <div className='p-3'>
                            <div className='d-flex justify-content-start'>
                                <div className='star'><Image src={"/images/sale.png"} height={20} width={20} alt='sale' /></div>
                                <div className='coupons_code_text'>Use code 34KIY and 3% Extra Gold on your first buy2 liner coupons Use code 34KIY and 3%
                                    3 liner coupons</div>
                            </div>
                        </div>
                        <div className='tap_to_apply'>
                            <button>Tap to apply</button>
                        </div>
                    </div>
                    <div className='coupons_code_bg'>
                        <div className='p-3'>
                            <div className='d-flex justify-content-start'>
                                <div className='star'><Image src={"/images/sale.png"} height={20} width={20} alt='sale' /></div>
                                <div className='coupons_code_text'>Use code 34KIY and 3% Extra Gold on your first buy</div>
                            </div>
                        </div>
                        <div className='tap_to_apply'>
                            <button>Tap to apply</button>
                        </div>
                    </div> */}
                </Modal.Body>
                <style>{`
                .couponspop .modal-content {
                    background: linear-gradient(0.69deg, #154C6D 0.62%, #12242E 101.27%);
                    border-radius: 8px;
                    overflow-y: auto;
                    }
                .coupons{
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 150%;
                    text-transform: capitalize;
                    color: #FFFFFF;
                }
                .close{
                    cursor:pointer;
                }
                .input_coupons{
                    position:relative;
                }
                .apply{
                    position:absolute;
                    right:15px;
                    bottom:15px;
                    font-weight: 700;
                    font-size: 14px;
                    line-height: 120%;
                    color: #C3C3C3;
                    cursor:pointer;
                }
                .input_coupons input{
                    margin-top:25px;
                    width:100%;
                    background:#fff;
                    padding:10px;
                    border-radius:8px;
                }
                .coupons_code_bg{
                    margin:20px 0 0 0;
                    background: #FFFFFF;
                    border-radius: 8px;
                }
                .star{
                    margin-right:10px;
                }
                .coupons_code_text{
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 130%;
                    color: #303851;
                    margin-bottom:20px;
                }
                .tap_to_apply{
                    width:100%;
                    background: rgba(99, 189, 255, 0.1);
                    border-radius: 8px 8px 8px 8px;
                }
                .tap_to_apply button{
                    padding:10px;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 120%;
                    color: #63BDFF;

                }
                /* width */
                ::-webkit-scrollbar {
                width: 10px;
                border-radius: 10px;
                }

                /* Track */
                ::-webkit-scrollbar-track {
                  background: #f1f1f1;
                }
                
                /* Handle */
                ::-webkit-scrollbar-thumb {
                  background: #164C6D; 
                }

                /* Handle on hover */
                ::-webkit-scrollbar-thumb:hover {
                  background: #164C6D;
                }
               

                `}</style>
            </div>
        </Modal>


    )
}

export default Coupons
