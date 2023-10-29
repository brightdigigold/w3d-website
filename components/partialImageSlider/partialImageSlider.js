import React from "react";
import Slider from "react-slick";
import Card from "react-bootstrap/Card";
import styles from './partial.module.css'
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { AesDecrypt, AesEncrypt } from "../middleware"
import { log } from "../logger";

const PartialSlider = () => {
    const [partialSlider, setPartialSlider] = useState([])
    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        // 
        return response;
    }
    const funForAesEncrypt = async (dataToBeEncrypt) => {
        const response = await AesEncrypt(dataToBeEncrypt)
        // 
        return response;
    }
    const PartialSlider = async () => {
        let dataToBeEncryptPayload = {
            type: "coupon_banner"
        }
        const resAfterEncryptData = await funForAesEncrypt(dataToBeEncryptPayload)
        const payloadToSend = {
            payload: resAfterEncryptData
        }
        axios.post(`${process.env.baseUrl}/data/banner/images`, payloadToSend, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async (data) => {
                const decryptedData = await funcForDecrypt(data.data.payload);      
                setPartialSlider(JSON.parse(decryptedData).data)
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        PartialSlider()
    }, [])

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 2,
        slidesToScroll: 1,
        cssEase: 'linear',
        responsive: [
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 2,
              }
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 1,
              }
            }
          ]
    };
    // const products = [
    //     {
    //         id: 1,
    //         image: "/images/partial1.png",
    //         text: "Some quick example text to build on the card title and make up the..."
    //     },
    //     {
    //         id: 2,
    //         image: "/images/partial2.png",
    //         text: "Some quick example text to build on the card title and make up the..."
    //     },
    //     {
    //         id: 3,
    //         image: "/images/partial1.png",
    //         text: "Some quick example text to build on the card title and make up the..."
    //     },
    //     {
    //         id: 4,
    //         image: "/images/partial2.png",
    //         text: "Some quick example text to build on the card title and make up the..."
    //     },
    // ];


    return (
        <div className={`${styles.partials_bg} partials`}>
            <Slider  {...settings}>
                {partialSlider?.map((item, index) => {
               
                    return (
                        <>
                            <div key={index} style={{ padding: "10px" }}>
                                <Image src={item.value} height={150} width={500} alt="partialSlider" />
                            </div>

                        </>
                    )

                })}
            </Slider>

            <style>{`

            .partials .slick-list {
              display:flex;
              justify-content:center;
              align-items:center;
              flex-direction:column;
            }

            .slick-slide img{
                margin:auto;
            }
      `}</style>
        </div>
    );
}

export default PartialSlider