import { AesDecrypt } from "@/components/helperFunctions";
import { AppDispatch } from "@/redux/store";
import { fetchUserDetails, selectUser } from "@/redux/userDetailsSlice";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { CameraIcon } from "@heroicons/react/20/solid";

const ProfileImage = () => {
  const user = useSelector(selectUser);
  const dispatch: AppDispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setrefresh] = useState(false)


  const handleProfileImageChange = async (event: any) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      setIsLoading(true);
      event.stopPropagation();
      const formData = new FormData();
      formData.append("profile_image", event.target.files[0]);
      formData.append("payload", "CD46F0B542BF044C3F5CEC4AFA6AC27A");

      try {
        const token = localStorage.getItem("token");
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/profile/image`,
          formData,
          configHeaders
        );
        const decryptedData = AesDecrypt(response.data.payload);
        const finalResult = JSON.parse(decryptedData);
        if (finalResult.status) {
          setrefresh(true)
          setIsLoading(false);
        } else {
          alert("Error while uploading Profile Image");
        }
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUserDetails());
    };

    fetchData();
  }, [dispatch, refresh]);

  return (
    <div className="rounded-t-lg w-full sm:w-auto relative">
      {/* {isLoading && <Loading />} */}
      <div className="relative">
        <Image
          key={user?.data?.profile_image}
          src={
            user?.data?.profile_image
              ? user?.data?.profile_image
              : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
          }
          alt="profile image"
          width={150}
          height={150}
          className="my-4 rounded-full mx-auto h-44 w-44 flex items-center justify-center border-2 border-sky-200"
          />
        <label
          htmlFor="file"
          className="absolute bottom-0 left-28 sm:left-28 shadow shadow-gray-200 text-themeBlueLight focus:outline-none p-2 bg-theme rounded-full"
        >
          <CameraIcon className="cursor-pointer h-6" />
        </label>
      </div>
      {/* Edit icon */}
      <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 focus:outline-none">
        <div className="relative">
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            name="profileImage"
            className="sr-only"
            onChange={handleProfileImageChange}
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileImage;
