import { selectUser } from "@/redux/userDetailsSlice";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { VscVerifiedFilled } from "react-icons/vsc";
import { MdScheduleSend } from "react-icons/md";
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

const ProfileInfo = ({ onEditDetailsClick }: any) => {
  const user = useSelector(selectUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openEditProfileModel, setOpenEditProfileModel] = useState(false);

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
    <div>
      {openEditProfileModel && <EditProfileModel setOpenEditProfileModel={setOpenEditProfileModel} />}
      <div className="w-full text-white flex flex-col text-sm sm:text-base relative">
        <div className="border-b p-4 flex justify-between items-center">
          <p className=" flex items-center">
            <UserIcon className="h-5 inline-block pr-2 text-themeBlueLight" />{" "}
            Basic Details
          </p>
          <button
            className="font-semibold flex items-center gap-1 text-gold01"
            // onClick={onEditDetailsClick}
            onClick={EditProfileModelHandler}
          >
            <PencilIcon className="h-4 inline-block" /> Edit
          </button>
        </div>
        <div className="p-4 grid sm:grid-cols-2 gap-4">
          <div className="shadow shadow-gray-100 rounded p-3">
            <p className="flex items-center gap-1 mb-3 text-gray-300">
              <PhoneIcon className="h-4" /> Mobile Number
            </p>
            <p className="">{user?.data?.mobile_number}</p>
          </div>

          <div className="shadow shadow-gray-100 rounded p-3">
            <p className="flex items-center gap-1 mb-3 text-gray-300">
              <EnvelopeIcon className="h-4" /> Email ID
            </p>
            <p className=" break-words">
              {user?.data?.email}
              <p className="">
                {user?.data?.isEmailVerified ? (
                  <div className=" flex items-center cursor-pointer mt-4">
                    <VscVerifiedFilled
                      className="cursor-pointer text-green-400"
                      size={24}
                    />
                    <span className="text-green-400"> Email Verified</span>
                  </div>
                ) : (
                  <div onClick={verifyEmail} className=" flex items-center cursor-pointer mt-4">
                    <MdScheduleSend
                      className="cursor-pointer text-yellow-300"
                      size={24}
                    />
                    <span className=" text-yellow-300"> Verify Email</span>
                  </div>
                )}
              </p>
            </p>
          </div>
          <div className=" shadow shadow-gray-100 rounded p-3">
            <p className="flex items-center gap-1 mb-3 text-gray-300">
              <UserIcon className="h-4" /> Gender
            </p>
            <p>{user?.data?.gender?.toUpperCase()}</p>
          </div>
          <div className="shadow shadow-gray-100 rounded p-3">
            <p className="flex items-center gap-1 mb-3 text-gray-300">
              <CalendarIcon className="h-4" /> Date of Birth
            </p>
            <p>
              {new Date(user?.data?.dateOfBirth).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
