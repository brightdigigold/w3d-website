import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from "./investment.module.css"
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { log } from "../logger";

const Investment = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevCount) => prevCount + 1);
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, []);
    var settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        cssEase: 'linear',
        arrows: false
    };
    return (
        <div>
            <div className={styles.investment_bg}>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6 col-12'>
                            <div className={styles.investment_heading}>
                                Succession of Gold<br />
                                Investment in years
                            </div>
                            <div className={styles.investment_text}>
                            Over the years, Gold has proven to be a stable Investment, and it has shown stable consistency and growth in value. While there have been fluctuations in Gold Prices, its long-term trend has always been upwards.
                                <br /> <br />
                                With Bright DiGi Gold, investing in Gold has been considered as a smart investment choice for those looking to diversify their investment portfolio and protect their wealth.
                            </div>
                        </div>
                        <div className='col-md-6 col-12'>
                            <div className={`${styles.investment_image} investment`}>
                                <object type="image/svg+xml" data="/images/growth_v1.svg">svg-animation</object>
                                {/* <Image src={`https://static.countrygame.live/test/growth_v1.svg?url`} height={500} width={450} alt='Animated SVG' /> */}
                                {/* <Slider  {...settings}>
                                    <div className={styles.stories_box}>
                                        <div className="stories_img">
                                            <Image src={`/images/growth1.svg`} height={500} width={500} alt="stories img" />
                                        </div>
                                    </div>
                                    <div className={styles.stories_box}>
                                        <div className="stories_img">
                                            <Image src={`/images/growth2.svg`} height={500} width={500} alt="stories img" />
                                        </div>
                                    </div>
                                    <div className={styles.stories_box}>
                                        <div className="stories_img">
                                            <Image src={`/images/growth3.svg`} height={500} width={500} alt="stories img" />
                                        </div>
                                    </div>
                                    <div className={styles.stories_box}>
                                        <div className="stories_img">
                                            <Image src={`/images/growth4.svg`} height={500} width={500} alt="stories img" />
                                        </div>
                                    </div>
                                </Slider> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
            .investment{
                width:60%;
                height:400px;
                margin:0 auto;
            }
            .investment .slick-list{
                    padding: 30px 0;
                    margin:0 auto;
                  
                    border-radius: 8px;
                }
                .investment .slick-dots{
                    width :100% !important;  
                    bottom: 10px  !important;  
                    padding-bottpm:40px;
                }
                }
                .slick-slide img{
                    margin: auto;
                    padding-bottom:20px;
                }
                @media screen and (max-width:767px) {
                    .investment{
                    width:97%;
                    height:auto;
                    margin:0 auto;
                    }
                }
                @media screen and (max-width:480px) {
                    .investment{
                    width:100%;
                    height:auto;
                    margin:0 auto;
                    }
                }
            `}</style>
        </div>
    )
}

export default Investment
