import React from 'react'
import style from './shippingPolicy.module.css'
import Image from 'next/image'
import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import CustomHead from '@/components/CustomHead'

const ShippingPolicy = () => {
    return (
        <div>
             <CustomHead title="Shipping Policy - Bright DiGi Gold" description="The Bright DiGi Gold Coin will be delivered to the customer’s doorstep within 12 working days." />
            <div className={style.shipping_bg}>
                <div className='container'>
                    <div className='row pt-5 pb-5'>
                        <h1 className={style.policy}>Shipping Policy</h1>
                        <div className='col-md-8 col-12'>
                            <div className={style.report}>
                                <h1>Delivery of Coins</h1>
                            </div>
                            <div className={style.shipping_policy}>
                                <p> The Gold will be delivered to the customer at the doorstep <span style={{ fontWeight: "bolder" }}>within 12 working days</span> from the
                                    date of placing the order.
                                </p>
                                <p> Deliveries are made only to the registered address of the customer. Please keep proof of identity
                                    ready at the time of delivery as it may be required for verification by the courier partner. If no
                                    one is available at the registered address to take delivery, delivery will be attempted at least one
                                    more time after which the package will be returned to the vault and the customer's balance will
                                    be credited back with the corresponding grams of gold. Shipping charges will be payable again
                                    as and when the customer asks for delivery.
                                </p>
                                <p>Customers are required to verify that the package has not been tampered with and is of
                                    acceptable quality. Once delivery has been taken by the customer, returns and refunds are not
                                    possible. All of our products are 100% certified and there should never be any problems with
                                    quality. In the unlikely event of any issues, please contact support@brightdigigold.com, we will
                                    investigate the matter to resolve any concerns or issues.
                                </p>

                            </div>

                        </div>
                        <div className='col-md-4 col-12 '>
                            <div className='d-flex align-items-center justify-content-center'>
                                <Image src={"/images/shippingPolicy.svg"} height={300} width={300} alt='about_the_company' />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.report} pb-5`}>
                        <h1>Digital Confirmation Report</h1>
                        <div className={style.report_desc}>
                            Once you effect a transaction on our platform, a confirmation message (on the transaction
                            committed) will immediately be sent to you through (email, platform and SMS). A trade
                            confirmation report will be available for download from the “your account” section on our
                            platform.<br />
                            We will also send this report and your holding details to your registered email within 24 hours.
                            For any questions or clarifications please contact us on support@brightdigigold.com.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShippingPolicy
