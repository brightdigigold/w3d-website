'use client'
import { RootState } from '@/redux/store';
import React from 'react'
import { useSelector } from 'react-redux';
import OtpModal from '../modals/otpModal';

const ShippingPolicy = () => {
    const otpModal = useSelector((state: RootState) => state.auth.otpModal);

    return (
        <div className="text-gray-100">
            {otpModal && <OtpModal />}

            <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 pb-28 xl:pb-16 pt-32">
                <div className="container">
                    <div className="row pt-5 pb-5">
                        <div className=" sm:flex justify-between items-center text-center sm:text-left">
                            <h5 className="text-2xl sm:text-7xl mb-4 extrabold text-white">
                                Shipping Policy
                            </h5>
                            <img src="/lottie/Shipping Policy.gif" className="" />
                        </div>
                        <div className="col-md-8 col-12">
                            <div className="">
                                <p className="text-2xl sm:text-4xl my-4  mt-6 extrabold text-gold01">
                                    Delivery of Coins
                                </p>
                            </div>
                            <div className="text-lg text-white">
                                <p className="mb-3 leading-8  ">
                                    {" "}
                                    The Gold will be delivered to the customer at the doorstep{" "}
                                    <span style={{ fontWeight: "bolder" }}>
                                        within 12 working days
                                    </span>{" "}
                                    from the date of placing the order.
                                </p>
                                <p className="mb-3 leading-8  ">
                                    {" "}
                                    Deliveries are made only to the registered address of the
                                    customer. Please keep proof of identity ready at the time of
                                    delivery as it may be required for verification by the courier
                                    partner. If no one is available at the registered address to
                                    take delivery, delivery will be attempted at least one more
                                    time after which the package will be returned to the vault and
                                    the customer's balance will be credited back with the
                                    corresponding grams of gold. Shipping charges will be payable
                                    again as and when the customer asks for delivery.
                                </p>
                                <p className="mb-3 leading-8  ">
                                    Customers are required to verify that the package has not been
                                    tampered with and is of acceptable quality. Once delivery has
                                    been taken by the customer, returns and refunds are not
                                    possible. All of our products are 100% certified and there
                                    should never be any problems with quality. In the unlikely
                                    event of any issues, please contact
                                    support@brightdigigold.com, we will investigate the matter to
                                    resolve any concerns or issues.
                                </p>
                            </div>
                        </div>
                        {/* <div className="col-md-4 col-12 ">
            <div className="d-flex align-items-center justify-content-center">
              <Image
                src={"/images/shippingPolicy.svg"}
                height={300}
                width={300}
                alt="about_the_company"
              />
            </div>
          </div> */}
                    </div>
                    <h5 className="text-2xl sm:text-4xl my-4  mt-6 extrabold text-gold01">
                        Digital Confirmation Report
                    </h5>
                    <p className="text-lg text-white leading-8  ">
                        Once you effect a transaction on our platform, a confirmation
                        message (on the transaction committed) will immediately be sent to
                        you through (email, platform and SMS). A trade confirmation report
                        will be available for download from the “your account” section on
                        our platform.
                        <br />
                        We will also send this report and your holding details to your
                        registered email within 24 hours. For any questions or
                        clarifications please contact us on support@brightdigigold.com.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ShippingPolicy