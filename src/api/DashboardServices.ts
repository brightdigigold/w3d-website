import { AesDecrypt, funcForDecrypt } from "@/components/helperFunctions";
import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.baseUrl}`, // Replace with your API base URL
});

export const metalPrice = async () => {
  try {
    const response = await fetch(`${process.env.baseUrl}/public/metal/price`, {
      headers: { "content-type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch metal price. Status: ${response.status}`
      );
    }
    const data = await response.json();
    const decryptedData = await funcForDecrypt(data.payload);
    return decryptedData;
  } catch (error: any | Error) {
    // alert(error);
  }
};

export const fetchCoupons = async () => {
  try {
    const response = await fetch(`${process.env.baseUrl}/public/coupons`, {
      headers: { "content-type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Coupons. Status: ${response.status}`);
    }

    const data = await response.json();
    const decryptedData = await funcForDecrypt(data.payload);
    return decryptedData;
  } catch (error: any) {
    // alert(error);
  }
};

export const getUserAddressList = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${process.env.baseUrl}/user/address/list`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const decryptedData = await funcForDecrypt(data.payload);

    return JSON.parse(decryptedData).data;
  } catch (error) {
    // alert(error);
    return [];
  }
};

export const fetchAllUPI = async () => {
  try {
    const token = localStorage.getItem("token");
    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(
      `${process.env.baseUrl}/user/upis`,
      configHeaders
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch UPI data. Status: ${response.status}`);
    }

    const data = await response.json();
    const decryptedData = await AesDecrypt(data.payload);

    let decryptedDataList = JSON.parse(decryptedData).data;
    let UpiList = decryptedDataList.filter(function (value: any) {
      return value.documentType === "UPI";
    });

    let BankList = decryptedDataList.filter(function (value: any) {
      return value.documentType === "UPI";
    });

    return { UpiList, BankList, decryptedDataList };
  } catch (error) {
    console.error(error);
    return { UpiList: [], BankList: [], decryptedDataList: [] }; // Return empty arrays or handle error case accordingly.
  }
};

export const apiForWallet = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.baseUrl}/user/vault`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const decryptedData = await funcForDecrypt(data.payload);
    const userWallet = JSON.parse(decryptedData).data;
    return userWallet;
  } catch (error) {
    alert(error); // You might want to handle or log the error accordingly
  }
};
