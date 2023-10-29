import React from 'react'
import Image from 'next/image'
import style from './footer.module.css'
import { FaLinkedinIn, FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md'
import Link from 'next/link';
import { log } from "../logger";

const Footer = () => {
    return (
        <div>
            <div className={`${style.footer_background}`}>
                <div className='container'>
                    <div className='row ' >
                        <div className={`${style.footer_content} col-md-9 col-9 mt-5`}>
                            <div className={style.content}>
                                <div className={style.gold_img}>
                                   <Link href={'/'}><Image src="/images/bdg_logo_large.png" height={200} width={200} alt='gold-logo' /></Link>
                                </div>
                                <div className={style.gold_img_content}>
                                    Bright Digi Gold stands as the most trusted partner known for providing a platform for buying, selling and exchange of 24K Gold with the guarantee of purity in its digital form.
                                </div>
                            </div>
                            <div className='container'>
                                <div className={`${style.footer_link} row  mt-5`}>
                                    <div className='col-md-4 col-6 p-0'>
                                        <p><Link href={'/'}>Home</Link></p>
                                        <p><Link href={'/about'}>About Us </Link></p>
                                        <p><Link href={'/contact'}>Contact Us</Link></p>
                                        <p><Link href={'/refundAndCancellations'}>Refunds & Cancellations</Link></p>
                                    </div>
                                    <div className='col-md-4 col-6 p-0'>
                                        <p> <Link href={'/termsAndConditions'}>Terms and Conditions</Link></p>
                                        <p><Link href={'/privacy-policy'}>Privacy Policy</Link></p>
                                        <p><Link href={'/shippingPolicy'}>Shipping Policy</Link></p>
                                        <p><Link href={'/blogs'}>Blogs</Link></p>
                                        <p><Link href={'/faqs'}>FAQS</Link></p>

                                    </div>
                                    <div className='col-md-4 col-12'>
                                        <div className={style.msg_location}>
                                            
                                            <div className=''><MdEmail style={{ color: "#fff" }} /></div>
                                            <div className={style.email_location}>Contact@brightdigigold.com</div>
                                        </div>
                                        <div className={`${style.msg_location} mt-3`}>
                                            <div className=''><MdLocationOn style={{ color: "#fff" }} /></div>
                                            <div className={style.contact_location}>501, 5th Floor, World Trade Center,Babar Road, New Delhi - 110001</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.communication} col-3  mt-4`}>
                            <div className={style.communication_medium}>
                                <div className={style.linkedin}>
                                    <Link target='_blank' href={'https://www.linkedin.com/company/brightdigigold/'}><FaLinkedinIn style={{ width: "30px", height: "30px", color: "#fff" }} /></Link></div>
                                <div className={style.instagram}>
                                    <Link target='_blank' href={'https://www.instagram.com/brightdigigold/'}><FaInstagram style={{ width: "30px", height: "30px", color: "#fff" }} /></Link></div>
                                <div className={style.twitter}>
                                    <Link target='_blank' href={'https://twitter.com/BrightDiGiGold'}><FaTwitter style={{ width: "30px", height: "30px", color: "#fff" }} /></Link></div>
                                <div className={style.facebook}>
                                    <Link target='_blank' href={'https://www.facebook.com/brightdigigold'}><FaFacebookF style={{ width: "30px", height: "30px", color: "#fff" }} /></Link></div>
                            </div>
                        </div>
                        <div className={style.copy_right}>© BrightDiGiGold. All rights reserved.</div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer
