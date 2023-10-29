import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Nav } from 'react-bootstrap';
import style from './dashboardDetails.module.css'
import { IoIosArrowForward } from 'react-icons/io'
import Header from '@/components/header/header';
import { AesDecrypt, fixDecimalDigit } from "../../components/middleware"
import axios from 'axios';
import Orders from './order';
import Wallet from './wallet';
import { log } from '../logger';
const DashboardWallet = () => {
  
  const [wallet,setWallet] = useState({});

  const funcForDecrypt = async (dataToBeDecrypt) => {
    const response = await AesDecrypt(dataToBeDecrypt)
    return response;
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    // 
    // const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    // fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders).then(response => response.json())
    //   .then(async (data) => {
    //     const decryptedData = await funcForDecrypt(data.payload);
    //     
    //     setUserDetails(JSON.parse(decryptedData).data)
    //   })
      apiForWallet()
  }, [])
  
  const apiForWallet = () => {
        const token = localStorage.getItem('token')
        fetch(`${process.env.baseUrl}/user/vault`, { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }).then(response => response.json())
            .then(async (data) => {
                const decryptedData = await funcForDecrypt(data.payload);
                let userWallet = JSON.parse(decryptedData).data;
                log('userWallet',userWallet);
                setWallet(userWallet);
                
            })
            .catch(error => console.error(error));
  }
  return (
    <div>
      <div className={style.dashboard_bg}>
        <div className='container dashboard_orders '>
          <div className='row'>
            <div className='col-md-12 col-12'>
            <div className='row'>
                <div className={` col-md-6 p-2`}>
                    <div className={`active nav-link`}>
                      <div className={style.dashboard}>
                        <div className={style.dashboard_img_text}>
                          <div className={style.dashboard_text}>Gold</div>
                        </div>
                      </div>
                      <div className={style.pl_invested_current}>
                        <div className={style.pl}>
                          <h1>Weight</h1>
                          <h2>{fixDecimalDigit(wallet.gold,4)}gm</h2>
                        </div>
                        <div className={style.pl}>
                          <h1>Gifted Weight</h1>
                          <h2>{fixDecimalDigit(wallet.holdGoldGram,4)}gm</h2>
                        </div>
                        {/* <div className={style.invested}>
                          <h1>Average Buy Price</h1>
                          <h3>₹{wallet.goldAvgPrice?wallet.goldAvgPrice:0}</h3>
                        </div>
                        <div className={style.current}>
                          <h1>Current Value</h1>
                          <h3>₹{wallet.goldCurrentValue?wallet.goldCurrentValue:0}</h3>
                        </div> */}

                      </div>
                    </div>
                </div>
                <div className={` col-md-6  p-2`}>
                <div className={`active nav-link`}>
                      <div className={style.dashboard}>
                        <div className={style.dashboard_img_text}>
                          <div className={style.dashboard_text}>Silver</div>
                        </div>
                      </div>
                      <div className={style.pl_invested_current}>
                        <div className={style.pl}>
                          <h1>Weight</h1>
                          <h2>{fixDecimalDigit(wallet.silver,4)}gm</h2>
                        </div>
                        <div className={style.pl}>
                          <h1>Gifted Weight</h1>
                          <h2>{fixDecimalDigit(wallet.holdSilverGram,4)}gm</h2>
                        </div>
                        {/* <div className={style.invested}>
                          <h1>Average Price</h1>
                          <h3>₹{wallet.silverAvgPrice?wallet.silverAvgPrice:0}</h3>
                        </div>
                        <div className={style.current}>
                          <h1>Current Value</h1>
                          <h3>₹{wallet.silverCurrentValue?wallet.silverCurrentValue:0}</h3>
                        </div> */}
                      </div>                   
                    </div>
                </div>
              </div>
              {/* <ul className="">
                <li className={`${activeTab === 'gold' ? 'active' : 'inactive'} p-3`}>
                  <div className="nav-link" onClick={() => handleClick('gold')}>
                    <div className={style.dashboard}>
                      <div className={style.dashboard_img_text}>
                        <div className={style.dashboard_text}>Gold</div>
                      </div>
                      <div className={style.orders}>
                        <div> <IoIosArrowForward style={{ color: "#fff" }} /></div>
                      </div>
                    </div>
                    <div className={style.pl_invested_current}>
                      <div className={style.pl}>
                        <h1> P&L</h1>
                        <h2>+5.44%</h2>
                      </div>
                      <div className={style.invested}>
                        <h1>Invested</h1>
                        <h3>₹2000</h3>
                      </div>
                      <div className={style.current}>
                        <h1> Current</h1>
                        <h3>₹2176</h3>
                      </div>

                    </div>
                  </div>
                </li>
                <li className={`${activeTab === 'silver' ? 'active' : 'inactive'} p-3`}>
                  <div className="nav-link" onClick={() => handleClick('silver')}>
                    <div className={style.dashboard}>
                      <div className={style.dashboard_img_text}>
                        <div className={style.dashboard_text}>Silver</div>
                      </div>
                      <div className={style.orders}>
                        <div> <IoIosArrowForward style={{ color: "#fff" }} /></div>
                      </div>
                    </div>
                    <div className={style.pl_invested_current}>
                      <div className={style.pl}>
                        <h1> P&L</h1>
                        <h2>+5.44%</h2>
                      </div>
                      <div className={style.invested}>
                        <h1>Invested</h1>
                        <h3>₹2000</h3>
                      </div>
                      <div className={style.current}>
                        <h1> Current</h1>
                        <h3>₹2176</h3>
                      </div>

                    </div>
                  </div>
                </li>
              </ul> */}
            </div>
            <div className="col-md-12">
                    <div className={style.sell_and_buy}>
                        <div className={style.sellButton}>
                        <Link href="/?type=sell"><button type="submit">SELL</button></Link>
                        </div>
                        <div className={style.buyButton}>
                        <Link href="/?type=sell"><button type="submit">BUY</button></Link>
                        </div>
                        <div className={style.sellButton}>
                        <Link href="/coins"><button type="submit">DELIVERY</button></Link>
                        </div>
                    </div>
            </div>
            
            {/* <div className='col-md-8 col-12'>
              {activeTab === 'gold' && (
                <Wallet />
              )}
              {activeTab === 'silver' && (
                <Wallet />

              )}

            </div> */}
          </div>
        </div>
      </div>

      <style>{`
            body{
              background: linear-gradient(0.69deg, #0B4263 0.62%, #081A24 101.27%);
              background-repeat: no-repeat;
              background-size: auto;
              background-attachment: fixed;
              height: 100%;
              width: 100%;
            }
           .dashboard_orders ul li {
                list-style:none;
                margin-bottom:20px;
            }
             .dashboard_orders ul {
              padding-left:0 !important;
            }
           .dashboard_orders .active{
              padding:8px;
              background: rgba(44, 123, 172, 0.2);
              border: 1px solid #2C7BAC;
              border-radius: 8px;
              cursor:pointer;
            }
           .dashboard_orders .inactive{
                padding:8px;
                background: rgba(44, 123, 172, 0.2);
                border-radius: 8px;
                cursor:pointer;
            }
            `}</style>

    </div>
  )
}

export default DashboardWallet
