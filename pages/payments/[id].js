import {useState,useEffect} from 'react'
import style from "./payments.module.css";
import Image from 'next/image'
import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import { log } from '@/components/logger';
import { IoMdClose } from 'react-icons/io';
import { BiTimeFive } from 'react-icons/bi';
import { AesDecrypt } from "@/components/middleware"
import axios from 'axios';
import Swal from 'sweetalert2';


export const getServerSideProps = async ({ query }) => {
    const transactionId = query.id;
    return {
        props: {
            transactionId,
        },
    };
};

const Payments = ({ transactionId }) => {

    const [upiApps, setUpiApps] = useState([]);
    
    // Get a list of all UPI apps installed on the user's device.
    useEffect(() => {
        console.log('transactionId',transactionId);

        const token = localStorage.getItem('token')
        // Check for window object to ensure client-side execution

        const configHeaders = {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
        axios.get(`${process.env.baseUrl}/user/upiorder/payment?transactionId=${transactionId}`, configHeaders).then(async (resAfterBuyReq) => {
            const decryptedData = await AesDecrypt(resAfterBuyReq.data.payload);
            let decryptDataParse = JSON.parse(decryptedData);
            if (decryptDataParse.status) {
                console.log('Payment Request');
                console.log(decryptDataParse.data);
                if(decryptDataParse.data.payment.success){
                    let intentUrl = decryptDataParse.data.payment.instrumentResponse.intentUrl;
                    console.log('intentUrl',intentUrl);
                }
            }
            // setPreviewData(JSON.parse(decryptedData).data);
        }).catch((errInBuyReq) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        })

    }, []);
    
    return (
        <>
            <div className={style.payment_page}>
                <div className='container'>
                    <div className='row d-flex justify-content-center'>
                        <div className={style.payment_window}>
                            <div className={style.payment_header}>
                                <div className='logo'>
                                    <Image src="/images/bdg_logo_large.png" width={120} height={58} />
                                </div>
                                <div className={style.close_button}>
                                    <IoMdClose />
                                </div>
                            </div>
                            <div className={style.payment_modes}>
                               {/* <div className={style.paywithupiqr}>
                                   <h3> Pay With UPI QR</h3>
                                   <div className={style.qr_box}>
                                        <div className={style.qr}>
                                            <Image src="https://cdn2.me-qr.com/qr/77695327.png?v=1695466770" width={160} height={160} />
                                        </div>
                                        <div className={style.supported_gateway}>
                                            <div className={style.qr_note}>
                                                <h4>Scan the QR using any UPI app on your phone</h4>
                                            </div>
                                            <div className={style.gateway_images}>
                                                <Image src="https://d2fbpyhlah02sy.cloudfront.net/icons/gpay.png" width={32} height={32}/>
                                                <Image src="https://d2fbpyhlah02sy.cloudfront.net/icons/phonpe.png" width={32} height={32}/>
                                                <Image src="https://d2fbpyhlah02sy.cloudfront.net/icons/paytm.png" width={32} height={32}/>
                                                <Image src="https://d2fbpyhlah02sy.cloudfront.net/icons/bhim.png" width={32} height={32}/>
                                            </div>
                                        </div>
                                   </div>
                               </div> */}
                               <div className={style.payment_upi}>
                                    <h3> Pay Via UPI</h3>
                                    <div className={style.qr_upi_box}>
                                            <div className={style.payupi_header}>
                                                    <div className='icon'><Image src="https://d2fbpyhlah02sy.cloudfront.net/icons/bhim.png" width={32} height={32}/></div>
                                                    <div className='heading'><h4>UPI</h4></div>
                                            </div>
                                            <div className={style.upi_options}>
                                                    <div className={style.upi_icon}>
                                                        <div className={style.upi_image}>
                                                            <Image src="https://d2fbpyhlah02sy.cloudfront.net/icons/gpay.png" width={40} height={40}/>
                                                        </div>
                                                        <div className={style.head}>
                                                            Google Pay
                                                        </div>
                                                    </div>
                                                    <div className={style.upi_icon}>
                                                        <div className={style.upi_image}>
                                                            <Image src="https://d2fbpyhlah02sy.cloudfront.net/icons/phonpe.png" width={40} height={40}/>
                                                        </div>
                                                        <div className={style.head}>
                                                            PhonePe
                                                        </div>
                                                    </div>
                                                    <div className={style.upi_icon}>
                                                        <div className={style.upi_image}>
                                                            <Image src="https://d2fbpyhlah02sy.cloudfront.net/icons/paytm.png" width={40} height={40}/>
                                                        </div>
                                                        <div className={style.head}>
                                                            PayTM
                                                        </div>
                                                    </div>
                                                    <div className={style.upi_icon}>
                                                        <div className={style.upi_image}>
                                                            <Image src="https://d2fbpyhlah02sy.cloudfront.net/icons/bhim.png" width={40} height={40}/>
                                                        </div>
                                                        <div className={style.head}>
                                                            Others
                                                        </div>
                                                    </div>
                                            </div>
                                    </div>
                               </div>
                            </div>
                            <div className={style.payment_footer}>
                                <div className={style.payment_timer}>
                                        <div className={style.pay_note}>
                                            <BiTimeFive/>&nbsp;<h6>This page will timeout in </h6>
                                        </div>
                                        <div className={style.timer}><p>4:01 <span>minutes</span></p></div>
                                </div>
                               <div className={style.payprice}>
                                <div className={style.price}>
                                            <h3>₹ 10</h3>
                                    </div>
                                    <div className={style.paynow}>
                                        <button className={`button ${style.paynow_button}`}>PAY NOW</button>
                                    </div>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className={style.model_shadow}></div> */}
                {/* <div className={style.cancel_payment}>
                    <div class={style.cancel_header}>
                            <h3>Cancel payment</h3>
                    </div>
                    <div class={style.cancel_body}>
                        <div className={style.cancel_content}>
                            <h6 className='text-center'>Your Payment is ongoing. Are you sure you want to cancel the payment?</h6>
                        </div>
                        <div className={style.modelbuttons}>
                            <button className='btn'> Yes, cancel</button>
                            <button className='btn'> No</button>
                        </div>
                        
                    </div>
                </div> */}
                {/* <div className={style.payment_process}>
                    <div className={style.process_heading}>
                        <h4>Your payment is being processed</h4>
                    </div>
                    <div className={style.process_image}>
                    <div className={style.ldsroller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div className={style.payment_cancel}>
                        <p>Cancel Payment</p>
                    </div>
                </div> */}
            </div>
            
        </>
    )
}
export default Payments