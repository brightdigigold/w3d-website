import React, { useState, useRef } from 'react'
import style from './profileDetail.module.css'
import Image from 'next/image'
import ProfileEdit from './profileEdit'
import Swal from "sweetalert2";
import { ThreeCircles } from 'react-loader-spinner'
import { MdEdit } from 'react-icons/md'
import { useEffect } from 'react'
import axios from "axios";
import { VscVerifiedFilled } from 'react-icons/vsc';
import { MdScheduleSend } from 'react-icons/md';
import { AesEncrypt, AesDecrypt } from '../../components/middleware';
import { log } from "../logger";

const UserProfile = (props) => {

    const [editProfile, setEditProfile] = useState(false)
    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [profileImage, setProfileImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setProfileImage(props?.userDetails?.profile_image);
        setIsLoading(false);
        // props?.setToggle(!props.toggle);
    }, [props])
    const handleProfileImageChange = async (event) => {
        if (!isSubmitting) {
            setIsSubmitting(true);
            setIsLoading(true);
            event.stopPropagation();
            const formData = new FormData();
            formData.append("profile_image", event.target.files[0]);
            formData.append('payload', 'CD46F0B542BF044C3F5CEC4AFA6AC27A')

            try {
                const token = localStorage.getItem('token')
                const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
                const response = await axios.post(`${process.env.baseUrl}/user/profile/image`, formData, configHeaders
                )
                // 
                const decryptedData = await AesDecrypt(response.data.payload)
                const finalResult = JSON.parse(decryptedData)
                // 
                if (finalResult.status) {
                    setIsLoading(false);
                    props?.setToggle(!props.toggle);

                } else {
                    alert("Error while uploading Profile Image")
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }

        }
    };

    const databaseDateTime = props?.userDetails?.dateOfBirth;
    const date = new Date(databaseDateTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    // 
    // setDobFormat(formattedDate)

    const verifyEmail = () => {

        if (!isSubmitting) {
            setIsSubmitting(true);
            const token = localStorage.getItem("token");
            const configHeaders = {
                headers: {
                    authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };
            fetch(`${process.env.baseUrl}/user/validate/email`, configHeaders)
                .then((response) => response.json())
                .then(async (response) => {
                    log(response);
                    const decryptedData = await AesDecrypt(response.payload)
                    const finalResult = JSON.parse(decryptedData);
                    Swal.fire({
                        position: 'centre',
                        icon: 'success',
                        title: finalResult.message,
                        showConfirmButton: false,
                        timer: 3000
                    })
                })
                .catch(async (errorInVerifyEmail) => {
                    log(errorInVerifyEmail.payload);
                    const decryptedData = await AesDecrypt(errorInVerifyEmail.payload)
                    const finalResult = JSON.parse(decryptedData);
                    Swal.fire({
                        position: 'centre',
                        icon: 'error',
                        title: finalResult.message,
                        showConfirmButton: false,
                        timer: 3000
                    })
                }).finally(() => {
                    setIsSubmitting(false);
                })
        }
    }
    return (
        <div>
            <div className={style.userProfile_bg}>
                {!editProfile ?
                    (
                        <>
                            <div className='p-3'>
                                <div className={style.profile_image}>
                                    {isLoading ? (
                                        <div className={`${style.profileImage} profileImg`}>
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "15px" }}>
                                                <ThreeCircles
                                                    height="70"
                                                    width="70   "
                                                    color="#EECA47"
                                                    wrapperStyle={{}}
                                                    wrapperClass=""
                                                    visible={true}
                                                    ariaLabel="three-circles-rotating"
                                                    outerCircleColor=""
                                                    innerCircleColor=""
                                                    middleCircleColor=""
                                                />
                                            </div>
                                        </div>

                                    ) : (
                                        <Image
                                            className={style.profileImage}
                                            src={profileImage ? profileImage : "/images/profileImage.png"}
                                            alt="profileImage"
                                            title='Profile-Image'
                                            width={100}
                                            height={100}

                                        />
                                    )}
                                    <div className={`${style.edit_image} edit_image_icons`} >
                                        <div >
                                            <input type='file' id="file"
                                                // ref={fileInputRef}
                                                name="profileImage"
                                                onChange={handleProfileImageChange}
                                                accept="image/*" style={{ color: 'transparent' }} />
                                        </div>
                                    </div>

                                </div>
                                <div className={style.profile_details}>
                                    <div className={style.name}>
                                        <div className={style.left_side_data}>Name</div>
                                        <div className={style.right_side_data}>{props?.userDetails?.name}</div>
                                    </div>
                                    <div className={style.dob}>
                                        <div className={style.left_side_data}>Mobile Number</div>
                                        <div className={style.right_side_data}>{props?.userDetails?.mobile_number}</div>
                                    </div>

                                    <div className={style.dob}>
                                        <div className={style.left_side_data}>Date of Birth</div>
                                        <div className={style.right_side_data}>{formattedDate}</div>
                                    </div>
                                    <div className={style.email}>
                                        <div className={style.left_side_data}>Email ID</div>
                                        <div className={style.right_side_data}>{props?.userDetails?.email}
                                            {props?.userDetails?.isEmailVerified ? <VscVerifiedFilled
                                                className={style.verified_icon}
                                            /> : props?.userDetails?.email ?<div onClick={verifyEmail}>
                                                <MdScheduleSend className={style.verified_text} />
                                            </div>:''}
                                        </div>
                                    </div>
                                    <div className={style.dob}>
                                        <div className={style.left_side_data}>Gender</div>
                                        <div className={style.right_side_data}>{props?.userDetails?.gender?.toUpperCase()}</div>
                                    </div>
                                    <div className={style.gst}>
                                        <div className={style.left_side_data}>GST No.</div>
                                        <div className={style.right_side_data}>{props?.userDetails?.gst_number}</div>
                                    </div>
                                </div>
                                {/* {!props.userDetails.isKycDone ? (
                                    <> */}

                                <div className={style.edit_details}>
                                    <button type="submit" onClick={() => setEditProfile(true)}>Edit Details</button>
                                </div>

                                {/* </>
                                ) : ""} */}

                            </div>
                        </>
                    ) :
                    (
                        <>
                            <ProfileEdit onHide={() => setEditProfile(false)} props={props} formattedDate={formattedDate} />
                        </>
                    )}

            </div>
        </div>
    )
}

export default UserProfile
