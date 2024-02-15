"use client";
import { HomeIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

const AddressComponent = ({ addressList, onSelectAddress }: any) => {
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(
    addressList && addressList.length > 0 ? addressList[0] : null
  );

  useEffect(() => {
    setSelectedAddress(
      addressList && addressList.length > 0 ? addressList[0] : null
    );
    onSelectAddress(
      addressList && addressList.length > 0 ? addressList[0]._id : null
    );
  }, [addressList]);

  const handleAddressChange = () => {
    setShowAllAddresses(true);
  };

  const handleRadioChange = (address: any) => {
    setSelectedAddress(address);
    setShowAllAddresses(false);
    onSelectAddress(address._id);
  };

  return (
    <div className="mb-4 border-b-2 pb-4 border-yellow-500">
      <div>
        {showAllAddresses && (
          <div className="cursor-pointer">
            {addressList &&
              addressList.map((address: any) => (
                <div key={address._id}>
                  <div className="cursor-pointer flex items-center rounded-xl bg-themeLight mb-3 sm:p-4 p-3 shadow-black shadow-sm">
                    <input
                      id={address._id}
                      name="address"
                      type="radio"
                      checked={
                        selectedAddress && selectedAddress._id === address._id
                      }
                      onChange={() => handleRadioChange(address)}
                      className="h-5 w-5 placeholder:text-gray-500"
                    />
                    <label className="pl-2 cursor-pointer" htmlFor={address._id}>
                      {`${address.address.line1}, ${address.address.line2}, ${address.address.city}, ${address.address.state}, ${address.address.pincode}`}
                    </label>
                  </div>
                </div>
              ))}
          </div>
        )}
        <div className="flex justify-between items-center gap-4">
          <div className="flex flex-col cursor-pointer">
            <div className="">
              <div className="text-sm rounded-xl sm:py-3 flex items-center">
                {selectedAddress && (
                  <HomeIcon className="h-16 sm:h-8 inline-block pr-4 text-themeBlueLight" />
                )}
                <div>
                  {addressList && addressList.length > 0 && <p className="text-md extrabold">Delivering to Address</p>}
                  {selectedAddress &&
                    `${selectedAddress.address.line1}, ${selectedAddress.address.line2}, ${selectedAddress.address.city}, ${selectedAddress.address.state}, ${selectedAddress.address.pincode}`}
                </div>
              </div>
            </div>
          </div>

          <div>
            {addressList && addressList.length > 1 && (
              <button
                className="bg-themeBlue text-black px-2 py-0 rounded"
                onClick={handleAddressChange}
              >
                Change
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressComponent;
