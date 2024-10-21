import { AesDecrypt } from '@/components/helperFunctions';
import axios from 'axios';
import React, { memo, useRef, useState } from 'react'

const CheckPinCode = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [delivery, setDeliverey] = useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pincodeValue = e.currentTarget.pincode.value;
    // Validate pincode
    if (!pincodeValue) {
      setPincodeError("Please enter a 6-digit pincode.");
      return;
    }
    if (pincodeValue.toString() < 6) {
      setPincodeError("Please enter a 6-digit pincode.");
      return;
    }
    if (!pincodeValue.match(/^\d{6}$/)) {
      setPincodeError("Invalid pincode. Please enter a 6-digit pincode.");
      return;
    } else {
      setPincodeError(null);
    }
    // Handle form submission logic here
    try {
      const token = localStorage.getItem("token");
      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/ecom/pincode/${pincodeValue}`,
        configHeaders
      );
      const decryptedData = AesDecrypt(response.data.payload);
      const finalResult = JSON.parse(decryptedData);
      if (finalResult.data.length > 0) {
        setDeliverey(true);
        setPincodeError(`Available at ${pincodeValue} pincode`);
      } else {
        setDeliverey(false);
        setPincodeError(`Not available at ${pincodeValue} pincode`);
      }
    } catch (error: any) {
      setPincodeError(error);
    }
  };

  return (
    <div className="py-2 mt-4">
      <form ref={formRef} onSubmit={handleFormSubmit}>
        <label className="text-sm">Check Pincode Availability</label>
        <br />
        <div className="rounded-md bg-themeLight px-4 py-2 relative">
          <input
            name="pincode"
            type="tel"
            className="text-white bg-transparent w-full focus:outline-none h-8"
            placeholder="Enter Your Pincode"
            maxLength={6}
            // pattern="\d{6}"
            // required
            onChange={(event) => {
              const { value } = event.target;
              const updatedValue = value.replace(/[^0-9]/g, "");
              event.target.value = updatedValue;
              setPincodeError(null);
            }}
          />
          <button
            className=" absolute right-4 rounded-xl text-yellow-400 border border-yellow-400 px-5 py-1"
            type="submit"
          >
            Check
          </button>
        </div>
        {pincodeError && delivery == true ? (
          <div className="text-green-500">{pincodeError}</div>
        ) : (
          <div className="text-red-500">{pincodeError}</div>
        )}
      </form>
    </div>
  );
}

export default memo(CheckPinCode)