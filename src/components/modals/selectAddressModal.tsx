import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import CustomButton from "../customButton";
import { getUserAddressList } from "@/api/DashboardServices";
import { Address, AddressModalProps } from "@/types";
import { AesDecrypt, AesEncrypt, funForAesEncrypt } from "../helperFunctions";
import ProgressBar from "../progressBar";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import AddAddressModel from "./addAddressModel";
import EditAddressModel from "./editAddressModel";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";

export default function SelectAddress({
  applyDiwaliOffer,
  totalAmountValue,
  transactionId,
  openAddressModal,
  closeAddressModal,
  productsDetailById,
  metalTypeForProgressBar,

}: AddressModalProps) {
  const cancelButtonRef = useRef(null);
  const appliedCouponCode = useSelector((state: RootState) => state.coupon.appliedCouponCode);
  const [editAddress, setEditAddress] = useState<String>();
  const [showEditAddress, setShowEditAddress] = useState<boolean>(false);
  const [showAddNewAddress, setShowAddNewAddress] = useState<boolean>(false);
  const [addressList, setaddressList] = useState<Address[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxAddressCount = 3;
  const [addressId, setaddressId] = useState<String>("");
  const router = useRouter();
  const [errorMess, setErrorMess] = useState<String>("");
  const [token, setToken] = useState<string | null>("");
  const [encryptedPayload, setEncryptedPayload] = useState<string>("");
  const totalAmount = totalAmountValue.toString().replace(/[^\d.]/g, "");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || "");
  }, []);

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
    if (addressList && addressList.length > 0) {
      setaddressId(addressList[0]._id);
    }
  }, []);

  const closeEditAddress = () => {
    setShowEditAddress(false);
  };

  const openAddNewAddress = () => {
    if (addressList && addressList.length < maxAddressCount) {
      setShowAddNewAddress(true);
    } else {
      Swal.fire({
        html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
        title: "Oops...",
        titleText:
          "You can't add more than 3 addresses. Please delete one of the above first.",
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };

  const closeAddNewAddress = () => {
    setShowAddNewAddress(false);
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
              `${process.env.baseUrl}/user/address/delete`,
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
        .catch((err: any) => {
          alert("some error occured please try again");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const validate = () => {
    if (addressId) {
      return true;
    }
    return false;
  };

  const dataToEncrept = {
    orderType: "PRODUCT",
    item: productsDetailById.iteamtype,
    unit: "AMOUNT",
    gram: productsDetailById?.weight,
    amount: +totalAmount,
    order_preview_id: transactionId,
    amountWithoutTax: +totalAmount / +"1.03",
    tax: "3",
    address_id: addressId,
    gst_number: "",
    totalAmount: +totalAmount,
    couponCode: applyDiwaliOffer ? "DIWALIOFFER" : null,
    // couponCode:  null,
    // couponCode: appliedCouponCode,
    product_id: productsDetailById._id,
    itemMode: "PHYSICAL",
    fromApp: false,
    payment_mode: "cashfree",
  };

  const buyHandlerApi = () => {
    if (addressList.length == 0) {
      setErrorMess("No address found");
      return false;
    }
    if (validate()) {
      router.push(`/checkout?data=${encryptedPayload}`);
    } else {
      setErrorMess("Please select address");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const resAfterEncryptData = await funForAesEncrypt(dataToEncrept);
      setEncryptedPayload(resAfterEncryptData);
    };

    fetchData();
  }, [dataToEncrept]);

  return (
    <Transition.Root show={openAddressModal} as={Fragment}>
      <Dialog
        as="div"
        className="z-[110] fixed inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => {
          return false;
          closeAddressModal();
        }}
        data-keyboard="false"
        data-backdrop="static"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0 transform translate-y-10"
              enterTo="opacity-100 transform translate-y-0"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 transform translate-y-0"
              leaveTo="opacity-0 transform translate-y-10"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg coins_backgroun text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                <div className="absolute top-4 right-4 border-1 rounded-full p-2">
                  <XMarkIcon
                    className="h-6 w-6 text-white text-lg cursor-pointer font-bold"
                    onClick={() => {
                      closeAddressModal();
                      // setOpen(false);
                    }}
                  />
                </div>
                {/* address content */}
                <div className="coins_backgroun rounded-xl p-4  w-4/5 relative">
                  {showEditAddress ? (
                    <div>
                      <EditAddressModel
                        ToEditAddress={editAddress}
                        onCancel={closeEditAddress}
                        onAddressListUpdate={updateAddressList}
                      />
                    </div>
                  ) : showAddNewAddress ? (
                    <div>
                      <AddAddressModel
                        onCancel={closeAddNewAddress}
                        onAddressListUpdate={updateAddressList}
                      />
                    </div>
                  ) : (
                    <>
                      {addressList?.map((address: any, key) => (
                        <div className="flex mb-4 mt-2 items-center" key={key}>
                          <div className="mt-2 relative flex-shrink-0">
                            <input
                              type="radio"
                              id={`addressRadio${key}`}
                              className="hidden"
                              name="addressRadio"
                              onChange={() => {
                                setaddressId(address._id);
                                setErrorMess("");
                              }}
                              checked={address._id === addressId}
                            />
                            <label
                              htmlFor={`addressRadio${key}`}
                              className={`cursor-pointer flex items-center justify-center w-6 h-6 border-2 border-gray-300 rounded-full transition-all duration-300 ${address._id === addressId ? "bg-gray-100" : ""
                                }`}
                            >
                              <div className="hidden w-4 h-4 bg-blue-500 rounded-full transition-transform duration-300 transform scale-0 group-checked:scale-100"></div>
                            </label>
                          </div>
                          <div className="ml-4">
                            <p className="text-white text-lg">
                              Address {key + 1}
                            </p>
                            <p className="text-white mt-2">
                              {address?.address?.line1},{" "}
                              {address?.address?.line2},{" "}
                              {address?.address?.city},{" "}
                              {address?.address?.state},{" "}
                              {address?.address?.pincode}
                            </p>
                            <div className="flex items-center justify-end gap-2 mt-2 mb-3 absolute top-0 right-2">
                              <button
                                className="text-gold01"
                                onClick={() => deleteAddress(address._id)}
                              >
                                <ArchiveBoxXMarkIcon className="h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {errorMess && (
                        <p className="text-red-600 text-lg">{errorMess}</p>
                      )}

                      <div className=" flex">
                        <button
                          className="px-2 py-2 bg-themeBlue font-semibold rounded"
                          onClick={openAddNewAddress}
                        >
                          {addressList.length == 0
                            ? "Add Address"
                            : "Add More +"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <ProgressBar
                  fromCart={true}
                  metalTypeForProgressBar={metalTypeForProgressBar.toLowerCase()}
                  displayMetalType={metalTypeForProgressBar.toLowerCase()}
                  purchaseType="buy"
                />
                <div className="justify-between px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <CustomButton
                    btnType="submit"
                    title="PROCEED"
                    containerStyles="mt-3 inline-flex w-full justify-center rounded-xl bg-themeBlue px-5 py-4 text-lg font-bold text-black ring-1 ring-inset sm:mt-0 sm:w-auto"
                    handleClick={() => buyHandlerApi()}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
