import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Nav } from 'react-bootstrap';
import Image from 'next/image';
import style from './profile.module.css'
import { useRouter } from 'next/router'
import { IoIosArrowForward } from 'react-icons/io'
import Header from '@/components/header/header';
import UserProfile from '@/components/profileDetails/profile';
import UserKyc from '@/components/profileDetails/kyc';
import UserPayment from '@/components/profileDetails/payment'
import UserAddress from '@/components/profileDetails/address';
import { AesDecrypt } from "../../components/middleware"
import { log } from '@/components/logger';
import axios from 'axios';
const Profile = () => {
  const router = useRouter();

  const [toggle, setToggle] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [checkingKycStatus, setCheckingKycStatus] = useState('')
  const [checkingAddressStatus, setCheckingAddressStatus] = useState('')
  const handleClick = (activeTab) => {
    setActiveTab(activeTab);
  };

  const [userDetails, setUserDetails] = useState([])
  const funcForDecrypt = async (dataToBeDecrypt) => {
    const response = await AesDecrypt(dataToBeDecrypt)
    return response;
  }
  useEffect(() => {
    const token = localStorage.getItem('token')

    const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders).then(response => response.json())
      .then(async (data) => {
        if (token) {
          const decryptedData = await funcForDecrypt(data.payload);
          setUserDetails(JSON.parse(decryptedData).data)
          setCheckingKycStatus(JSON.parse(decryptedData)?.data?.isKycDone)
          setCheckingAddressStatus(JSON.parse(decryptedData)?.data?.isAddressCompleted)
        } else {
          router.push('/')
        }
      })
  }, [toggle])

  return (
    <div>
      <Header></Header>
      <div className={style.profile_bg}>
        <div className='container user_profile pt-5'>
          <div className='row'>
            <div className='col-md-4 col-12'>
              <ul className="">
                <li className={`${activeTab === 'profile' ? 'active' : 'inactive'}`} onClick={() => handleClick('profile')}>
                  <div className="nav-link" >
                    <div className={style.profile}>
                      <div className={style.profile_img_text}>
                        <div className=''>
                          <Image src={"/images/profile.svg"} height={25} width={25} alt='profile' />
                        </div>
                        <div className={style.profile_text}>Profile</div>
                      </div>
                      <div><IoIosArrowForward style={{ color: "#fff" }} /></div>
                    </div>
                  </div>
                </li>
                <li className={`${activeTab === 'kyc' ? 'active' : 'inactive'}`} onClick={() => handleClick('kyc')}>
                  <div className="nav-link" >
                    <div className={style.profile}>
                      <div className={style.profile_img_text}>
                        <div className=''>
                          <Image src={"/images/kyc.svg"} height={25} width={25} alt='kyc' />
                        </div>
                        <div className={style.profile_text}>KYC</div>
                      </div>
                      <div className={style.notification_arrow}>
                        {!checkingKycStatus ?
                          <div className={style.notification}>1</div> : ""}
                        <div className={style.arrow}>
                          <IoIosArrowForward style={{ color: "#fff" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className={`${activeTab === 'payment' ? 'active' : 'inactive'}`} onClick={() => handleClick('payment')}>
                  <div className="nav-link" >
                    <div className={style.profile}>
                      <div className={style.profile_img_text}>
                        <div className=''>
                          <Image src={"/images/payment.svg"} height={25} width={25} alt='Payment' />
                        </div>
                        <div className={style.profile_text}>Payout Options</div>
                      </div>
                      <div><IoIosArrowForward style={{ color: "#fff" }} /></div>
                    </div>
                  </div>
                </li>
                <li className={`${activeTab === 'address' ? 'active' : 'inactive'}`} onClick={() => handleClick('address')}>
                  <div className="nav-link">
                    <div className={style.profile}>
                      <div className={style.profile_img_text}>
                        <div className=''>
                          <Image src={"/images/location.svg"} height={25} width={25} alt='profile' />
                        </div>
                        <div className={style.profile_text}>Address</div>
                      </div>
                      <div className={style.notification_arrow}>
                        {/* {!checkingAddressStatus ?
                          <div className={style.notification}>1</div> : ""} */}
                        <div className={style.arrow}>
                          <IoIosArrowForward style={{ color: "#fff" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className='col-md-8 col-12'>
              {activeTab === 'profile' && (
                <UserProfile userDetails={userDetails} setToggle={setToggle}
                  toggle={toggle} />
              )}
              {activeTab === 'kyc' && (
                <UserKyc userDetails={userDetails} setToggle={setToggle}
                  toggle={toggle} />

              )}
              {activeTab === 'payment' && (
                <UserPayment userDetails={userDetails} setToggle={setToggle}
                  toggle={toggle}/>
              )}
              {activeTab === 'address' && (
                <UserAddress userDetails={userDetails} setToggle={setToggle}
                  toggle={toggle} />
              )}
            </div>
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
           .user_profile ul li {
                list-style:none;
                margin-bottom:20px;
            }
             .user_profile ul{
              padding-left:0 !important;
             }
           .user_profile .active{
              padding:8px;
              background: rgba(44, 123, 172, 0.2);
              border: 1px solid #2C7BAC;
              border-radius: 8px;
            }
           .user_profile .inactive{
                padding:8px;
                background: rgba(44, 123, 172, 0.2);
                border-radius: 8px;
            }
            `}</style>

    </div>
  )
}

export default Profile
