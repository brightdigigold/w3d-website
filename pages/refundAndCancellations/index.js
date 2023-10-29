import React from 'react'
import style from './refund.module.css'
import Image from 'next/image'
import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import CustomHead from '@/components/CustomHead'

const RefundAndCancellation = () => {
    return (
        <div>
             <CustomHead title="Refund & cancellation - Bright DiGi Gold" description=" Buying and Selling of Digital Gold through Bright DiGi Gold are governed by the standard refund and cancellation policy." />
            <div className={style.refund_bg}>
                <div className='container'>
                    <div className='row pt-5 pb-5'>
                        <h1 className={style.cancellations}>Refunds and Cancellations</h1>
                        <div className='col-12'>

                            <div className={style.refund_and_cancellations}>
                                <p>Buying and Selling of the Digital Gold and Silver through Bright DiGi Gold platform are governed by the standard refund and cancellation policy as under:
                                </p>
                            </div>
                            <div className={style.mission_points}>
                                <ol>
                                    <li className='mt-3'>
                                        When a transaction for the buying and selling of digital gold and silver has been completed on our platform, refunds and cancellations are not permitted. Once an order has been placed, it is considered to be final.
                                    </li><br />
                                    <li>
                                        After the successful completion of the buy transaction, there is a lock-in period of 48 hours and the customer can initiate the sale after 48 hours. Please note that all inclusive charges will be applicable on each of these transactions.
                                    </li><br />
                                    <li>
                                        If any amount deducted from the customer's account that was unsuccessfully processed as a result of technical difficulties on our end will be returned (to the customer's bank account) in 4 to 5 working days.  The customer is responsible for handling any technical issues that might happen and impact the transaction.

                                    </li><br />

                                    <li>
                                        Customers whose accounts have been debited due to fraudulent transactions must file a complaint with the cyber cell and share a copy of that complaint with us at <span style={{ color: "#0d6efd" }}>support@brightdigigold.com </span> within 48 hours of the transaction. The company has no responsibility for any losses incurred and in the event that a refund is necessary, it will be processed based on the Selling Price displayed  on our App and Web. Please note that the refund process may require 10 to 15 working days.

                                    </li><br />

                                </ol>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default RefundAndCancellation
