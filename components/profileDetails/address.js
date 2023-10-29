import React, { useState } from 'react'
import style from './profileDetail.module.css'
import Image from 'next/image'
import AddressEdit from './addressEdit'
import AddressAdd from './addressAdd'
import { AesEncrypt, AesDecrypt } from "../middleware"
import Swal from "sweetalert2";
import axios from 'axios'
import { log } from "../logger";

const UserAddress = (props) => {
    
    const [isShow, setIsShow] = useState("");
    const [editAddress, setEditAddress] = useState(false)
    const [editAddressId, setEditAddressId] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const userAddress = props?.userDetails?.addresses
    // 

    const deleteAddress = async (deleteItem) => {
        if(!isSubmitting){
            setIsSubmitting(true)

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })
            swalWithBootstrapButtons.fire({
                title: 'Are you sure?',
                text: "You Want to delete this address",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    
                    let dataToBeEncryptPayload = {
                        "id": deleteItem,
                    }
                    const resAfterEncryptData = await AesEncrypt(dataToBeEncryptPayload)
                    // 
                    const payloadToSend = {
                        payload: resAfterEncryptData
                    }
                    const token = localStorage.getItem('token')
                    const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                    const response = await axios.post(`${process.env.baseUrl}/user/address/delete`, payloadToSend, configHeaders);
                    // 
                    const decryptedData = await AesDecrypt(response.data.payload)
                    // 
                    const finalResult = JSON.parse(decryptedData)
                    
                    if (finalResult.status) {
                        props?.setToggle(!props.toggle);
                    } else {
                        alert("some error occured please try again");
                    }
                }
            }).catch((err) => {
                
            }).finally(() =>{
                setIsSubmitting(false);
            });

        }
      
    }

    const editAddressOfUser = (editUserData) => {
        setEditAddressId(editUserData)
        setEditAddress(true)
        setIsShow("edit");
    }
    return (
        <div>
            <div className={style.userProfile_bg}>
                {isShow == "" ?
                    (
                        <>
                            <div className='pt-3'>
                                <div className=''>
                                    <div className='container'>
                                        {userAddress?.map((item, key) => {
                                            return (
                                                <>
                                                    <div className={style.profile_address} key={key}>
                                                        <div className='row pt-3'>
                                                            <div className='col-12'>
                                                                <div className={style.left_side_address}>Address {key+1}</div>
                                                                <div className={style.address1}>{item.address.line1 + ' ' + item.address.line2 + ' ' + item.address.city + ' ' + item.address.state + ' ' + item.address.pincode}</div>
                                                            </div>
                                                            {/* <div className='col-6'>
                                                                <div className={style.right_side_address}>Default Address</div>
                                                            </div> */}
                                                        </div>

                                                        <div className='pt-3'>
                                                            <div className='row'>
                                                                <div className='col-6 text-center p-0'>
                                                                    <div className={style.delete}>
                                                                        <button type="submit" onClick={() => deleteAddress(item._id)}>Delete</button>
                                                                    </div></div>
                                                                <div className='col-6 text-center p-0'>
                                                                    <div className={style.edit}>
                                                                        <button type="submit" onClick={() => editAddressOfUser(item)} >Edit</button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </div>
                                </div>
                                {userAddress?.length > 2 ? (<>
                                    <div className='mt-3'>
                                        <div className={style.add_details_address3}>
                                            <button type="submit" onClick={() => setIsShow("add")} >Add Address</button>
                                        </div>
                                    </div>
                                </>) : (
                                    <>
                                    <div className='p-2'>
                                        <div className={style.add_details_address}>
                                            <button type="submit" onClick={() => setIsShow("add")} >Add Address</button>
                                        </div>
                                        </div>
                                    </>
                                )}


                            </div>
                        </>
                    ) : isShow == "add" ?
                        (
                            <AddressAdd setIsShow={setIsShow} props={props} />
                        ) :
                        <>
                            <AddressEdit setIsShow={setIsShow} props={props} editAddressId={editAddressId} />
                        </>
                }
            </div>
        </div>
    )
}

export default UserAddress
