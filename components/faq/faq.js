import React from "react";
import Slider from "react-slick";
import Accordion from 'react-bootstrap/Accordion';
import Card from "react-bootstrap/Card";
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

    useEffect(() => {
        fetch(`${process.env.baseUrl}/public/faqs?type=GIFT`, { headers: { 'content-type': "application/json" } }).then(response => response.json())
            .then(async (data) => {
                const decryptedData = await AesDecrypt(data.payload);
                setAccordionData(JSON.parse(decryptedData).data)
            })
            .catch(error => console.error(error));
    }, [])

    const goToFAQViewAllPage = ()=>{
        router.push('/faqs?type=GIFT')
    }

    return (
        <div className={`${styles.multi_slider_bg} multi-slider`} >
            <div className="container " >
                <div className={styles.faqs}>
                   GIFT FAQ
                </div>
                <div className={`${styles.faqs_list} faqs-list`}>
                <Accordion  className={styles.accordion_bg}>
                    {accordionData.map((item, index) => {
                        if(index < 5){
                        return (
                            <>
                              
                                    <Accordion.Item eventKey={index} className="mt-2">
                                        <Accordion.Header className='region'>{item.title}</Accordion.Header>
                                        <Accordion.Body >
                                            <div dangerouslySetInnerHTML={ { __html: item.description}}></div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                           
                            </>
                        )
                    }
                    })}
                </Accordion>
                    <div className={styles.view_all}>
                            <button className="mt-4" onClick={() => goToFAQViewAllPage()}>View All</button>
                    </div>
                </div>
            </div>
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