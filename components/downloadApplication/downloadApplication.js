    import React from 'react'
import style from './downlaoadApplication.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { log } from "../logger";
import { Router, useRouter, useState } from 'next/router'

const DownloadApplication = () => {
    const router = useRouter();
    const [activeItem, setActiveItem] = React.useState(0);

    const handleClick = (index) => {
        setActiveItem(index);
    };
    function scrollToElement1() {
        const element = document.getElementById("selectedApp");
        element.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
    function scrollToElement2() {
        const element = document.getElementById("selectedApp");
        element.scrollTo({
            top: 300,
            left: 0,
            behavior: "smooth",
        });
    }
    function scrollToElement3() {
        const element = document.getElementById("selectedApp");
        element.scrollTo({
            top: 600,
            left: 0,
            behavior: "smooth",
        });
    }
    return (
        <div>
            <div className={style.mobile_google_application}>
                <div className='container scroll'>
                    <div className={style.mobile_and_application}>
                        <div className={style.mobile_border}>
                            <div className={style.inner_mobile}>
                                <div className={style.mobile_header}>
                                    <div className={style.mobile_time}>9:41</div>
                                    <div className={style.mobile_battery_side}>
                                        <Image src={"/images/Cellular Connection.svg"} height={30} width={30} alt='Cellular' />
                                        <Image src={"/images/Wifi.svg"} height={30} width={30} alt='Wifi' />
                                        <Image src={"/images/Battery.svg"} height={30} width={30} alt='Battery' />
                                    </div>
                                </div>
                                <div className={style.pure_gold} id="selectedApp">
                                    <Image src={"/images/1.svg"} id="myElement1"  height={250} width={450} alt='1' />
                                    <Image src={"/images/2.svg"} id="myElement2" height={250} width={450} alt='2' />
                                    <Image src={"/images/3.svg"} id="myElement3" height={250} width={450} alt='3' />
                                </div>
                            </div>
                        </div>
                        <div >
                            <div className={`${style.application} download-list`}>
                                <ul>
                                    <li
                                        className={activeItem === 0 ? 'activeItem' : ''}
                                        onClick={() => handleClick(0)}
                                    >
                                        <Image src={"/images/pure.svg"} height={120} width={120} onClick={scrollToElement1} className={activeItem === 0 ? 'activeItem' : 'inactive'} alt='99pure' />
                                    </li>
                                    <li
                                        className={activeItem === 1 ? 'activeItem' : ''}
                                        onClick={() => handleClick(1)}
                                    >
                                        <Image src={"/images/gold-karet.svg"} height={85} width={85} onClick={scrollToElement2} className={activeItem === 1 ? 'activeItem' : 'inactive'} alt='24karat' />
                                    </li>
                                    <li
                                        className={activeItem === 2 ? 'activeItem' : ''}
                                        onClick={() => handleClick(2)}
                                    >
                                        <Image src={"/images/secure_bann.svg"} height={120} width={120} onClick={scrollToElement3} className={activeItem === 2 ? 'activeItem' : 'inactive'} alt='secure' />
                                    </li>
                                </ul>
                            </div>
                            <div className={style.download_application}>Download Our App</div>
                            <div className={style.download_btn+ ' flex-md-column flex-lg-row'}>
                                <div className={style.google_play}>
                                    <Link href="https://play.google.com/store/apps/details?id=com.brightdigigold.customer" target='_blank'>
                                        <Image src={"/images/playstore.svg"} height={150} width={400}  alt='google_play' />
                                    </Link>
                                </div>
                                <div className={style.apple_play}>
                                    <Link href="https://apps.apple.com/in/app/bright-digi-gold-buy-24k-gold/id1640972173" target='_blank'>
                                        <Image src={"/images/appstore.svg"} height={150} width={400}  alt='apple_play' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <style>{`
         .download-list {
            display: flex;
            justify-content: center;
            align-items: center;
        }
         .download-list   ul {
          list-style: none;
          display: flex;
          padding-left:0px !important;
        }
        .download-list li {
          margin-right: 20px;
          border-right: 2px solid #ccc;
          padding-right: 20px;
        }
        .download-list ul li{
            opacity: 0.5;
            border-right: 2px solid black;
        }
        .download-list .activeItem {
          opacity: 1;
          cursor:pointer;
        }
        .download-list .inactive {
          opacity: 0.5;
          cursor:pointer;
        }
        .scroll ::-webkit-scrollbar {
        display:none;
        }
            `}</style>
        </div>
    )
}

export default DownloadApplication
