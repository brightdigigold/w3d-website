'use client'
import Link from 'next/link'
import React from 'react'
import OtpModal from '../modals/otpModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const PrivacyPolicy = () => {
    const otpModal = useSelector((state: RootState) => state.auth.otpModal);

    return (
        <div>
            {otpModal && <OtpModal />}
            <div className="mx-auto px-4 sm:px-6 lg:px-16  py-16 pb-28 xl:pb-8 pt-32">
                <div className="container">
                    <div className="row pt-5 pb-5">
                        <div className=" sm:flex justify-between items-center text-center sm:text-left">
                            <h1 className="text-2xl sm:text-7xl mb-4   extrabold text-white text-center">
                                Privacy Policy
                            </h1>
                            <img src="/lottie/Privacy Policy.gif" className="" />
                        </div>
                        <div className="col-12 text-lg">
                            <div className=" text-white">
                                <p className="mb-3 leading-8  ">
                                    The following Privacy Policy is integrated by reference into
                                    the Bright DiGi Gold - Terms of Service (referred to as the
                                    "Terms"). The website <Link style={{ color: "#0d6efd" }} href='https://www.brightdigigold.com/'>https://www.brightdigigold.com/</Link> and/or
                                    the mobile application <Link style={{ color: "#0d6efd" }} href="https://l.instagram.com/?u=https%3A%2F%2Fsig1e.app.link%2FBDG-IND&e=AT1PK-e1JGw-ucHkvuy4ctVuUdLhzA4pmFf3W41RMpfQ5LGmiuCoyOXS2yyauWXECpYZr9kOXtJnFZuDsPvv_pnxuk7YtjYMrAE3hJusxedZSoji2SZZzJo">Bright DiGi Gold</Link> (collectively
                                    referred to as the "Platform") is owned and operated by a
                                    private limited company with its registered office located at
                                    ‘World Trade Centre, 501-503 5th Floor, Fire Brigade Lane
                                    Barakhamba Road, New Delhi - 110001’. This entity includes its
                                    affiliates and group entities, collectively denoted as the
                                    "Company," "We," "Us," or "Our."
                                </p>
                                <p className="mb-3 leading-8  ">
                                    This Privacy Policy is relevant to all Users whose Personal
                                    Information has been processed by Us in the course of our
                                    business operations, mobile applications, forums, blogs, and
                                    other online or offline offerings.
                                </p>
                                <p className="mb-3 leading-8  ">
                                    We hold your privacy in high regard and consequently manage
                                    your personal data with the utmost care and confidentiality.
                                    We kindly ask you to review the Privacy Policy thoroughly
                                    before using or registering on the Platform, or
                                    accessing/using the services on the Platform.
                                </p>
                                <p className="mb-3 leading-8  ">
                                    This pertains particularly to transactions involving the
                                    purchase, sale, or transfer of Digital Gold from a brand named
                                    "Bright DiGi Gold," which is operated and managed by "Bright
                                    Digital Gold Private Limited," hereinafter referred to as
                                    "Bright DiGi Gold." This company is incorporated under the
                                    laws of India, offering the mentioned "Services."
                                </p>
                                <p className="mb-3 leading-8  ">
                                    This Privacy Policy details the procedures related to the
                                    collection, reception, storage, processing, disclosure,
                                    transfer, handling, or any other treatment of personal data
                                    and other information by the Company. It's important to note
                                    that this Privacy Policy does not extend to information
                                    provided by You or collected by any third-party (excluding the
                                    Company or its affiliates mentioned in paragraph 4 below)
                                    through the Platform. Additionally, it excludes any
                                    Third-Party Sites that You may access or use in connection
                                    with the services provided on the Platform. When you access
                                    the Platform, You ("You" or "Your") acknowledge and agree to
                                    be bound by the terms and conditions outlined in this privacy
                                    policy ("Privacy Policy"). Furthermore, this Privacy Policy is
                                    an integral part of and subject to the terms of use of the
                                    Platform ("Terms").
                                </p>
                                <p className="mb-3 leading-8  ">
                                    We encourage you to read this Privacy Policy along with any
                                    other privacy policies or fair processing warnings that we may
                                    offer on specific occasions or when collecting or processing
                                    Your Personal Information. This will ensure that You have a
                                    complete understanding of how and why we utilize Your Personal
                                    Information. Additionally, we strongly advise you to review
                                    the terms and privacy policy of Bright DiGi Gold, accessible
                                    at https://www.brightdigigold.com/privacy-policy.Please note
                                    that this privacy notice is complementary to other notices and
                                    policies and is not intended to replace them.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    Collection of Information
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    To facilitate the provision of our services, we gather, use,
                                    and process your personal information, including sensitive
                                    details. The collection and handling of various types of
                                    personal information, whether directly from you or through
                                    third-party sources, depend on the nature of your relationship
                                    with the Company and the requirements of relevant laws.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* INFORMATION PROVIDED BY YOU */}
                                    Information Provided by You
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    When you register on our Platform to access our services, we
                                    collect your personal information, including sensitive data
                                    like name, mobile number, email address, password, date of
                                    birth, and gender.This information is used to authenticate
                                    your account, secure our services, prevent spam and fraud, and
                                    personalize your experience. By providing your phone number
                                    and email address, you agree to receive text messages from
                                    Bright DiGi Gold.{" "}
                                </p>
                                <p className="mb-3 leading-8  ">
                                    Additionally, when you engage in transactions exceeding Rs.
                                    2000, we may collect your KYC information, such as PAN card
                                    details, for authentication purposes.Financial information,
                                    including billing address, bank account details, credit card
                                    numbers, and payment-related data, might be requested for
                                    payment processing. Such transactions are managed by
                                    third-party service providers.
                                </p>
                                <p className="mb-3 leading-8  ">
                                    If you post messages, chat room conversations, or feedback, we
                                    collect and retain that information for dispute resolution,
                                    customer support, and service improvement.Correspondence you
                                    send us, as well as messages from third parties regarding your
                                    activities on the Platform, are stored to address your queries
                                    and concerns.
                                </p>
                                <p className="mb-3 leading-8  ">
                                    We may request additional information on a case-by-case basis.
                                    All information you disclose is considered voluntary, and we
                                    aren't responsible for its authenticity or accuracy.You have
                                    the right to edit, modify, review, or delete any information,
                                    including sensitive data, you provide to us.
                                </p>

                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* AUTOMATED COLLECTED INFORMATION */}
                                    Automated Collected Information
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    Apart from directly providing information, we also collect
                                    data you share with "Bright DiGi Gold" and other third parties
                                    who provide services and technological support through APIs
                                    and other means. This information is used to enrich our
                                    database and services.
                                </p>

                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* USAGE AND LOG INFORMATION */}
                                    Usage and Log Information
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    Our servers collect data about your visit, such as browser
                                    type, operating system, IP address, domain name, and visit
                                    timestamp. We use this data to analyze traffic patterns and
                                    customer behaviour, enhance our services, and improve user
                                    experience.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* LOCATION INFORMATION */}
                                    Location Information
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    If you use our Platform on a mobile device, we might receive
                                    your location information and IP address, allowing us to
                                    provide location-based services.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* THIRD-PARTY INFORMATION AND COOKIES */}
                                    Third-Party Information and Cookies
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    We collect data about your interactions with third-party
                                    tracking technologies for security and connection integrity.
                                    Third-party services' data collection, use, storage, and
                                    disclosure are governed by their respective policies. Cookies
                                    and URL information also help us understand user behaviour and
                                    preferences.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* USE OF YOUR INFORMATION */}
                                    Use of Your Information
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    Your personal and non-personal information is used for various
                                    purposes:
                                    <ul>
                                        <li>Providing and improving requested services.</li>
                                        <li>Ensuring security and preventing abuse.</li>
                                        <li>
                                            Facilitating safe transactions and collecting payments.
                                        </li>
                                        <li>
                                            Sending information about offers, products, and updates.
                                        </li>
                                        <li>
                                            Customizing your experience and sharing marketing content.
                                        </li>
                                        <li>Communicating important notices about services.</li>
                                        <li>
                                            Enabling partners and affiliates to deliver custom
                                            messages.
                                        </li>
                                        <li>
                                            Processing transactions and responding to inquiries.
                                        </li>
                                    </ul>
                                </p>
                                <p className="mb-3 leading-8  ">
                                    You may provide explicit consent to integrate your email or
                                    registered mobile number with the Platform for enhanced
                                    functionality. This data is used to consolidate investment
                                    details and improve your experience.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* SHARING OF INFORMATION */}
                                    Sharing of Information
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    We may share your information with partners, collaborators,
                                    and affiliates like "Bright DiGi Gold" to provide services.
                                    Personal data might be disclosed to third-party vendors,
                                    consultants, and service providers as required by law.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* SECURITY PRECAUTIONS AND MEASURES */}
                                    Security Precautions and Measures
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    We have security measures in place to protect your
                                    information, but we can't guarantee absolute security. You're
                                    responsible for ensuring data security on your end. While
                                    payment information is encrypted during transmission, we can't
                                    guarantee the security of all information due to various
                                    factors.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* DATA STORAGE AND RETENTION POLICY */}
                                    Data Storage and Retention Policy
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    We collect and store your data while providing services.
                                    Processed and non-identifiable data is stored perpetually.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    Manage External Storage
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    We may request permission to access and manage your device's
                                    external storage. This permission is used solely for the
                                    purpose of providing specific functionalities of the App, such
                                    as saving files or downloading content. We ensure that any
                                    data accessed from your external storage is used only for the
                                    intended purposes within the App and is not shared with third
                                    parties.
                                </p>
                                <p className="mb-3 leading-8  ">
                                    You have the choice to grant or deny permission for the App to
                                    access your external storage. You can modify this permission
                                    through your device settings at any time.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    Push Notifications
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    Our App may request permission to send push notifications to
                                    your device. Push notifications enhance your experience by
                                    providing relevant updates and information. We collect and
                                    process user-specific data, such as device tokens and user
                                    IDs, for the purpose of delivering personalized push
                                    notifications. This data is used only for sending
                                    notifications and is not shared with external parties.
                                </p>
                                <p className="mb-3 leading-8  ">
                                    Push notifications are optional and can be enabled or disabled
                                    within the App's settings or through your device settings. You
                                    can unsubscribe from receiving push notifications by adjusting
                                    your notification preferences.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* DISCLAIMER */}
                                    Disclaimer
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    We provide a distribution platform for "Bright DiGi Gold" and
                                    aren't liable for products/services provided. Investment
                                    decisions are solely your responsibility. Your feedback on
                                    Platform Services is requested after their use.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* YOUR PRIVACY RIGHTS */}
                                    Your Privacy Rights
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    Your visit to the Platform or account creation signifies
                                    acceptance of this Privacy Policy. You can withdraw consent or
                                    exercise privacy rights by contacting us. Changes to this
                                    Privacy Policy are effective immediately and should be
                                    reviewed regularly.
                                </p>
                                <h5 className="text-2xl sm:text-4xl my-4 mt-6 extrabold text-gold01">
                                    {/* GRIEVANCE REDRESSAL MECHANISM */}
                                    Grievance Redressal Mechanism
                                </h5>
                                <p className="mb-3 leading-8  ">
                                    If you have any concerns or grievances, you can reach our
                                    Grievance Office at the provided contact details.
                                </p>
                                <p className="mb-3 leading-8  ">
                                    <ul>
                                        <li>
                                            <b>E-mail ID:</b> <Link style={{ color: "#0d6efd" }} href="mailto:support@brightdigigold.com">support@brightdigigold.com</Link>
                                        </li>
                                        <li>
                                            <b>Address:</b> World Trade Centre, 501-503 5th Floor,
                                            Fire Brigade Lane Barakhamba Road, New Delhi - 110001
                                        </li>
                                    </ul>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy