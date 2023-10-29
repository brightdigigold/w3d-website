import React, { useState, useRef } from 'react'
import { MdEdit } from 'react-icons/md'
import { useEffect } from 'react'
import Link from 'next/link';
import axios from "axios";
import { AesEncrypt, AesDecrypt,fixDecimalDigit } from '../../components/middleware';
import style from './dashboardDetails.module.css'
import { saveAs } from 'file-saver';
import { format } from "date-fns";
import moment from 'moment';
import { log } from "../logger";

const Orders = (props) => {
    
    // 
    log('props?.orderDetails',props?.orderDetails);
    const OrderDate = moment(props?.orderDetails.createdAt).format('YYYY-MM-DD hh:mm A');
    const downloadInvoice = (url) => {
        
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const blobURL = window.URL.createObjectURL(new Blob([blob]))
                const aTag = document.createElement('a');
                aTag.href = blobURL;
                aTag.setAttribute("downlaod", 'invoice.pdf')
                document.body.appendChild(aTag);
                aTag.click();
                aTag.remove
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };

    return (
        <div>
            <div className={style.orders_bg}>

                <div className='p-1'>
                    <div className='container'>
                        <div className={`${style.orders_border} row`}>
                            <div className={`${style.left_text} col-6`}>Order Number :</div>
                            <div className={`${style.right_text} col-6`}>{props?.orderDetails.order_id}</div>
                        </div>
                        <div className={`${style.orders_border} row`}>
                            <div className={`${style.left_text} col-6`}>Order Date :</div>
                            <div className={`${style.right_text} col-6`}>{OrderDate}</div>
                        </div>
                        <div className={`${style.orders_border} row`}>
                            <div className={`${style.left_text} col-6`}>Order Status :</div>
                            <div className={`${style.right_text} col-6`}>{props?.orderDetails.status}</div>
                        </div>
                        <div className={`${style.orders_border} row`}>
                            <div className={`${style.left_text} col-6`}>Transaction Type :</div>
                            <div className={`${style.right_text} col-6`}>{props?.orderDetails.orderType == 'PRODUCT'?'COINS':props?.orderDetails.orderType}</div>
                        </div>
                        {props?.orderDetails.orderType == 'PRODUCT' && 
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Product Name :</div>
                                <div className={`${style.right_text} col-6`}>24K {`${props?.orderDetails?.product_id?.name}`}</div>
                            </div>
                        }
                         {props?.orderDetails.orderType != 'PRODUCT' && 
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Product Name :</div>
                                <div className={`${style.right_text} col-6`}>24K {`${props?.orderDetails?.itemType}`}</div>
                            </div>
                        }
                         <div className={`${style.orders_border} row`}>
                            <div className={`${style.left_text} col-6`}>Rate per Grams :</div>
                            <div className={`${style.right_text} col-6`}>{fixDecimalDigit(props?.orderDetails?.pricePerGram,2)}</div>
                        </div>
                        {
                            props?.orderDetails?.orderType == 'REWARD' &&
                            <>
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Promotional {props?.orderDetails?.itemType} :</div>
                                <div className={`${style.right_text} col-6`}>{fixDecimalDigit(props?.orderDetails?.gram,4)}</div>
                            </div>
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Parent Order Id:</div>
                                <div className={`${style.right_text} col-6`}>{props?.orderDetails?.parentOrder?.order_id}</div>
                            </div>
                            </>
                        }
                         {
                            props?.orderDetails?.orderType != 'REWARD' && props?.orderDetails?.orderType != 'SELL' && props?.orderDetails?.orderType != 'GIFT' &&
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Purchase Weight :</div>
                                <div className={`${style.right_text} col-6`}>{fixDecimalDigit(props?.orderDetails?.gram,4)}</div>
                            </div>
                        }
                         {
                            props?.orderDetails?.orderType == 'GIFT' &&
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Gift Weight :</div>
                                <div className={`${style.right_text} col-6`}>{fixDecimalDigit(props?.orderDetails?.gram,4)}</div>
                            </div>
                        }
                         {
                            props?.orderDetails?.orderType == 'SELL' &&
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Sold Weight :</div>
                                <div className={`${style.right_text} col-6`}>{fixDecimalDigit(props?.orderDetails?.gram,4)}</div>
                            </div>
                        }
                        {props?.orderDetails?.orderType != 'REWARD' && props?.orderDetails?.vaultGram > 0 &&
                         <div className={`${style.orders_border} row`}>
                            <div className={`${style.left_text} col-6`}> {props?.orderDetails?.extraGramType} Vault Weight :</div>
                            <div className={`${style.right_text} col-6`}>{fixDecimalDigit(props?.orderDetails?.vaultGram,4)}</div>
                        </div>
                        }
                        {props?.orderDetails?.extraGramType && 
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}> {props?.orderDetails?.extraGramType} Reward :</div>
                                <div className={`${style.right_text} col-6`}>{fixDecimalDigit(props?.orderDetails?.extraGram,4)}</div>
                            </div>
                        }
                        { props?.orderDetails?.couponCode && 
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Coupon Code :</div>
                                <div className={`${style.right_text} col-6`}>{props?.orderDetails?.couponCode}</div>
                            </div>
                        }
                        { props?.orderDetails?.couponGram > 0 &&
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Coupon Weight :</div>
                                <div className={`${style.right_text} col-6`}>{fixDecimalDigit(props?.orderDetails?.couponGram,4)}</div>
                            </div>
                        }
                        {props?.orderDetails?.totalGram > 0 &&
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Total {props?.orderDetails?.itemType} Weight :</div>
                                <div className={`${style.right_text} col-6`}>{fixDecimalDigit(props?.orderDetails?.totalGram,4)}</div>
                            </div>
                        }
                        {(props?.orderDetails?.address?.state == 'Delhi'  && (props?.orderDetails?.orderType == 'PRODUCT')) && 
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Applied Tax :</div>
                                <div className={`${style.right_text} col-6`}>
                                    <div>(1.5% CGST + 1.5% SGST)</div>
                                </div>
                            </div>
                        }
                         {(props?.orderDetails?.address?.state != 'Delhi' && (props?.orderDetails?.orderType == 'PRODUCT')) && 
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Applied Tax :</div>
                                <div className={`${style.right_text} col-6`}>
                                    <div>(1.5% CGST + 1.5% SGST)</div>
                                </div>
                            </div>
                        }
                        {props?.orderDetails?.orderType == 'BUY' && 
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Applied Tax :</div>
                                <div className={`${style.right_text} col-6`}>
                                    <div>(1.5% CGST + 1.5% SGST)</div>
                                </div>
                            </div>
                        }
                         {(props?.orderDetails.orderType == 'BUY' || props?.orderDetails.orderType == 'PRODUCT') && 
                          <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Tax Amount:</div>
                                <div className={`${style.right_text} col-6`}>
                                    <div>₹ {fixDecimalDigit(props?.orderDetails?.taxableAmount,2)}</div>
                                </div>
                            </div>
                        }
                        {(props?.orderDetails.orderType == 'PRODUCT') && 
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Making Charges (Incl. GST) :</div>
                                <div className={`${style.right_text} col-6`}>
                                    <div>₹ {fixDecimalDigit(props?.orderDetails?.makingcharges,2)} </div>    
                                </div>
                            </div>
                        }
                        {(props?.orderDetails?.orderType == 'BUY' || props?.orderDetails?.orderType == 'SELL'  || props?.orderDetails?.orderType == 'PRODUCT' ) &&
                        <div className={`${style.orders_border} row`}>
                            <div className={`${style.left_text_total} col-6`}>Total Invoice Value :</div>
                            <div className={`${style.right_text_total} col-6`}>₹ {fixDecimalDigit(Number(props?.orderDetails?.totalAmount),2)}</div>
                        </div>
                        }

                        { props?.orderDetails?.orderType == 'GIFT' && props?.orderDetails?.gifting_id?.acceptedBy?._id != props?.orderDetails?.user_id && 
                        <>
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Gifted To :</div>
                                <div className={`${style.right_text} col-6`}>{props?.orderDetails?.gifting_id?.acceptedBy?.name}</div>
                            </div>

                        </>
                        }

                        { props?.orderDetails?.orderType == 'GIFT' && props?.orderDetails?.gifting_id?.acceptedBy?._id == props?.orderDetails?.user_id && 
                        <>
                            
                            <div className={`${style.orders_border} row`}>
                                <div className={`${style.left_text} col-6`}>Gifted By :</div>
                                <div className={`${style.right_text} col-6`}>{props?.orderDetails?.gifting_id?.giftingBy?.name}</div>
                            </div>

                        </>
                        }


                        {/* <div className={style.bill}>Bill To :</div>
                        <div className='row mt-2'>
                            <div className={`${style.left_text} col-6`}>Name : </div>
                            <div className={`${style.right_text} col-6`}>User</div>
                        </div> */}
                    </div>
                    
                    {props?.orderDetails?.status == 'SUCCESS' && props?.orderDetails?.challanUrl &&
                        <div className={style.download_challan}>
                            <button type="submit"><Link target='_blank' className='invoiceDownload' href={props?.orderDetails?.challanUrl}>Download Challan</Link></button>
                        </div>
                    }
                    {props?.orderDetails?.status == 'SUCCESS' && props?.orderDetails?.invoiceUrl &&
                        <div className={style.download_invoice}>
                            <button type="submit"><Link target='_blank' className='invoiceDownload' href={props?.orderDetails?.invoiceUrl}>Download Invoice</Link></button>
                        </div>
                    }
                </div>


            </div>
        <style>{`
        a:hover{
            color:#fff
        }
        
        `}</style>
        </div>
    )
}

export default Orders
