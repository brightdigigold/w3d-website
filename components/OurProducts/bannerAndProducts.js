import React, { useEffect, useState } from 'react'
import styles from "./bannerAndProducts.module.css"
import Image from 'next/image'
import { AesDecrypt } from "../middleware"
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import { log } from "../logger";

const Products = () => {
    const router = useRouter()
    const [productList, setProductList] = useState([])
    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }
    useEffect(() => {
        // axios.get(`${process.env.baseUrl}/public/products`, { headers: { 'content-type': "application/json" } }).then(async(result)=>{
        //     const decryptedData = await funcForDecrypt(data.payload);
        //     
        // })
        // const configHeaders = { headers: { 'Content-Type': "application/json" } };
        fetch(`${process.env.baseUrl}/public/products`, { headers: { 'content-type': "application/json" } }).then(response => response.json())
            .then(async (data) => {
                const decryptedData = await funcForDecrypt(data.payload);
                setProductList(JSON.parse(decryptedData).data)
            })
            .catch(error => console.error(error));
    }, [])

    const goToProductViewAllPage = () => {
        router.push('/coins')
    }
    const goToDetailsPage = (item) => {
        router.push("/coins/" + item.slug)
        // router.push({
        //     pathname: "/products",
        //     query: item.slug
        // })
    }
    return (
        <div>
            <div className={styles.products_slider_bg} >
                <div className="container products" >
                    <div className='d-flex justify-content-between align-items-center w-100 pb-4'>
                        <div className={styles.products_text}>
                            Our Coins
                        </div>
                        <div className={styles.view_all}>
                            <button className="glow-on-hover" onClick={() => goToProductViewAllPage()}>View All</button>
                        </div>
                    </div>

                    <div className='row'>
                        {productList.slice(0, 3).map((item, index) => {
                            return (
                                <>
                                    <div className='col-md-4 col-12 products'>
                                        <div className={styles.products_info} key={index} onClick={() => goToDetailsPage(item)}>
                                            <div className='d-flex justify-content-between'>
                                                <Image src={"/images/star1.png"} height={80} width={80} alt='products' />
                                                <Image src={"/images/star2.png"} height={80} width={80} alt='products' />
                                            </div>
                                            <div className={styles.products_image}>
                                                <Image src={item.image.image} height={150} width={150} className={styles.product_img} alt='products' />
                                            </div>
                                            <div className={styles.gram}>{item.name}</div>
                                            {/* <div className={styles.charges}>*Minting Charges ₹ {item.makingcharges} </div> */}
                                            <div className={styles.buy_btn}>
                                                    <button className='button'><Image src={"/images/buy.png"} height={25} width={25} alt='buy' /> BUY</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })}

                    </div>

                </div>
            </div>
            <div className={styles.banner_bg}>
                <div className={`${styles.banner_display} container`}>
                    <div className='row'>
                        <div className='col-md-6 col-12'>
                            {/* <Image src={"/images/coins_phone_banner 1.svg"} height={600} width={600} alt='banner' /> */}
                            <Image src={"/images/investing_gold.jpg"} height={600} width={600} alt='banner' />


                        </div>
                        <div className='col-md-6 col-12 banner2'>
                            {/* <Image src={"/images/digital to physical.svg"} height={600} width={600} alt='banner' /> */}
                            <Image src={"/images/digital_physical_gold.jpg"} height={600} width={600} alt='banner' />
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                
            @media screen and (max-width:767px) {
            .products{
                padding: 12px !important;
            }
            .banner2{
                margin-top:25px;
            }
            }
            `}</style>
        </div>
    )
}

export default Products
