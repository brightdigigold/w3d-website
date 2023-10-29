import React, { useEffect, useState } from 'react'
import style from './blogs.module.css'
import Image from 'next/image'
import { AesDecrypt } from "../../components/middleware"
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import { log } from '@/components/logger';
import CustomHead from '@/components/CustomHead'

const Blogs = () => {
    const router = useRouter()
    const [blogList, setBlogList] = useState([])
    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }
    useEffect(() => {
        fetch(`${process.env.baseUrl}/public/blogs?page=0&limit=20`, { headers: { 'content-type': "application/json" } }).then(response => response.json())
            .then(async (data) => {
                const decryptedData = await funcForDecrypt(data.payload);
                log('blogs',JSON.parse(decryptedData).data);
                setBlogList(JSON.parse(decryptedData).data.blog)
            })
            .catch(error => console.error(error));
    }, [])

    const gotoDetailPage = (item) => {
        router.push(item.author_link)
    }
    return (
        <>
         <CustomHead title="Insights and Inspiration: The Bright DiGi Gold Blog" description="Stay ahead in the digital gold revolution with our blog's timely updates, educational resources, and expert perspectives." />
            <div className={style.blog_bg}>
                <div className='container'>
                    <div className='row pt-5 pb-5'>
                        <h1 className={style.blogs_heading}>Blogs</h1>

                        {blogList?.map((item, key) => {
                            return (
                                <>
                                    <div className='col-md-4 col-12 pb-4'>
                                        <div key={key} className={style.blog_details}>
                                            <div style={{ padding: "10px", minHeight:"400px" }}>
                                                <Image src={item?.main_image} height={350} width={350} alt="products" />
                                                <div className={style.card_text}> {item.title}</div>
                                                <div className={style.read_more}  onClick={() => gotoDetailPage(item)}>Read More</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                        <div className={style.blog}>


                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}
export default Blogs