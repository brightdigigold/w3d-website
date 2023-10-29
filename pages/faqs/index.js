import React from "react";
import Slider from "react-slick";
import Accordion from 'react-bootstrap/Accordion';
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import axios from "axios";
import { AesDecrypt } from "../../components/middleware"
import Image from "next/image";
import styles from '../../components/updateMultiItemAndFaqs/updateMultiItemAndFaqs.module.css'
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { log } from '@/components/logger';
import CustomHead from "@/components/CustomHead";

const Faqs = () => {
    const [accordionData, setAccordionData] = useState([])
    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }
    useEffect(() => {
        fetch(`${process.env.baseUrl}/public/faqs`, { headers: { 'content-type': "application/json" } }).then(response => response.json())
            .then(async (data) => {
                const decryptedData = await funcForDecrypt(data.payload);

                setAccordionData(JSON.parse(decryptedData).data)
                log('accordionData', JSON.parse(decryptedData).data)
            })
            .catch(error => console.error(error));
    }, [])
    return (
        <>
        <CustomHead title="Frequently Asked Questions- Bright DiGi Gold" description="Find answers to frequently asked questions of Bright DiGi Gold, a digital platform for safe and secure gold transactions." />
            <div className={`${styles.multi_slider_bg} pb-0 `} >
                <div className="container" >
                    <div className={`${styles.faqs} text-start pt-5`}>
                        FAQ
                    </div>
                    <div className={`${styles.faqs_list} faqs-list`}>

                        <div className="faq_heading">
                            <h4 className="text-center text-white">GENERAL</h4>
                        </div>

                        <Accordion  className={styles.accordion_bg}>
                            {accordionData.map((item, index) => {
                                if( item.type == "GENERAL"){
                                return (
                                    <>
                                    
                                            <Accordion.Item eventKey={index} className="mt-2">
                                                <Accordion.Header className='region'>{item.title}</Accordion.Header>
                                                <Accordion.Body>
                                                    <div dangerouslySetInnerHTML={ { __html: item.description}}></div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                
                                    </>
                                )
                            }
                            })}
                        </Accordion>

                        <div className="faq_heading mt-5">
                            <h4 className="text-center text-white">BUY</h4>
                        </div>

                        <Accordion  className={styles.accordion_bg}>
                            {accordionData.map((item, index) => {
                                if( item.type == "BUY"){
                                return (
                                    <>
                                    
                                            <Accordion.Item eventKey={index} className="mt-2">
                                                <Accordion.Header className='region'>{item.title}</Accordion.Header>
                                                <Accordion.Body>
                                                     <div dangerouslySetInnerHTML={ { __html: item.description}}></div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                
                                    </>
                                )
                            }
                            })}
                        </Accordion>

                        <div className="faq_heading mt-5">
                            <h4 className="text-center text-white">SELL</h4>
                        </div>

                        <Accordion  className={styles.accordion_bg}>
                            {accordionData.map((item, index) => {
                                if( item.type == "SELL"){
                                return (
                                    <>
                                    
                                            <Accordion.Item eventKey={index} className="mt-2">
                                                <Accordion.Header className='region'>{item.title}</Accordion.Header>
                                                <Accordion.Body>
                                                    <div dangerouslySetInnerHTML={ { __html: item.description}}></div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                
                                    </>
                                )
                            }
                            })}
                        </Accordion>

                        <div className="faq_heading mt-5">
                            <h4 className="text-center text-white">DELIVERY</h4>
                        </div>

                        <Accordion  className={styles.accordion_bg}>
                            {accordionData.map((item, index) => {
                                if( item.type == "DELIVERY"){
                                return (
                                    <>
                                    
                                            <Accordion.Item eventKey={index} className="mt-2">
                                                <Accordion.Header className='region'>{item.title}</Accordion.Header>
                                                <Accordion.Body>
                                                    <div dangerouslySetInnerHTML={ { __html: item.description}}></div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                
                                    </>
                                )
                            }
                            })}
                        </Accordion>

                        <div className="faq_heading mt-5">
                            <h4 className="text-center text-white">GIFTING</h4>
                        </div>

                        <Accordion  className={styles.accordion_bg}>
                            {accordionData.map((item, index) => {
                                if( item.type == "GIFT"){
                                return (
                                    <>
                                    
                                            <Accordion.Item eventKey={index} className="mt-2">
                                                <Accordion.Header className='region'>{item.title}</Accordion.Header>
                                                <Accordion.Body>
                                                 <div dangerouslySetInnerHTML={ { __html: item.description}}></div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                
                                    </>
                                )
                            }
                            })}
                        </Accordion>

                        <div className="faq_heading mt-5">
                            <h4 className="text-center text-white">KYC</h4>
                        </div>

                        <Accordion  className={styles.accordion_bg}>
                            {accordionData.map((item, index) => {
                                if( item.type == "KYC"){
                                return (
                                    <>
                                    
                                            <Accordion.Item eventKey={index} className="mt-2">
                                                <Accordion.Header className='region'>{item.title}</Accordion.Header>
                                                <Accordion.Body>
                                                 <div dangerouslySetInnerHTML={ { __html: item.description}}></div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                
                                    </>
                                )
                            }
                            })}
                        </Accordion>

                    </div>
                </div>
                <div style={{ paddingBottom: "25px", marginBottom: "20px" }}>
                </div>
            </div>

        </>

    )
}

export default Faqs
