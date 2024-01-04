import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image'
import React from 'react'
import style from './about.module.css'
import Testimonials from '@/components/testimonials/testimonials'
import { log } from '@/components/logger';
import CustomHead from '@/components/CustomHead';

const About = () => {
    return (
        <div>
             <CustomHead title="Buy, Sell and Gift Digital Gold Online-Bright Digi Gold"  description="Bright DiGi Gold allows you to Buy, Sell, Gift and Refer & Earn Digital Gold online conveniently and effectively."/>
            <div className={style.about_bg}>
                <div className='container'>
                    <div className='row pt-5 pb-5'>
                        <div className='col-md-8 col-12'>
                            <h1 className={style.about_the_company}>About the Company</h1>
                           
                        </div>
                        <div className='col-md-4 col-12 '>
                            <div className='d-flex align-items-center justify-content-center'>
                                <Image src={"/images/about.svg"} height={300} width={300} alt='about_the_company' />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.mission_bg}>
                    <div className='container'>
                        <h1>Our Mission</h1>
                        <div className='row '>
                            <div className='col-md-8 col-12'>
                                <div className={style.about_company}>
                                    At Bright DiGi Gold our mission is to provide our customers with a superior digital experience that
                                    enhances their financial well-being with commitment to transparency and accountability.
                                </div>
                                <div className={style.mission_points}>
                                    <ul>
                                        <li className='mt-3'>
                                            We strive to deliver assured and secure digital solutions that enable our customers to
                                            achieve their financial goals and reach their full potential.
                                        </li>
                                        <li>
                                            We specialize in a range of services providing our customers with buying of digital
                                            gold/silver, selling of digital gold/silver and physical delivery of their purchased gold/silver.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className='col-md-4 col-12 '>
                                <div className='d-flex align-items-center justify-content-center'>
                                    <Image src={"/images/mission.svg"} height={300} width={300} alt='about_the_company' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.vision_bg}>
                    <div className='container'>
                        <div className='row '>
                            <div className='col-md-4 col-12 '>
                                <div className='d-flex align-items-center justify-content-center mt-5'>
                                    <Image src={"/images/vision.svg"} height={330} width={330} alt='about_the_company' />
                                </div>
                            </div>
                            <div className='col-md-8 col-12'>
                                <h1>Our Vision</h1>
                                <div className={style.about_company}>
                                    Bright DiGi Gold has the vision to emerge as a leader in digital gold trade. We have a goal to have a
                                    perfect system by providing valuable and reliable investment solutions to all our customers.

                                </div>
                                <div className={style.mission_points}>
                                    <ul>
                                        <li className='mt-3'>
                                            To be a trusted and reputable brand recognized for our commitments to transparency,
                                            security and customer satisfaction.

                                        </li>
                                        <li>
                                            To make gold investment accessible to a wider range of people, helping them to diversify
                                            their investment portfolios and protect their wealth.

                                        </li>
                                        <li>
                                            We believe that building strong relationships with our customers is the key to achieving
                                            great results. We are friendly, approachable and dedicated to providing valuable products
                                            and services.

                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.why_digi_gold}>
                    <div className={style.why_digi_gold_text}>Why Bright DiGi Gold?</div>
                    <div className='container'>
                        <div className='row mt-5'>
                            <div className='col-md-4 col-12 text-center mb-4'>
                                <div className={style.assured_heading}>*Assured Purity
                                </div>
                                <div className={style.assured_text}>Bright DiGi Gold ensures quality with purity. We assure you with 24 karat 99.9% Pure Gold and
                                    99.99% Fine Silver, as we procure the Gold and Silver directly from the manufacturer and not
                                    mediators, avoiding additional cost.</div>
                                <div className={style.assured_border}></div>
                            </div>
                            <div className='col-md-4 col-12  mb-4'>
                                <div className={style.liquidity_heading}>*High Liquidity</div>
                                <div className={style.assured_text}>Gold is a precious metal which can be easily converted into liquid money. Your purchased Digital
                                    tokens can simply be traded and provide users with great liquidity and flexibility.
                                </div>
                            </div>
                            <div className='col-md-4 col-12  mb-4'>
                                <div className={style.investment_heading}>*Low Investment</div>
                                <div className={style.assured_text}>Bright DiGi Gold provides you with a budget friendly cost of just Rs. 10/-. making it an affordable
                                    way to invest in Digital Gold.
                                </div>
                            </div>
                            <div className={style.security_transparency}>
                                <div className='col-md-4 col-12'>
                                    <div className={style.security_heading}>*Verified Security</div>
                                    <div className={style.assured_text}>We store Physical Gold in secure and audited vaults, ensuring the safety and authenticity of Gold
                                        backed by the coins.</div>
                                </div>
                                <div className='col-md-4 col-12'>
                                    <div className={style.transparency_heading}>*Transparency
                                    </div>
                                    <div className={style.assured_text}>With Bright DiGi Gold you don’t have to worry about hidden charges or fees because the process
                                        of investment is transparent.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Testimonials />
            </div>
        </div>
    )
}

export default About
