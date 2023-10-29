import React, { useEffect, useReducer, useState } from "react";
import Slider from 'react-slick';
import { FaQuoteLeft } from "react-icons/fa";
import styles from "./fullScreenSlider.module.css"
import Image from "next/image";
import LoginAside from '../loginAside/loginAside'
import { useRouter } from "next/router";
import { log } from "../logger";
const FullScreenSlider = () => {
    const router = useRouter();
    const [showAside, setShowAside] = useState(false);
    const [isShow, setIsShow] = useState("Order");
    const [currentStateTab, setCurrentStateTab] = useState("");
    const [toggleHeader, setToggleHeader] = useState(false);
    const handleShowAside = () => setShowAside(true);
    const handleCloseAside = () => setShowAside(false);
    var settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        cssEase: 'linear',
        arrows: false
    };
    const redirectTab = (activeTab) => {
        const token = localStorage.getItem('token')
        if (token) {
            router.push({
                pathname: activeTab
            })
            // setIsShow(activeTab)
        } else {
            setCurrentStateTab(activeTab);

            setShowAside(true);
            // const token = localStorage.getItem('token')
            // 
            // router.push({
            //     pathname: "/dashboard",
            //     query: activeTab
            // })

        }
    }
    const loginFirst = () => {

    }
    const redirectData = (data) => {
        if (data) {
            router.push({
                pathname: "/dashboard/" + currentStateTab
            })
        }
    }
    return <>
        <div className={`aside-backdrop ${showAside ? 'show' : ''}`} onClick={handleCloseAside} />
        <LoginAside show={showAside} onHide={handleCloseAside} redirectData={redirectData} toggleHeader={toggleHeader} setToggleHeader={setToggleHeader} />
        <div className={styles.slider_background}>
            {/* <div className='container'>
                <div className='row '>
                    <div className='col-12'> */}
            {/* <div className='heading dark-mode1'>
                            <h3 className='text-center'>Gold</h3>
                            <div className='text-border'></div>
                        </div> */}

            <div className={`${styles.full_Screen_slider} fullScreenSlider`}>
                <Slider  {...settings}>
                    <div className={styles.wave1}>
                        <div className={styles.stories_box}>
                            <div className="stories_img">
                                <Image src="/images/refer_and_earn.png" height={500} width={500} alt="stories img" />
                            </div>
                            <div className={styles.slider_content}>
                                <div className={styles.refer_and_earn}>Refer and Earn Rewards</div>
                                <div className={styles.slider_des}>Refer our Bright DiGi Gold app to your friends and family, and earn an extra 0.01gm of Gold as a reward. 
                                </div>
                                <div className={styles.refer_btn}>
                                    <button className="button" onClick={() => redirectTab('dashboard/referearn')}>Refer Now</button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={styles.wave1}>
                        <div className={styles.stories_box}>
                            <div className="stories_img">
                                <Image src="/images/gold_delivery_boy.png" height={500} width={500} alt="stories img" />
                            </div>
                            <div className={styles.slider_content}>
                                <div className={styles.refer_and_earn}>Gold delivery at your doorstep</div>
                                <div className={styles.slider_des}>With just a click away, you can now order your Digital Gold/Silver and get physical delivery of your purchase without any hassle. 
                                </div>
                                <div className={styles.refer_btn}>
                                    <button className="button" onClick={() => redirectTab('coins')}>Buy Now</button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={styles.wave1}>
                        <div className={styles.stories_box}>
                            <div className="stories_img">
                                <Image src="/images/gift_gold_web.png" height={300} width={300} alt="stories img" />
                            </div>
                            <div className={styles.slider_content}>
                                <div className={styles.refer_and_earn}>Gift Gold to Your Special Ones</div>
                                <div className={styles.slider_des}>Now you can gift certified and guaranteed 24k
                                <span style={{ color: "#EEC644" }}>(99.9%) Pure</span> Gold or <span style={{ color: "#C0C0C0" }}>(99.99%) Fine</span>  Silver to your special and loved ones.</div>
                                <div className={styles.refer_btn}>
                                    <button className="button" onClick={() => redirectTab('dashboard/gifting')}>Gift Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.wave1}>
                        <div className={styles.stories_box}>
                            <div className="stories_img">
                                <Image src="/images/get_reward_web.png" height={400} width={400} alt="stories img" />
                            </div>
                            <div className={styles.slider_content}>
                                <div className={styles.refer_and_earn}>Get Rewards</div>
                                <div className={styles.slider_des}>With the Bright DiGi Gold app you can now earn an extra 1.5% of Gold on your first purchase and grow your savings with us.</div>
                                <div className={styles.refer_btn}>
                                    <button className="button" onClick={() => redirectTab('dashboard/reward')}>Reward Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Slider>
            </div>
            <style>{`
            
            .slick-dots {
                position: absolute;
                bottom: 10px !important;
                display: block;
                width: 100%;
                padding: 0;
                margin: 0;
                list-style: none;
                text-align: center;
            }
            `}</style>
        </div>

    </>;
};

export default FullScreenSlider;
