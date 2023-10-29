import React, { useEffect, useState } from 'react'
import style from '../transactionDetails.module.css'
import Image from 'next/image'
import { AesDecrypt } from "../../../components/middleware"
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import Slider from 'react-slick';
import { log } from '@/components/logger';

export const getServerSideProps = async ({ query }) => {
    const slug = query.slug;
    // const id = query.id;
    return {
        props: {
            slug,
        },
    };
};


const TransactionDetails = ({slug}) => {

    const router = useRouter()
    

    useEffect(() => {
        router.push("/dashboard/")
    }, [])

    return (
        <div>
            <Header />
            <div className={style.transaction_slider_bg} >
                <div className="container" >
                    <div>
                        <div className="row mb-4">
                            <div className='col-12'>
                                <div className={style.transaction_loading}>
                                        <h1>Transaction Loading.. </h1>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                <Footer />
            </div>
        </div>
    )
}

export default TransactionDetails
