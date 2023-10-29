
import React, { useState, useEffect } from "react";
import LoginScreen from './loginScreen'
import OTPScreen from './otpScreen';
import SetUpProfile from './setUpProfile';
import MiscallPopup from './misscallPopup'
import { useSelector } from "react-redux";
import { log } from "../logger";

const LoginProfile = ({ show, redirectData = null,onHide }) => {
    const [toggle, setToggle] = useState(0)
    const [updateData, setUpdateData] = useState()
    
    const reduxData = useSelector((state) => {
        return state.auth
      })
    //   log("reduxData in login aside : ",reduxData)

    useEffect(()=>{
        const token = localStorage.getItem('token');
        log("token in use effect in login aside : ",token)
        if(token){
            log("hererere")
            if(reduxData.isProfileFilled == false){
                log("here")
                setToggle(2)
            }
        }
    },[])
    
    // log("toggle value : ", toggle)
    const ListenUpdatedData = (data) => {
        
        setUpdateData(data)
    }
    // 
    return (
        <div>
            <div className={`aside ${show ? 'show' : ''}`}>
                {toggle === 0 &&
                    (
                        <>
                        <LoginScreen setToggle={setToggle} onHide={onHide} redirectData={redirectData} updateData={ListenUpdatedData} />
                        </>
                    )
                }
                {toggle === 1 &&
                    (
                        <>
                        <OTPScreen setToggle={setToggle} onHide={onHide} redirectData={redirectData}  updateData={ListenUpdatedData} />
                        </>
                    )
                }
                {toggle === 2 &&
                    (
                        <>
                            <SetUpProfile setToggle={setToggle} redirectData={redirectData} onHide={onHide} />
                        </>
                    )}
                {toggle === 3 &&
                    (
                        <>
                            <MiscallPopup setToggle={setToggle} redirectData={redirectData} onHide={onHide} updateData={updateData} />
                        </>
                    )
                }
            </div>
            <style>{`
                .aside {
                position: fixed;
                top: 0;
                right: -450px;
                width: 450px !important;
                height: 100vh;
                background: linear-gradient(0.69deg, #154C6D 0.62%, #12242E 101.27%);
                border-radius: 8px 0px 0px 8px;
                z-index: 1000;
                transition: right 0.3s ease-out !important;
            }

            .aside.show {
                right: 0;
                z-index:1020;
                justify-content: center;
                align-items: center;
                display: flex;
            }

            .aside.show .maincomponent{
                width:100%;
            }
            @media screen and (max-width:480px) {
                .aside {
                position: fixed;
                top: 0;
                width: 100% !important;
                    // right: -450px;
                }
            `}</style>
        </div>
    )
}

export default LoginProfile
