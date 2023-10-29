import React, { useState, useEffect,useCallback,useRef } from 'react'
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io'
import styles from '../components/sellAndBuy/sellAndBuy.module.css'
import Image from 'next/image';
import { AesDecrypt, AesEncrypt } from "../components/middleware"
import CountDown from './countdown';
import axios from 'axios';
import { useRouter } from 'next/router'
import Swal from 'sweetalert2';
import { log } from "./logger";
// import {load} from '@cashfreepayments/cashfree-js';

// const cashfree =  load({
//     mode: "production" //or production
// });
const BuyModal = (props) => {

 
    
    const router = useRouter()
    const [remainingTime, setRemainingTime] = useState(300);
    const [token, setToken] = useState("");
    const [orderId, setOrderId] = useState("");
    const orderIdRef = useRef(null);
    // const countDownTime = [0, 5, 0];
    // const [[hours, minutes, seconds], setTimer] = useState(countDownTime);

    const [countDown, setCountDown] = useState();
    const onRestart = () => {
        log("working in the onRestart ")
        closeTheModal();
        // router.push('/');
    }

    const checkPaymentStatus = () =>{
        
        let token = localStorage.getItem('token');
        console.log(token);
        const configHeaders = {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
        axios.get(`${process.env.baseUrl}/user/order/status/check?orderId=${orderIdRef.current}`, configHeaders).then(async (resAfterBuyReq) => {
            const decryptedData = await AesDecrypt(resAfterBuyReq.data.payload);
            let decryptDataParse = JSON.parse(decryptedData);
            if (decryptDataParse.status) {
                console.log('Payment Request');
                console.log(decryptDataParse.data.transaction.transactionStatus);
                //SUCCESS
                if(decryptDataParse.data.transaction.transactionStatus == 'SUCCESS' || decryptDataParse.data.transaction.transactionStatus == 'FAILED'){
                    router.push('/dashboard');
                }
                // if(decryptDataParse.data.payment.success){
                //     let intentUrl = decryptDataParse.data.payment.instrumentResponse.intentUrl;
                //     console.log('intentUrl',intentUrl);
                // }
            }
            // setPreviewData(JSON.parse(decryptedData).data);
        }).catch((errInBuyReq) => {
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Oops...',
            //     text: 'Something went wrong!',
            // })
        })
    }

    const handleFocus = useCallback(() => {
        // Your code to handle when the tab receives focus (user returns)
        checkPaymentStatus();
      });
  

    const handleVisibilityChange = useCallback(() => {
        // setVisibilityState(document.visibilityState === 'visible');
       if(document.visibilityState == 'visible'){
   
            checkPaymentStatus();
       }
      }, []);

    useEffect(() => {
        
        window.addEventListener('focus', handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => {
            window.removeEventListener('focus', handleFocus);
          document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
        
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token')
        setToken(token);
        // funcApiOfPreview();


    }, [props.show])
    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }
    const funForAesEncrypt = async (dataToBeEncrypt) => {
        const response = await AesEncrypt(dataToBeEncrypt)
        return response;
    }

    const buyReqApiHandler = async () => {

        const dataToBeDecrypt = {
            orderType: props.isShow,
            item: props.isOn ? "GOLD" : "SILVER",
            unit: "AMOUNT",
            gram: props.gramIn,
            amount: props.rupeeIn,
            order_preview_id: props.transactionId,
            amountWithoutTax: props.rupeeIn / (+'1.03'),
            tax: "3",
            totalAmount: props.rupeeIn,
            couponCode: props.couponCode,
            itemMode: "DIGITAL",
            gst_number: props.gstNum,
            fromApp: false,
            payment_mode:'cashfree'
        }
        const resAfterEncryptData = await funForAesEncrypt(dataToBeDecrypt)
        const payloadToSend = {
            payload: resAfterEncryptData
        }
        const configHeaders = {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
        axios.post(`${process.env.baseUrl}/user/order/request`, payloadToSend, configHeaders).then(async (resAfterBuyReq) => {
            const decryptedData = await funcForDecrypt(resAfterBuyReq.data.payload);
            console.log('decryptedData',decryptedData);

            if (JSON.parse(decryptedData).status) {
                  
                setOrderId(JSON.parse(decryptedData).data.order.order_id);
                orderIdRef.current = JSON.parse(decryptedData).data.order.order_id;
                   console.log(orderIdRef.current);
                   console.log(JSON.parse(decryptedData).data.payment.data.payload.web);
                let paymentUrl = JSON.parse(decryptedData).data.payment.data.payload.web;
                window.open(paymentUrl, "_self", 'noopener');

                // console.log('Payment Request');s
                // console.log(JSON.parse(decryptedData).data);s
                // router.push(`payments/${JSON.parse(decryptedData).data.order._id}`);

                // let paymentOptions = {
                //     // paymentMethod: component,
                //     paymentSessionId: JSON.parse(decryptedData).data.paymentRequest,
                //     // returnUrl: "https://example.com?order={order_id}"
                // }
                // cashfree.pay(paymentOptions).then(function (result) {
                //     if(result.error) {
                //         //there is an error
                //         //message at result.error.message
                //         console.log('cashfreeerror',result.error.message);
                //     }
                //     if(result.redirect){
                //         //console.log("User would be redirected");
                //         console.log('cashfree redirected');
                //     }
                //     if(result.paymentDetails) {
                //         //only when redirect = 'if_required' for UPI payment
                //         //payment is successful 
                //         //message is at result.paymentDetails.paymentMessage
                //         console.log('cashfree payment response');
                //         console.log(result.paymentDetails);
                //         alert('response');
                //     }
                // });

                //     let paymentUrl = JSON.parse(decryptedData).data.payment.data.payload.web;
                // window.open(paymentUrl, "_self", 'noopener');
            //     let paymentUrl = JSON.parse(decryptedData).data.payment.instrumentResponse.redirectInfo.url;
            //     window.open(paymentUrl, "_self", 'noopener');
            }
            // setPreviewData(JSON.parse(decryptedData).data);
        }).catch((errInBuyReq) => {
            console.log(errInBuyReq);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        })

    }

    const getProgressWidth = () => {
        const percentage = (remainingTime / (5 * 60)) * 100;
        return `${percentage}%`;
    }

    const closeTheModal = () => {
        props.reset();
        props.onHide();
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (remainingTime > 0) {
                setRemainingTime(remainingTime - 1);
            } else {
                closeTheModal();
            }
        }, [1000]);

        return () => clearTimeout(timer);
    }, [remainingTime]);

    const getProgressColor = () => {
        if (remainingTime >= 180) {
            return styles.istColor;
        } else if (remainingTime >= 60) {
            return styles.secondColor;
        } else {
            return styles.thirdColor;
        }
    };

    const getTimeString = () => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop={false}
        >
            <div className='coupons_modal'>
                <Modal.Body>

                    <div className='d-flex justify-content-between align-items-center coupons_close'>
                        <div className='coupons'>Payment Breakup</div>
                        <div className='close' onClick={closeTheModal}><IoMdClose style={{ color: "#fff" }} /></div>
                    </div>

                    {/* <div className="countdown-container">
                        <div className="progress-bar" style={{ width: getProgressWidth() }} />
                        <div className="text-container">
                            <div className='low_buy_price'>Current Buy Price: <span style={{ fontWeight: 700 }}>₹{props.isOn ? props.goldPrice : props.silverPrice}</span></div>
                            <div className='valid_for'>Valid for: <CountDown onRestart={onRestart} timer={[hours, minutes, seconds]} /></div>
                        </div>
                    </div> */}
                    <div className={styles.progressBar}>
                        <div
                            className={`${styles.progressFill} ${getProgressColor()}`}
                            style={{
                                transition: 'width 1s linear'
                            }}

                        >
                            <div className="countdown-container">
                                <div className={`progress-bar`} style={{ width: getProgressWidth() }} />
                                <div className="text-container">
                                    <div className='low_buy_price'>Current Buy Price: <span style={{ fontWeight: 700 }}> ₹{props.isOn ? props.goldPrice : props.silverPrice}</span></div>
                                    <div className='valid_for'>Valid for: {getTimeString()}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {props.previewData?.map((item, idx) => {
                        return (
                            <>
                                <div key={idx} className='products_details'>
                                    <div className='left_data'>{item.key}</div>
                                    <div className='right_data'>{item.value}</div>
                                </div>
                            </>
                        )
                    })}


                    {/* <div className='products_details'>
                        <div className='left_data'> {props.isOn ? "Gold Value" : "Silver Value"}</div>
                        <div className='right_data'>₹ {props.rupeeIn}</div>
                    </div>
                    <div className='products_details'>
                        <div className='left_data'>Discount</div>
                        <div className='right_data'>₹ 0.00</div>
                    </div>
                    <div className='products_details'>
                        <div className='left_data'>Tax</div>
                        <div className='right_data'>₹ 3.00</div>
                    </div>
                    <div className='products_details'>
                        <div className='left_data'>GST</div>
                        <div className='right_data'>₹ 3.00</div>
                    </div>

                    <div className='border_details'></div>
                    <div className='products_details'>
                        <div className='left_data'>Total Amount</div>
                        <div className='right_data'>₹ 106.00</div>
                    </div>

                    <div className='safe_and_secure'>
                        <div className='left_data'><Image src={"/images/safe.png"} height={25} width={25} alt='safe' /></div>
                        <div className='safe_secure_text'>100% safe and secure</div>
                    </div> */}
                    <div className='tap_to_continue'>
                        <button className='button' onClick={buyReqApiHandler} >CONTINUE</button>
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
    )
}

export default BuyModal
