import { selectUser } from "@/redux/userDetailsSlice";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { VscVerifiedFilled } from "react-icons/vsc";
import { AiOutlineUser } from 'react-icons/ai';
import { MdBusiness } from 'react-icons/md';
import { MdScheduleSend } from "react-icons/md";
import { AiOutlineFileText } from 'react-icons/ai';
import { HiIdentification } from 'react-icons/hi';
import Swal from "sweetalert2";
import { AesDecrypt } from "@/components/helperFunctions";
import {
  CalendarIcon,
  EnvelopeIcon,
  PencilIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import EditProfileModel from "@/components/modals/editProfileModel";
import clsx from "clsx";

const ProfileInfo = () => {
  const user = useSelector(selectUser);
  const userType = user.data.type;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openEditProfileModel, setOpenEditProfileModel] = useState(false);
  // console.log("user", user);

  const EditProfileModelHandler = () => {
    setOpenEditProfileModel(!openEditProfileModel);
  };

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
          const decryptedData = await AesDecrypt(response.payload);
          const finalResult = JSON.parse(decryptedData);
          Swal.fire({
            html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
            width: '450px',
            padding: '4em',
            title: finalResult.message,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch(async (errorInVerifyEmail) => {
          const decryptedData = await AesDecrypt(errorInVerifyEmail.payload);
          const finalResult = JSON.parse(decryptedData);
          Swal.fire({
            html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
            title: finalResult.message,
            showConfirmButton: false,
            timer: 3000,
          });
        })
        .finally(() => {
          setIsLoading(false);
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className={clsx({ 'mt-4': userType !== "corporate", })}>
      {openEditProfileModel && <EditProfileModel setOpenEditProfileModel={setOpenEditProfileModel} />}
      <div className="w-full text-white flex flex-col text-sm sm:text-base relative">
        <div className="border-b p-4 flex justify-between items-center">
          <div className=" flex items-center">
            <UserIcon className="h-5 inline-block pr-2 text-themeBlueLight" />{" "}
            Basic Details
          </div>
          <button
            className="bold flex items-center gap-1 text-gold01"
            onClick={EditProfileModelHandler}
          >
            <PencilIcon className="h-4 inline-block" /> Edit
          </button>
        </div>
        <div className="p-4 grid sm:grid-cols-2 gap-4">
          {userType === "corporate" && (<>
            <div className="shadow shadow-gray-100 rounded p-3">
              <div className="flex items-center gap-1 mb-3 text-gray-300">
                <AiOutlineUser className="h-4" /> Name
              </div>
              <p>
                {user.data.name}
              </p>
            </div>
            <div className="shadow shadow-gray-100 rounded p-3">
              <div className="flex items-center gap-1 mb-3 text-gray-300">
                <CalendarIcon className="h-4" /> Date of Registration
              </div>
              <p>
                {new Date(user?.data?.dateOfBirth).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="shadow shadow-gray-100 rounded p-3">
              <div className="flex items-center gap-1 mb-3 text-gray-300">
                <AiOutlineFileText className="h-4" /> GST Number
              </div>
              <p>
                {user.data.gst_number}
              </p>
            </div>
            <div className="shadow shadow-gray-100 rounded p-3">
              <div className="flex items-center gap-1 mb-3 text-gray-300">
                <HiIdentification className="h-4" /> PAN Number
              </div>
              <p>
                {user.data.name}
              </p>
            </div>
            <div className="shadow shadow-gray-100 rounded p-3">
              <div className="flex items-center gap-1 mb-3 text-gray-300">
                <MdBusiness className="h-4" />Company Name
              </div>
              <p>
                {user.data.legalName}
              </p>
            </div>
          </>)}

          <div className="shadow shadow-gray-100 rounded p-3">
            <div className="flex items-center gap-1 mb-3 text-gray-300">
              <PhoneIcon className="h-4" /> Mobile Number
            </div>
            <p className="">{user?.data?.mobile_number}</p>
          </div>
          {userType !== "corporate" && <div className="shadow shadow-gray-100 rounded p-3">
            <div className="flex items-center gap-1 mb-3 text-gray-300">
              <CalendarIcon className="h-4" /> Date of Birth
            </div>
            <p>
              {new Date(user?.data?.dateOfBirth).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>}
          {userType !== "corporate" && <div className=" shadow shadow-gray-100 rounded p-3">
            <div className="flex items-center gap-1 mb-3 text-gray-300">
              <UserIcon className="h-4" /> Gender
            </div>
            <p>{user?.data?.gender?.toUpperCase()}</p>
          </div>}
          <div className="shadow shadow-gray-100 rounded p-3">
            <div className="flex items-center gap-1 mb-3 text-gray-300">
              <EnvelopeIcon className="h-4" /> Email ID
            </div>
            <div className=" break-words">
              {user?.data?.email}
              <div className="">
                {user?.data?.isEmailVerified ? (
                  <span className=" flex items-center cursor-pointer mt-4">
                    <VscVerifiedFilled
                      className="cursor-pointer text-green-400"
                      size={24}
                    />
                    <span className="text-green-400"> Email Verified</span>
                  </span>
                ) : (
                  <div onClick={verifyEmail} className=" flex items-center cursor-pointer mt-4">
                    <MdScheduleSend
                      className="cursor-pointer text-yellow-300"
                      size={24}
                    />
                    <span className=" text-yellow-300"> Verify Email</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
