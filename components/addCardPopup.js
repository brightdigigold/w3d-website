import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io'
import Image from 'next/image';
import { AesEncrypt, AesDecrypt } from "../components/middleware"
import axios from 'axios';
import { log } from "./logger";


const AddCardPopup = (props) => {
    const [changeAtmSide, setChangeAtmSide] =useState('1')
    const closeModal = () => {
        props.onHide();
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop={false}
        >
            <div className='upi_modal'>
                <Modal.Body className='p-4'>
                    <div className='d-flex justify-content-between align-items-center coupons_close'>
                        <div className='upi_id'>Adding Card</div>
                        <div className='close' onClick={closeModal}><IoMdClose style={{ color: "#fff" }} /></div>
                    </div>
                    {changeAtmSide === '1' &&
                    (
                        <>
                        <div className='card'>

                            <div className='d-flex justify-content-between align-items-center coupons_close'>
                                <div className='bankName'>HDFC</div>
                                <div className='bankLogo'>Logo</div>
                            </div>
                            <div className='cardNumber'>
                                <div className='card_number_text'>Card Number</div>
                                <div className='atmCardInput'><input type="text" maxLength={16} /></div>
                            </div>
                            <div className='container p-0'>
                                <div className='row'>
                                    <div className='col-6 mt-3'>
                                        <div className='card_text'>Name on Card</div>
                                        <div className='card_name_date'><input type="text" /></div>
                                    </div>
                                    <div className='col-6 mt-3'>
                                        <div className='card_text'>Exp Date</div>
                                        <div className='card_name_date'><input type="text" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='verify_and_add'>
                                <button type="submit"  >NEXT</button>
                        </div>
                        </>
                    )}

                    {/* <div className='card'>
                    </div> */}
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
                .card{
                    margin-top:30px;
                    background: linear-gradient(123.5deg, #BDE6FF 1.88%, #62B0DF 100%);
                    border-radius: 12px;
                    padding:15px;
                }
                .bankName, .bankLogo{
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 21px;
                    color: #000000;
                }
                .card_number_text{
                    margin-top:15px;
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 16px;
                    color: #000000;
                }
                .atmCardInput input{
                    border: none;
                    border-bottom: 1px solid black;
                    outline: none;
                    width: 100%;
                    font-size: 16px;
                    padding-bottom: 4px;
                    background: rgba(44, 123, 172, 0.2);
                    border-radius: 4px;
                    padding:10px;
                }
                .card_text{
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 16px;
                    color: #000000;
                    }
                .card_name_date input{
                     width:100%;
                    background: rgba(44, 123, 172, 0.2);
                    border-radius: 4px;
                    border:none;
                    padding:10px;
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


    )
}

export default AddCardPopup
