import React, { useEffect, useState } from 'react'
import styles from "../../components/OurProducts/bannerAndProducts.module.css"
import style from './productsDetails.module.css'
import Image from 'next/image'
import Accordion from 'react-bootstrap/Accordion';
import { AesDecrypt, fixDecimalDigit } from "../../components/middleware"
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import { useSelector,useDispatch } from 'react-redux';
import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import { log } from '@/components/logger';
import api from '@/utils/api';
import CustomHead from '@/components/CustomHead';

const ProductList = () => {
    const router = useRouter()
    const [productList, setProductList] = useState([])
    const [userWallet, setUserWallet] = useState({})
    const [productFilter, setProductFilter] = useState('ALL')
    const [activeTab, setActiveTab] = useState('ALL');
    const [accordionData, setAccordionData] = useState([])

    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }

    const auth = useSelector((state) => {
        return state.auth
    })


    const getFAQ = async () =>{
        try {
            const response = await api.get('/public/faqs?type=DELIVERY');
            if(response.status){
                setAccordionData(response.data)
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
          }
    }

    const getVault = async () =>{
        try {
            const response = await api.get('/user/vault');
            if(response.status){
                setUserWallet(response.data)
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
          }
    }

    const getAllProducts = async(params = null) => {

        try {
            let url = `/public/products?limit=50&page=0`;
            if (params) {
                url = `/public/products?limit=50&page=0&metal=${params}`;
            }
            const response = await api.get(url);
            if(response.status){
                setProductList(response.data)
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
          }
    }

    useEffect(() => {
        getFAQ();
        if(auth.isAuthenticated){
            getVault();
        }
        getAllProducts();
    }, [])

    const gotoDetailPage = (item) => {
        router.push("/coins/" + item.slug)
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        getAllProducts(tab);
    };
    return (
        <div>
            <CustomHead title="Gold and Silver Coins- Bright DiGi Gold"  description="Explore our wide range of Gold and Silver coins with 24k purity and 100% safe and secure delivery."/>
            <div className={style.products_slider_bg} >
                <div className="container" >
                    <div className={style.product_banner}>
                    <Image src={"/images/product-banner.png"} layout='responsive' width={400} height={200} alt="" className="full-width-image"></Image></div>
                    <div className={style.products_text_wallet}>
                        <div className={style.productSelect}>
                            <div className={style.products_text}>Coins</div>
                            <div className={style.productfilter}>
                                <div className="tabs-container">
                                    <div
                                        className={`tab ${activeTab === 'ALL' ? 'active' : 'inactive'}`}
                                        onClick={() => handleTabClick('ALL')}
                                    >
                                        All
                                    </div>
                                    <div
                                        className={`tab ${activeTab === 'GOLD' ? 'active' : 'inactive'}`}
                                        onClick={() => handleTabClick('GOLD')}
                                    >
                                        <span><Image src={"/images/gold-bars.svg"} height={25} width={25} alt='' /></span> Gold
                                    </div>
                                    <div
                                        className={`tab ${activeTab === 'SILVER' ? 'active' : 'inactive'}`}
                                        onClick={() => handleTabClick('SILVER')}
                                    >
                                        <span><Image src={"/images/silverBars.png"} height={25} width={25} alt='' /></span>  Silver
                                    </div>
                                </div>
                                {/* <select className='select-type' name='product_type' onChange={changeFilter} value={productFilter}>
                                    <option value="ALL">All</option>
                                    <option value="GOLD">Gold</option>
                                    <option value="SILVER">Silver</option>
                                </select> */}
                            </div>
                        </div>
                        {userWallet && userWallet.gold >= 0 && userWallet.silver >= 0 &&
                            <div className={style.wallet}>
                                <div className=''><Image src={"/images/gold-bars.svg"} height={25} width={25} alt=''></Image></div>
                                <div className={style.gold}>Gold : {fixDecimalDigit(userWallet.gold, 4)} gm</div>
                                <div className={style.line}></div>
                                <div className=''><Image src={"/images/silverBars.png"} height={25} width={25} alt=''></Image></div>
                                <div className={style.silver}>Silver : {fixDecimalDigit(userWallet.silver, 4)} gm</div>
                            </div>
                        }
                    </div>
                    <div className='row'>
                        {productList.map((item, index) => {
                            return (
                                <>
                                    <div className='col-md-4 col-12 px-2'>
                                        {/*  */}
                                        <div className={`${styles.products_info} product_details`} key={index} onClick={() => gotoDetailPage(item)} >
                                            <div className='d-flex justify-content-between'>
                                                <Image src={"/images/star1.png"} height={80} width={80} alt='products' />
                                                <Image src={"/images/star2.png"} height={80} width={80} alt='products' />
                                            </div>
                                            <div className={styles.products_image}>
                                                <Image src={item.image.image} className={styles.product_img} width={150} height={150} alt='products' />
                                            </div>
                                            <div className={styles.gram}>{item.name}</div>
                                            <div className={styles.charges}>*Making Charges ₹ {item.makingcharges} </div>
                                            <div className={styles.buy_btn}>
                                                <button className='button'><Image src={"/images/buy.png"} height={25} width={25} alt='buy' /> BUY</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })}

                        <div className={`${style.multi_slider_bg} pb-0 `} >
                            <div className="container" >
                                <div className={`${style.faqs} text-start`}>
                                    FAQ
                                </div>
                                <div className={`${style.faqs_list} faqs-list`}>
                                    {/* DELIVERY */}
                                    
                                    <Accordion className={style.accordion_bg}>
                                    {accordionData && accordionData.map((item, index) => {
                                       
                                       return (<><Accordion.Item eventKey={index} className="mt-2">
                                            <Accordion.Header className='region'>{item.title}</Accordion.Header>
                                            <Accordion.Body key={index}>
                                            <div dangerouslySetInnerHTML={ { __html: item.description}}></div>
                                             </Accordion.Body>
                                        </Accordion.Item></>)
                                       
                                    })}
                                    </Accordion>


                                </div>
                            </div>
                            <div style={{ paddingBottom: "25px", marginBottom: "20px" }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
           .product_details{
            cursor:pointer;
           }
           .select-type{
            padding: 10px;
            border-radius: 4px;
           }
           .tabs-container {
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            background: rgba(44, 123, 172, 0.2);
            color:#FFF;
            border-radius: 4px;
            display: flex;
            // border: 1px solid gray;
            width:100%;
            }

            .tab {
            display: flex;
            justify-content: center;
            align-items: center;
            gap:10px;
            cursor: pointer;
            // border-right: 1px solid gray;
            padding: 10px;
            color: #333;
            text-decoration: none;
            font-size:18px;
            min-width:100px;
            }
            .inactive{
                color:#FFF;
            }
            .tab.active {  
            color: gold;
            padding-top:10px;
            border-bottom:4px solid;
            }
           `}</style>
        </div>
    )
}

export default ProductList
