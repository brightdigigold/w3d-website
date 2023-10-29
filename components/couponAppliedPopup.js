import React, { useState, useEffect } from 'react'

import { Modal } from 'react-bootstrap';
// import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti';
import { log } from "./logger";

const CouponAppliedPopup = (props) => {
    // 
    const [couponsList, setCouponsList] = useState([])
    // const { width, height } = useWindowSize()

    return (
        <div className='coupon_applies_sucess'>
        {/* <Modal.Body> */}
            <Confetti numberOfPieces={600}/>
            <div className='coupon_applied'>Coupon Applied Successfully</div>
        {/* </Modal.Body> */}
        <style>{`

        .coupon_applies_sucess{
            position: fixed;
            height:100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }
        .couponAppliedpop{
            height:100vh!important;
        }
        .coupon_applied{
            font-weight: 700;
            font-size: 32px;
            line-height: 150%;
            text-transform: capitalize;
            color: #e0b835;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'NunitoSans-ExtraBold';
            text-align:center;
        }    
        `}</style>
    </div>


    )
}

export default CouponAppliedPopup
