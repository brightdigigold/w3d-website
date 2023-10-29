import React, { useEffect, useState } from 'react'
import style from './blogs.module.css'
import Image from 'next/image'
import { AesDecrypt } from "../../components/middleware"
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import BuyModal from '../../components/buyModal'
import LoginAside from '../../components/loginAside/loginAside'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoMdClose } from 'react-icons/io'
import { log } from '@/components/logger';
import CustomHead from '@/components/CustomHead'

export const getServerSideProps = async ({ query }) => {
    const slug = query.id;
    return {
        props: {
            slug,
        },
    };
};


const BlogDetailsById = ({ slug }) => {
    const [blogDetail, setBlogDetail] = useState({})
    const handleCloseAside = () => setShowAside(false);
    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }

    useEffect(() => {
        fetch(`${process.env.baseUrl}/public/blog/${slug}/details`, { headers: { 'content-type': "application/json" } }).then(response => response.json())
            .then(async (data) => {
                const decryptedData = await funcForDecrypt(data.payload);
                setBlogDetail(JSON.parse(decryptedData).data)
            
            })
            .catch(error => console.error(error));
    }, [])


    return (
        <div>
            <CustomHead title="Insights and Inspiration: The Bright DiGi Gold Blog" description="Stay ahead in the digital gold revolution with our blog's timely updates, educational resources, and expert perspectives." />
            <div className={style.blog_details_bg} >
                <div className="container" >
                    <div className={style.product_slider_details}>
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className={style.blog_heading}>
                                    {blogDetail.title}
                                </div>
                                <div className={style.blog_big_img}>
                                    <Image
                                        src={blogDetail.main_image}
                                        alt="Image"
                                     
                                        width={500}
                                        height={300}
                                    />
                                </div>
                                <div className={style.blog_desc}>

                                    <p>{blogDetail.description}</p>
                                    
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>


            <style>{`
                
        `}</style>
        </div >
    )
}

export default BlogDetailsById
