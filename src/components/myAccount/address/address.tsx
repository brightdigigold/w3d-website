import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUserAddressList } from "@/api/DashboardServices";
import { AesDecrypt, AesEncrypt } from "@/components/helperFunctions";
import axios from "axios";
import CustomButton from "@/components/customButton";
import { PlusIcon } from "@heroicons/react/20/solid";
import {
  ArchiveBoxXMarkIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import EditAddressModel from "@/components/modals/editAddressModel";
import AddAddressModel from "@/components/modals/addAddressModel";

const AddressTab = () => {
  const [editAddress, setEditAddress] = useState<String>();
  const [showEditAddress, setShowEditAddress] = useState<boolean>(false);
  const [addressList, setaddressList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxAddressCount = 3;
  const [openAddAddressModel, setOpenAddAddressModel] = useState(false);

  const AddAddressModelHandler = () => {
    setOpenAddAddressModel(!openAddAddressModel);
  };

  const handleCloseAddAddressModal = () => {
    setOpenAddAddressModel(false);
  };

  const updateAddressList = async () => {
    try {
      const addresses = await getUserAddressList();
      setaddressList(addresses);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    updateAddressList();
  }, []);

  const closeEditAddress = () => {
    setShowEditAddress(false);
  };

  const openAddNewAddress = () => {
    if (addressList && addressList.length < maxAddressCount) {
      AddAddressModelHandler();
    } else {
      Swal.fire({
        html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
        title: "You can't add more than 3 addresses. ",
        showConfirmButton: false,
        timer: 2500,
        width: '450px',
        padding: '4em',
      });
    }
  };

  const deleteAddress = async (deleteItem: any) => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      const swalButtons = Swal.mixin({
        customClass: {
          confirmButton: "swalButtonsYes",
          cancelButton: "swalButtonsNo",
        },
        buttonsStyling: false,
      });
      swalButtons
        .fire({
          title: "Are you sure?",
          text: "You Want to delete this address",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            let dataToBeEncryptPayload = {
              id: deleteItem,
            };
            const resAfterEncryptData = await AesEncrypt(
              dataToBeEncryptPayload
            );
            const payloadToSend = {
              payload: resAfterEncryptData,
            };
            const token = localStorage.getItem("token");
            const configHeaders = {
              headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            };
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/user/address/delete`,
              payloadToSend,
              configHeaders
            );
            const decryptedData = AesDecrypt(response.data.payload);
            const finalResult = JSON.parse(decryptedData);
            if (finalResult.status) {
              updateAddressList();
            } else {
              alert("some error occured please try again");
            }
          }
        })
        .catch((err) => {
          alert("some error occured please try again");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <>
      {openAddAddressModel && (
        <AddAddressModel
          onAddressListUpdate={updateAddressList}
          onCancel={handleCloseAddAddressModal}
        />
      )}
      <div className="coins_background rounded-lg mt-4">
        <div className="border-b p-4 flex justify-between items-center">
          <div className="text-white flex items-center">
            <img src="/location.png" alt="location icon" className="h-5 inline-block pr-2" />
            Address Details
          </div>
          <button
            className="bold flex items-center gap-1 text-gold01"
            onClick={openAddNewAddress}
          >
            {addressList.length > 0 && (<PlusIcon className="h-5" />)}  {addressList.length === 0 ? "" : "Add More"}
          </button>
        </div>
        {showEditAddress && (
          <div>
            <EditAddressModel
              ToEditAddress={editAddress}
              onCancel={closeEditAddress}
              onAddressListUpdate={updateAddressList}
            />
          </div>
        )}
        <>
          {addressList.length === 0 && (
            <div className="p-4 flex justify-center">
              <CustomButton
                title="Add Address"
                containerStyles="cursor-pointer bg-themeBlue text-black mt-4  px-3 text-center py-3 rounded"
                handleClick={() => {
                  openAddNewAddress();
                }}
              />
            </div>
          )}
          <div className=" grid sm:grid-cols-2 gap-4 p-4">
            {addressList?.map((address: any, key) => (
              <div
                className="shadow shadow-gray-100 rounded p-3 relative"
                key={key}
              >
                <span className="">
                  <div className="pl-1 mt-4 mb-4 text-white">
                    <p>{address?.address?.line1},</p>
                    <p>{address?.address?.line2},</p>
                    <p>{address?.address?.city},</p>
                    <p>{address?.address?.state},</p>
                    <p>{address?.address?.pincode}</p>
                  </div>
                </span>
                <div className="flex items-center justify-end gap-2 mt-2 mb-3 absolute top-0 right-2">
                  <button
                    className=" text-gold01"
                    onClick={() => {
                      setEditAddress(address);
                      setShowEditAddress(true);
                    }}
                  >
                    <PencilSquareIcon className="h-4" />
                  </button>
                  <div className=" flex justify-end">
                    <button
                      className="text-gold01"
                      onClick={() => deleteAddress(address._id)}
                    >
                      <ArchiveBoxXMarkIcon className="h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </div>
    </>
  );
};

export default AddressTab;
