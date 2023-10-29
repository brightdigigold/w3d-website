import React, { useEffect, useState, useRef } from 'react'
import styles from "../../components/OurProducts/bannerAndProducts.module.css"
import style from './productsDetails.module.css'
import Image from 'next/image'
import { AesDecrypt, AesEncrypt, fixDecimalDigit } from "../../components/middleware"
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import ProductModal from '../../components/productModal'
import LoginAside from '../../components/loginAside/loginAside'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoMdClose } from 'react-icons/io'
import Swal from 'sweetalert2'
import { useSelector,useDispatch } from 'react-redux';
import { doShowLoginAside } from "../../store/index"
import { log } from '@/components/logger';
import api from '@/utils/api';
import CustomHead from '@/components/CustomHead'

export const getServerSideProps = async ({ query }) => {
    const slug = query.slug;
    // const id = query.id;
    return {
        props: {

            slug,
        },
    };
};


const ProductsDetailsById = ({ slug }) => {

    const [isOn, setIsOn] = useState()
    const dispatch = useDispatch();
    const [productsDetailById, setProductDetailById] = useState({})
    const [showPopup, setShowPopup] = useState(false);
    const [showAside, setShowAside] = useState(false);
    const [buyModalShow, setBuyModalShow] = useState(false)
    const [toggleHeader, setToggleHeader] = useState(false);
    const [goldPrice, setGoldPrice] = useState("")
    const [userWallet, setUserWallet] = useState({})
    const [rupeeIn, setRupeeIn] = useState("");
    const [token, setToken] = useState("");
    const [silverPrice, setSilverPrice] = useState("")
    const [useWallet, setUseWallet] = useState(false);
    const [goldData, setGoldData] = useState({})
    const [silverData, setSilverData] = useState({})
    const [quantity, setQuantity] = useState(1);
    const [amountWithoutTax, setAmountWithoutTax] = useState(0);
    const [delivered, setDelivered] = useState(false);
    const [commonMessage, setCommonMessage] = useState([]);
    const formikRef = useRef();

  

    const auth = useSelector((state) => {
        return state.auth
    })

    const handleCloseAside = () => setShowAside(false);

    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }
    const funForAesEncrypt = async (dataToBeEncrypt) => {
        const response = await AesEncrypt(dataToBeEncrypt)
        // 
        return response;
    }
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

    const getProductById = async ()=>{
        try {
            const response = await api.get(`/public/product/${slug}/details`);
            if(response.status){
                setProductDetailById(response.data)
                if (response.data.iteamtype == "SILVER") {
                    setIsOn(false);
                } else if (response.data.iteamtype == "GOLD") {
                    setIsOn(true);
                }
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
            //throw error;
          }
    }

    const updateMetalPrice = async () => {
        try {
            const response = await api.get('/public/metal/price');
            if(response.status){
                setUserWallet(response.data)
                setGoldData(response.data.gold[0])
                setSilverData(response.data.silver[0])
                setGoldPrice(response.data.gold[0].totalPrice)
                setSilverPrice(response.data.silver[0].totalPrice)
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
          }
    }

    useEffect(() => {
        getProductById()
        updateMetalPrice()
        const usertoken = localStorage.getItem('token');
        if(usertoken){
            setToken(usertoken);
            getVault();
        }else{
            setToken(false);
        }
    }, [])

    const convertFromVault = () => {
        setShowPopup(true);
    };
    const closeConvertFromVault = () => {
        setShowPopup(false);
    };

    const redirectData = (response) => {
        setBuyModalShow(true);
    }

    const buyHandler = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            previewModal();
            // setBuyModalShow(true)
        } else {

            dispatch(doShowLoginAside(true));
        }
    }

    // 
    const [previewData, setPreviewData] = useState([]);
    const [transactionId, setTransactionId] = useState("");
    const previewModal = async () => {
        let rupeeIn = 0;
        if (productsDetailById.iteamtype == "GOLD") {
            rupeeIn = productsDetailById.weight * (+goldPrice)
            setRupeeIn(rupeeIn);
        } else {
            rupeeIn = productsDetailById.weight * (+silverPrice)
            setRupeeIn(rupeeIn);
        }

        const dataToBeDecrypt = {
            orderType: "PRODUCT",
            itemType: productsDetailById.iteamtype == "GOLD" ? "GOLD" : "SILVER",
            amount: rupeeIn,
            gram: productsDetailById.weight,
            isVault: useWallet,
            currentMatelPrice: productsDetailById.iteamtype == "GOLD" ? goldPrice : silverPrice,
            fromApp: false,
            product_quantity: quantity,
            product_id: productsDetailById._id
        }

        const resAfterEncryptData = await funForAesEncrypt(dataToBeDecrypt)

        const payloadToSend = {
            payload: resAfterEncryptData
        }
        const token = localStorage.getItem('token')

        const configHeaders = {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
        axios.post(`${process.env.baseUrl}/user/order/preview`, payloadToSend, configHeaders).then(async (resAfterPreview) => {
            const decryptedData = await funcForDecrypt(resAfterPreview.data.payload);
            setPreviewData(JSON.parse(decryptedData).data.preview);
            setTransactionId(JSON.parse(decryptedData).data.transactionCache._id)
            setAmountWithoutTax(JSON.parse(decryptedData).data.amountwithoutTax)
            setBuyModalShow(true)
        }).catch(async (errInPreview) => {
            const decryptedData = await funcForDecrypt(errInPreview.response.data.payload);
            if (JSON.parse(decryptedData).messageCode == "SESSION_EXPIRED") {
                updateMetalPrice();
            }

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: JSON.parse(decryptedData).message,
            },
            )
        })
    }


    const increaseQty = () => {
        if(quantity <= 9){
            setQuantity(quantity + 1);
        }
    }
    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const handleSelectAll = (e) => {

        setUseWallet(e.target.checked);
    }
    const initialValues = {

        pincode: ""
    };
    const validationSchema = Yup.object().shape({
        pincode: Yup.string().matches(/^\d{6}$/, "Pincode is not valid")
            .required('This field is required.'),
    });

    const reset = async () =>{
        updateMetalPrice();
        setUseWallet(false);
        if(token){
            getVault();
        }
    }

    const fetchPincode = async (data) => {
        log('data',data);
        let pincode = data.pincode;
        setCommonMessage('')

        if (pincode?.length == 6) {
            try {
                log('pincode2', pincode);
                const token = localStorage.getItem("token");
                const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                const response = await axios.get(`${process.env.baseUrl}/user/ecom/pincode/${pincode}`, configHeaders);
                const decryptedData = await AesDecrypt(response.data.payload)
                const finalResult = JSON.parse(decryptedData)
                if (finalResult.data.length > 0) {

                    log('city', finalResult.data[0]['city'])
                    log('state', finalResult.data[0]['state'])
                    formikRef.current.setFieldValue('city', finalResult.data[0]['city']);
                    formikRef.current.setFieldValue('state', finalResult.data[0]['state']);
                    setCommonMessage(`Available at ${pincode} pincode`)
                    setDelivered(true);
                } else {
                    formikRef.current.setFieldValue('city', '');
                    formikRef.current.setFieldValue('state', '');
                    setCommonMessage(`Not Available at ${pincode} pincode`)
                    setDelivered(false);
                }
                log('fetchpincode', finalResult.data);
            } catch (error) {
               
            }
        }else{
            
        }
    }
    return (
        <div>
             <CustomHead title="Gold and Silver Coins- Bright DiGi Gold"  description="Explore our wide range of Gold and Silver coins with 24k purity and 100% safe and secure delivery."/>
            <div className={style.products_slider_bg} >
                <div className="container" >
                    <div className={style.product_slider_details}>
                        <div className="row pb-4">
                            <div className="col-md-5 col-12">
                                <div className={`${style.products_images} products_images`}>
                                    <Slider  {...settings}>
                                        {productsDetailById?.image?.map((item, key) => {
                                            return (
                                                <>
                                                    <div className={styles.stories_box}>
                                                        <div className="stories_img">
                                                            <Image src={item} height={300} width={300} alt="stories img" />
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </Slider>
                                </div>
                                
                                    <div className={style.convert_btn}>
                                    {/* { ((productsDetailById.iteamtype == 'GOLD' && userWallet && userWallet.gold > 0) || (productsDetailById.iteamtype == 'SILVER' && userWallet && userWallet.silver > 0)) &&
                                        <><input
                                            type="checkbox"
                                            name="checkall"
                                            // checked={checkedState.every((value) => value)}
                                            onChange={(e) => handleSelectAll(e)}
                                        />
                                       
                                        </>
                                        
                                    }
                                     { ((productsDetailById.iteamtype == 'GOLD' && userWallet && userWallet.gold <= 0) || (productsDetailById.iteamtype == 'SILVER' && userWallet && userWallet.silver <= 0)) &&
                                        <>
                                        <input
                                            type="checkbox"
                                            name="checkall"
                                            disabled={true}
                                        />
                                       
                                        </>
                                    }

                                      
                                        <>
                                     
                                        </>
                                } */}

                                    { ((productsDetailById.iteamtype == 'GOLD' && userWallet && userWallet.gold <= 0) || (productsDetailById.iteamtype == 'SILVER' && userWallet && userWallet.silver <= 0)) ? (
                                        <>
                                        <input
                                            type="checkbox"
                                            name="checkall"
                                            disabled={true}
                                            value={useWallet}
                                        />
                                       
                                        </>
                                    ):
                                    <input
                                    type="checkbox"
                                    name="checkall"
                                    checked={useWallet}
                                    value={useWallet}
                                    // checked={checkedState.every((value) => value)}
                                    onChange={(e) => handleSelectAll(e)}
                                /> }
                                       
                                        <p style={{ cursor: "pointer" }} > Convert from Vault</p>
                                        {/* <p>Convert from Vault</p> */}
                                    </div>
                                <div className={style.buy_btn}><button className='button' onClick={buyHandler}>Buy</button></div>
                                {showPopup &&
                                    <div className='popup'>
                                        <div className='d-flex justify-content-between align-items-center coupons_close'>
                                            <div className='convert' >Covert from Wallet</div>
                                            <div className='close' onClick={closeConvertFromVault}><IoMdClose style={{ color: "#fff" }} /></div>
                                        </div>
                                        <div className='d-flex justify-content-start gap-3 align-items-center coupons_close w-70'>
                                            <div className='convert' >3.0 gm gold </div>
                                            <div className='arrow' > &#8594;</div>
                                            <div className='convert' >3.0 gm gold Coin </div>
                                        </div>
                                        <div className='d-flex justify-content-start gap-3 align-items-center coupons_close w-70'>
                                            <div className='minting' >You would still have to pay the minting charges</div>
                                        </div>
                                        <div className='proceed'>
                                            <button>Proceed</button>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="col-md-7 col-12">
                                <div className={style.product_details}>
                                    <div className={style.gold_coin_cart}>
                                        <div className={style.gold_coin}>
                                            <h1>{productsDetailById?.name}</h1>
                                            {auth.isAuthenticated &&
                                                <h2 >Total Price ₹ {productsDetailById.iteamtype == 'GOLD' ? <><span style={{ color: "#FFD662" }}>{fixDecimalDigit((productsDetailById?.weight * quantity * goldPrice), 2)}</span><span style={{ fontSize: "14px", color: "#FFD662" }}> + 3% GST</span></> : <>
                                                    <span style={{ color: "#aaa9ad " }}>{fixDecimalDigit((productsDetailById?.weight * quantity * silverPrice), 2)}</span><span style={{ fontSize: "14px", color: "#aaa9ad " }}> + 3% GST</span>
                                                </>}</h2>
                                            }

                                            <h2>Making Charges ₹ {productsDetailById?.makingcharges}</h2>
                                        </div>

                                        <div className={`${style.cart} cartdesign`}>
                                            <div className="input-group">
                                                <span className="input-group-btn">
                                                    <button onClick={decreaseQty} type="button" class="btn text-danger btn-number" data-type="minus" data-field="quant[2]">
                                                        <span className="glyphicon glyphicon-minus" >-</span>
                                                    </button>
                                                </span>
                                                <span className="form-control input-number text-center" style={{ marginTop: "0px" }}>{quantity}</span>
                                                <span className="input-group-btn">
                                                    <button onClick={increaseQty} type="button" class="btn text-success btn-number" data-type="plus" data-field="quant[2]">
                                                        <span className="glyphicon glyphicon-plus" >+</span>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Formik innerRef={formikRef} initialValues={initialValues} validationSchema={validationSchema} onSubmit={fetchPincode}>
                                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit }) => (
                                        <form className='pt-2' onSubmit={(e) => { e.preventDefault(); }}>
                                            <div className={style.pinCode}>
                                                <label>Check PINCODE availability</label><br />
                                                <input
                                                    name="pincode"
                                                    type="tel"
                                                    className='auto-input'
                                                    placeholder="Enter Your Pincode"
                                                    value={values.pincode}
                                                    maxLength={6}
                                                    onChange={(event) => {
                                                        const { name, value } = event.target;
                                                        const updatedValue = value.replace(/[^0-9]/g, '');
                                                        setCommonMessage('');
                                                        setFieldValue("pincode", updatedValue);
                                                    }}
                                                    onBlur={handleBlur}
                                                    
                                                />
                                              <button className={style.check} type="submit" onClick={handleSubmit}>
                                                Check
                                                </button>  
                                                
                                            </div>
                                            <ErrorMessage name="pincode" component="div" className="error text-danger" />
                                                {commonMessage && <div className={delivered?'text-success':'text-danger'}>{commonMessage}</div>}

                                        </form>
                                    )}
                                </Formik>
                                <div className={style.desc_bg}>
                                    <div className={style.desc_text}>{productsDetailById?.description}</div>
                                    <div className={style.product_security}>
                                        <div className=''><Image src="/images/24kgold.png" width={60} height={30} alt='' />  Guaranteed 24K Gold</div>
                                        <div className=''><Image src="/images/money grow.png" width={60} height={30} alt='' />  No Loss of Money</div>
                                        <div className=''><Image src="/images/safety.png" width={60} height={30} alt='' /> Safety Guaranteed</div>
                                    </div>
                                    <div className='d-flex mt-4'>
                                        <div className={style.left_side}>Weight :</div>
                                        <div className={style.right_side}>{productsDetailById?.weight} gms</div>
                                    </div>
                                    <div className='d-flex mt-3'>
                                        <div className={style.left_side}>Metal Purity :</div>
                                        <div className={style.right_side}>{productsDetailById?.purity}</div>
                                    </div>
                                    <div className='d-flex mt-3'>
                                        <div className={style.left_side}>Dimension :</div>
                                        <div className={style.right_side}>{productsDetailById?.dimension}</div>
                                    </div>
                                    <div className='d-flex mt-3'>
                                        <div className={style.left_side}>Quality :</div>
                                        <div className={style.right_side}>Independently assay certified & zero negative weight tolerance. </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                    <div className='pt-4'></div>
                </div>
            </div>
            {buyModalShow &&
                <ProductModal show={buyModalShow} previewData={previewData} transactionId={transactionId} productId={productsDetailById._id} couponCode="" isOn={isOn} isShow="PRODUCT" gstNum="" reset={reset} goldPrice={goldPrice} silverPrice={silverPrice} rupeeIn={rupeeIn} amountWithoutTax={amountWithoutTax} gramIn={productsDetailById?.weight} onHide={() => setBuyModalShow(false)} />
            }
            <style>{`
                
                .products_images .slick-list{
                    padding: 30px 0;
                    margin:0 auto;
                    background: rgba(44, 123, 172, 0.2);
                    border-radius: 8px;
                }
                .products_images .slick-dots{
                    width :100% !important;  
                    bottom: 10px  !important;  
                    padding-bottpm:40px;
                }
                .btn-number{
                    background: rgba(44, 123, 172, 0.2);
                    border-radius: 4px;
                }
                .slick-slide img{
                    margin: auto;
                    padding-bottom:20px;
                }
                .input-number{
                    background: none;
                    color: white;
                    border: none;
                }
                .popup {
                background: linear-gradient(0.69deg, #154C6D 0.62%, #12242E 101.27%);
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                animation: fade-in 0.5s ease-out;
                width:35%;
                }
                .content span{
                    color: #EEC644 !important;
                }
                .convert{
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 150%;
                    text-transform: capitalize;
                    color: #FFFFFF;
                }
                .minting{
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 150%;
                    color: #FFFFFF;
                }
                .arrow{
                    font-size:30px;
                    color: #FFFFFF;
                }
                .proceed button{
                    border: 1px solid #FFD662;
                    border-radius: 4px;
                    font-weight: 700;
                    font-size: 14px;
                    line-height: 18px;
                    text-align: center;
                    text-transform: uppercase;
                    padding:15px;
                    margin-top:35px;
                    color: #FFD662;
                }  
                
                @media screen and (max-width:767px) {
                    .popup {
                        width:85% !important;
                        margin:0 auto;
                        left:48% !important;
                    }
                    .slick-slide img{
                    margin: auto;
                    padding:10px 10px 10px 20px;
                    }
                    .cartdesign .input-group{
                        flex-wrap:inherit;
                    }
                }


                @keyframes fade-in {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                    -webkit-transition: all 0.2s ease-in-out; 
                    transition: all 0.5s;
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
              
        `}</style>
        </div>
    )
}

export default ProductsDetailsById
