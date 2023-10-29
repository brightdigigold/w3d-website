import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { MdEdit } from 'react-icons/md'
import { useEffect } from 'react'
import axios from "axios";
import { AesEncrypt, AesDecrypt } from '../../components/middleware';
import style from './dashboardDetails.module.css'
import AreaChart from '../chart';
import { log } from "../logger";

const Wallet = (props) => {

    return (
        <div>
            <div className={style.orders_bg}>

                <div className='p-4'>
                    <div className={style.price_trend}>
                        <div className={style.price}>Price Trend</div>
                        <div className={style.price_percentage}>1M (3.27%)
                            <div className=''><Image src={"/images/percentageArrow.png"} height={20} width={20} alt='percentageArrow'/></div></div>
                    </div>
                    <div className='mt-3'>
                        <AreaChart />
                    </div>
                    <div className={style.sell_and_buy}>
                        <div className={style.sellButton}>
                            <button type="submit">SELL</button>
                        </div>
                        <div className={style.buyButton}>
                            <button type="submit">BUY</button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Wallet
