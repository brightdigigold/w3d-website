import React from "react";
import Slider from "react-slick";
import styles from "./updateMultiItemAndFaqs.module.css"
import { useState, useEffect } from "react";
import axios from "axios";
import { AesDecrypt } from "../middleware"
import Image from "next/image";
import Router, { useRouter } from 'next/router'
import { log } from "../logger";


const UpdateMultiItemsAndFaqs = () => {
    const router = useRouter()
    const [accordionData, setAccordionData] = useState([])
    const [blogs, setBlogs] = useState([]);
    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }

    const getBlogs = async () =>{
        fetch(`${process.env.baseUrl}/public/blogs?page=0&limit=20`, { headers: { 'content-type': "application/json" } }).then(response => response.json())
        .then(async (data) => {
            const decryptedData = await funcForDecrypt(data.payload);
            log('blogs',JSON.parse(decryptedData).data);
            setBlogs(JSON.parse(decryptedData).data.blog)
        })
        .catch(error => console.error(error));
    }

    useEffect(() => {
        // axios.get(`${process.env.baseUrl}/public/faqs`, { headers: { 'content-type': "application/json" } }).then(async (result) => {
        //     const decryptedData = await funcForDecrypt(data.payload);
        //     
        // })
        // const configHeaders = { headers: { 'Content-Type': "application/json" } };
         getBlogs();
        fetch(`${process.env.baseUrl}/public/faqs`, { headers: { 'content-type': "application/json" } }).then(response => response.json())
            .then(async (data) => {
                const decryptedData = await funcForDecrypt(data.payload);
                setAccordionData(JSON.parse(decryptedData).data)
            })
            .catch(error => console.error(error));
    }, [])




    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 8000,
        slidesToShow: 4,
        slidesToScroll: 1,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 1424,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,

                },
            },

            {
                breakpoint: 1124,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,

                },
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    initialSlide: 3,
                },
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    speed: 1000,
                    autoplay: true,
                    autoplaySpeed: 2000,
                    arrows: false,
                },
            },
            {
                breakpoint: 440,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                    speed: 1000,
                    autoplay: false,
                    autoplaySpeed: 2000,
                    arrows: false,
                },
            },
        ],


    };

    const gotoDetailPage = (item) => {
        const newWindow = window.open(item.author_link, '_blank', 'noopener,noreferrer')
       if (newWindow) newWindow.opener = null
    }
   
    return (
        <div className={`${styles.multi_slider_bg} multi-slider`} >
            <div className="container" >
                <div className={styles.update_text}>
                    Latest Update
                </div>
                <Slider  {...settings}>
                    {blogs?.map((item, key) => {
                        return (
                            <>
                                <div key={key} style={{
                                    margin: "10px",
                                    background: "linear-gradient(0.69deg, #0B4263 0.62%, #081A24 101.27%)",
                                    width: "auto",
                                    borderRadius: "12px",
                                    color: "rgba(255, 255, 255, 0.5)",
                                    display: "flex",
                                    "justify-content": "center",
                                    "min-height": "298px",
                                    cursor:'pointer'
                                }}>
                                    <div style={{ padding: "10px", }} onClick={() => gotoDetailPage(item)}>
                                       <div className=""> <Image src={item?.main_image} className="img-fluid"   style={{margin:"auto"}} height={141} width={250} alt="products" /></div>
                                        <div className={styles.card_text}> {item.title}</div>
                                    </div>
                                </div>

                            </>
                        )
                    })}
                </Slider>
            </div>
            {/* <div className="container p-2" >
                <div className={styles.faqs}>
                    FAQ
                </div>
                <div className={`${styles.faqs_list} faqs-list`}>
                    {accordionData.map((item, index) => {
                        if(index < 6){
                        return (
                            <>
                                <Accordion key={index} className={styles.accordion_bg}>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className='region'>{item.title}</Accordion.Header>
                                        <Accordion.Body>
                                            {item.description}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </>
                        )
                        }
                    })}

                </div>
                <div className={styles.view_all}>
                        <button onClick={() => goToFAQViewAllPage()}>View All</button>
                    </div>
            </div> */}
            <style >{`
          .multi-slider .slick-prev:before, .slick-next:before,.slick-prev:before, .slick-next:before{
            font-size:45px !important;
            color: rgba(255, 255, 255, 0.1) !important;
         }
        .multi-slider .slick-list{
            margin-left:18px !important;
        }
        @media screen and (max-width:767px) {
            .multi-slider .slick-list{
            margin-left:0px !important;
        }
        .multi-slider .container {
        --bs-gutter-x: 0rem !important;
    }
        }
            `}</style>
        </div>
    );
}

export default UpdateMultiItemsAndFaqs