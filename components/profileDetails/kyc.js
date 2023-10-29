import React, { useEffect, useState } from 'react'
import style from './profileDetail.module.css'
import Image from 'next/image'
import { AesDecrypt } from '../middleware'
import AadharCardVerification from './aadharCardVerification';
import PanCardVerification from './PanCardVerification';
import { log } from "../logger";

const UserKyc = (props) => {
  const [editKYC, setEditKYC] = useState(false)
  const [aadhaarNumber, setAadharNumber] = useState()
  const [panNumber, setPanNumber] = useState()
  const [bankName, setBankName] = useState()
  const [ifscCode, setIfscCode] = useState()
  const [accountName, setAccountName] = useState()
  const [accountNumber, setAccountNumber] = useState()
  const [upiId, setUpiId] = useState()

  const funcForDecrypt = async (dataToBeDecrypt) => {
    const response = await AesDecrypt(dataToBeDecrypt)
    return response;
  }
  const KycData = async () => {
    log("props?.userDetails : ", props?.userDetails)
    // const decryptedAadhar = await funcForDecrypt(props?.userDetails?.kyc?.aadhaarNumber);
    // var number = decryptedAadhar;
    // var formattedAadharNumber = "xxxx xxxx " + number.slice(-4);
    const decryptedPan = await funcForDecrypt(props?.userDetails?.kyc?.panNumber);
    // const decryptedBankName = await funcForDecrypt(props?.userDetails?.bankDetails?.bankName);
    // const decryptedIfscCode = await funcForDecrypt(props?.userDetails?.bankDetails?.ifsc);
    // const decryptedAccountName = await funcForDecrypt(props?.userDetails?.bankDetails?.accountName);
    // const decryptedAccountNumber = await funcForDecrypt(props?.userDetails?.bankDetails?.accountNumber);
    // const decryptedUpiId = await funcForDecrypt(props?.userDetails?.bankDetails?.upiId);
    // setAadharNumber(formattedAadharNumber);
    setPanNumber(decryptedPan);
    // setBankName(decryptedBankName)
    // setIfscCode(decryptedIfscCode)
    // setAccountName(decryptedAccountName)
    // setAccountNumber(decryptedAccountNumber)
    // setUpiId(decryptedUpiId)
    // 
  }

  useEffect(() => {
    KycData()
    props.setToggle(!props.toggle)
  }, [])

  return (
    <div>
      <div className={style.userProfile_bg}>

        {props?.userDetails?.isKycDone == true ? (
          <>
            <div className='p-3'>
              <div className={style.profile_details}>
                {/* <div className={style.name}>
                  <div className={style.left_side_data}>Aadhar Card Number</div>
                  <div className={style.right_side_data}>{aadhaarNumber}</div>
                </div> */}
                <div className={style.dob}>
                  <div className={style.left_side_data}>PAN Card Number</div>
                  <div className={style.right_side_data}>{panNumber}</div>
                </div>
              </div>
              {/* <div className={style.edit_details_kyc}>
            <button type="submit" onClick={() => setEditKYC(true)}>Edit Details</button>
          </div> */}
            </div>
          </>
        ) : (
          <>
            {/* <AadharCardVerification props={props} /> */}
            <PanCardVerification props={props} />
          </>
        )}
      </div>
    </div>

  )
}

export default UserKyc
