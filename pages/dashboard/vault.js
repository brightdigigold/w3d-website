import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import { useState, useEffect, useRef } from "react"
import style from './dashboard.module.css'
import { useRouter } from 'next/router'
import DashboardWallet from '@/components/dashboardDetails/dashboardWallet'
import { AesEncrypt, AesDecrypt } from "../../components/middleware"
import { log } from '@/components/logger';

const Vault = () => {
    const router = useRouter();
    let active = 'Vault'
    const [activeTab, setActiveTab] = useState(active);
    const [toggle, setToggle] = useState(false);
    const [dashboardData, setDashboardData] = useState('')
    const [userDetails, setUserDetails] = useState([])
    // useEffect for rate of gold and silver api below

    const handleClick = (url)=>{
        router.push('/dashboard/'+url)
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        // 
        const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders).then(response => response.json())
            .then(async (data) => {
                const decryptedData = await AesDecrypt(data.payload);
                if (token) {
                    
                    setUserDetails(JSON.parse(decryptedData).data)
                }else{
                    router.push('/')
                }

            })
        // setCheckingKycStatus(props?.props?.isKycDone)
    }, [])
   
    return (
        <div>
            <div className=''>
                <div className={style.dashboard_bg}>
                <div className={`${style.dashboard_nav} dashboard`}>
                        <ul className="">
                            <li className={`${activeTab === 'Order' ? 'active' : 'inactive'}`}  onClick={() => handleClick('orders')}>
                                <div className="dashboard_item">
                                    <div className={style.dashboard_text}>Orders</div>
                                </div>
                            </li>
                            <li className={`${activeTab === 'Vault' ? 'active' : 'inactive'}`} onClick={() => handleClick('vault')}>
                                <div className="dashboard_item" >
                                    <div className={style.dashboard_text}>Vault</div>
                                </div>
                            </li>
                            <li className={`${activeTab === 'Reward' ? 'active' : 'inactive'}`}  onClick={() => handleClick('reward')}>
                                <div className="dashboard_item">
                                    <div className={style.dashboard_text}>Redeem</div>
                                </div>
                            </li>
                            <li className={`${activeTab === 'Gifting' ? 'active' : 'inactive'}`} onClick={() => handleClick('gifting')}>
                                <div className="dashboard_item" >
                                    <div className={style.dashboard_text}>Gifting</div>
                                </div>
                            </li>
                            <li className={`${activeTab === 'ReferEarn' ? 'active' : 'inactive'}`}  onClick={() => handleClick('referearn')}>
                                <div className="dashboard_item">
                                    <div className={style.dashboard_text}>Refer & Earn</div>
                                </div>
                            </li>
                        </ul>

                    </div>

                    <div>
                        <DashboardWallet></DashboardWallet>
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
            {/* .dashboard_item{
                display:block;
            } */}
          
             .dashboard ul {
                padding-left:0px !important;
            }
            .dashboard ul li {
                list-style:none;
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

export default Vault