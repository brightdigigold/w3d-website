import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import { useState, useEffect, useRef } from "react"
import style from './dashboard.module.css'
import { useRouter } from 'next/router'
import DashboardOrder from '@/components/dashboardDetails/dashboardOrder'
import Gifting from '@/components/dashboardDetails/gifting'
import ReferAndEarn from '@/components/dashboardDetails/referAndEarn'
import DashboardWallet from '@/components/dashboardDetails/dashboardWallet'
import { AesEncrypt, AesDecrypt } from "../../components/middleware"
import axios from 'axios';
import { log } from '@/components/logger';

const Dashboard = () => {
    const router = useRouter();
    let active = 'Order'
    // if(router.query.active && router.query.active != ""){
    //    active = router.query.active;
    // }
    useEffect(() => {
    router.push('dashboard/orders');
    },[]);
    // const [activeTab, setActiveTab] = useState(active);
    // const [toggle, setToggle] = useState(false);
    // const [dashboardData, setDashboardData] = useState('')
    // const [userDetails, setUserDetails] = useState([])
    // const handleClick = (activeTab) => {
    //     setActiveTab(activeTab);
    // };
    // const funcForDecrypt = async (dataToBeDecrypt) => {
    //     const response = await AesDecrypt(dataToBeDecrypt)
    //     // 
    //     return response;
    // }
    // const funForAesEncrypt = async (dataToBeEncrypt) => {
    //     const response = await AesEncrypt(dataToBeEncrypt)
    //     // 
    //     return response;
    // }
    // const rateOfSilverOrGold = () => {

    // }
    // // useEffect for rate of gold and silver api below
    // useEffect(() => {
    //     
    //     // const token = localStorage.getItem('token')
    //     // const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    //     // const body = {
    //     //     "payload": "CD46F0B542BF044C3F5CEC4AFA6AC27A"
    //     // }
    //     // axios.post(`${process.env.baseUrl}/user/order/history`, body, configHeaders).then(async (data) => {
    //     //         const decryptedData = await funcForDecrypt(data.payload);
    //     //         // 
    //     //         // 
    //     //         setDashboardData(JSON.parse(decryptedData).data)
    //     //     }).catch(error => console.error(error));
    // }, [])


    // useEffect(() => {
    //     const token = localStorage.getItem('token')
    //     // 
    //     const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    //     fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders).then(response => response.json())
    //         .then(async (data) => {
    //             const decryptedData = await funcForDecrypt(data.payload);
    //             if (token) {
    //                 
    //                 setUserDetails(JSON.parse(decryptedData).data)
    //             }else{
    //                 router.push('/')
    //             }

    //         })
    //     // setCheckingKycStatus(props?.props?.isKycDone)
    // }, [toggle])
   
    return (
        <div>
            <Header></Header>
            <div className=''>
               
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
            {/* .dashboard_item{
                display:block;
            } */}
          
             .dashboard ul {
                padding-left:0px !important;
            }
            .dashboard ul li {
                list-style:none;
                margin-bottom:20px;
                padding-left:0px !important;
                width:100%;
                text-align:center;
            }
           .dashboard .active{
                padding:20px;
                background: #09202D;
            }
           .dashboard .inactive{
                padding:20px;
                background: rgba(44, 123, 172, 0.1);
            }
            `}</style>
        </div>
    )
}

export default Dashboard