import { fetchAllUPI } from "@/api/DashboardServices";
import {
  AesDecrypt,
  AesEncrypt,
} from "@/components/helperFunctions";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UpiModal from "./addNewUpiId";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ArchiveBoxXMarkIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import Notiflix from "notiflix";

const AddedBanksOrUpiIds = ({ toggled }: any) => {
  const [upiList, setUpiList] = useState([]);
  const [allUpiList, setAllUpiList] = useState([]);
  const [allBankList, setAllBankList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [TotoggleUPImodal, setToggleUPImodal] = useState(false);
  const [upiUpdated, setupiUpdated] = useState(false);

  const toggleUPImodal = () => {
    setToggleUPImodal(!TotoggleUPImodal);
  };

  const fetchBankAndUPIDetails = async () => {
    try {
      const { UpiList, BankList, decryptedDataList } = await fetchAllUPI();
      setAllUpiList(UpiList);
      setUpiList(upiList);
      setAllBankList(decryptedDataList);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchBankAndUPIDetails();
  }, [toggled, upiUpdated]);


  const deleteUPIOrBankAccount = async (deleteItem: any) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const swalCustomBottons = Swal.mixin({
        customClass: {
          confirmButton: "swalButtonsYes",
          cancelButton: "swalButtonsNo",
        },
        buttonsStyling: false,
      });
      swalCustomBottons
        .fire({
          title: "Are you sure?",
          text: "You Want to delete this UPI",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            Notiflix.Loading.custom({ svgSize: '180px', customSvgCode: '<object type="image/svg+xml" data="/svg/pageloader.svg">svg-animation</object>' });
            let dataToBeEncryptPayload = {
              id: deleteItem,
            };
            const resAfterEncryptData = AesEncrypt(
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
                //  onUploadProgress: Notiflix.Loading.circle()
              },
            };
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/user/destroy/upi`,
              payloadToSend,
              configHeaders
            );
            const decryptedData = AesDecrypt(response.data.payload);
            const finalResult = JSON.parse(decryptedData);
            if (finalResult.status) {
              Notiflix.Loading.remove();
              await fetchBankAndUPIDetails();
            } else {
              alert("some error occured please try again");
            }
          }
        })
        .catch((err) => {
          Notiflix.Loading.remove();
          alert(err);
        })
        .finally(() => {
          Notiflix.Loading.remove();
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="rounded">
      <div className="  coins_background p-4 rounded-bl rounded-br mb-4">
        {allBankList.length == 0 ? (
          <p className="text-center extrabold text-lg">No Bank Added</p>
        ) : (
          <div>
            {allBankList &&
              allBankList.map((bank) => {
                return (
                  <React.Fragment key={bank._id}> 
                    {bank.documentType === "BANKACCOUNT" && (
                      <div>
                        <div className="flex justify-between text-white pb-2">
                          <span className="">Account Holder's Name</span>
                          <span>{AesDecrypt(bank?.bankData?.accountName)}</span>
                        </div>
                        <hr className="border-gray-500" />
                        <div className="flex justify-between text-white pb-2">
                          <span className="">Account Number</span>
                          <span>{AesDecrypt(bank?.bankData?.accountNumber)}</span>
                        </div>
                        <hr className="border-gray-500" />
                        <div className="flex justify-between text-white pb-2">
                          <span className="">Bank Name</span>
                          <span>{AesDecrypt(bank?.bankData?.bankName)}</span>
                        </div>
                        <hr className="border-gray-500" />
                        <div className="flex justify-between text-white pb-2">
                          <span className="">IFSC Code</span>
                          <span>{AesDecrypt(bank?.bankData?.ifsc)}</span>
                        </div>
                        <hr className="border-gray-500" />
                        <button
                          className="bg-themeBlue rounded-lg text-black mt-3 mb-3"
                          onClick={() => {
                            deleteUPIOrBankAccount(bank?._id);
                          }}
                        >
                          <div className=" px-4 py-2"> Delete Bank Details</div>
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        )}
      </div>
      <div>{!allBankList && <div>No Banks or UPI Added</div>}</div>
      <div className=" coins_background rounded">
        <div className="border-b p-4 flex justify-between items-center">
          <p className="text-white flex items-center">
            <img src="/upi.png" className="h-3 inline-block pr-2" />
            UPI Details
          </p>

          <div
            onClick={toggleUPImodal}
            className=" flex items-center gap-1 text-gold01 cursor-pointer"
          >
            <PlusIcon className="h-5" />
            Add UPI
          </div>
        </div>

        {TotoggleUPImodal && (
          <UpiModal
            toggled={toggled}
            toggleUPImodal={toggleUPImodal}
            upiUpdated={upiUpdated}
            setupiUpdated={setupiUpdated}
            onClose={toggleUPImodal}
          />
        )}
        <div className="p-4">
          {allUpiList.length == 0 ? (
            <p className="text-center extrabold text-lg">No UPI ID Added</p>
          ) : (
            <>
              {allBankList &&
                allBankList.map((bank) => {
                  return (
                    <div className="relative" key={bank._id}> 
                      {bank.documentType === "UPI" && (
                        <div
                          className="shadow shadow-gray-100 rounded p-2 mb-4"
                          key={bank._id}  
                        >
                          <div className=" text-white pb-2">
                            <p className=" text-gray-300 flex items-center gap-1">
                              <QrCodeIcon className=" h-4" /> UPI ID 
                            </p>
                            <p>{AesDecrypt(bank?.value)}</p>
                          </div>

                          <button
                            className="text-white absolute top-2 right-2"
                            onClick={() => {
                              deleteUPIOrBankAccount(bank?._id);
                            }}
                          >
                            <ArchiveBoxXMarkIcon className="h-4 text-gold01" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddedBanksOrUpiIds;
