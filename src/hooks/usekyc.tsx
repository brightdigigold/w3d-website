// hooks/useKyc.js
import { useState } from 'react';
import axios from 'axios';
import { funForAesEncrypt, AesDecrypt } from "@/components/helperFunctions";

export const useKyc = (baseUrl, token) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateKyc = async (values) => {
    setLoading(true);
    setError(null);
    try {
      let payload = {
        documentType: "PANCARD",
        value: values.pancard_number.toUpperCase(),
      };

      const encryptedData = await funForAesEncrypt(payload);
      const formData = new FormData();
      formData.append("documentType", "PANCARD");
      formData.append("value", values.pancard_number);
      formData.append("payload", encryptedData);

      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(`${baseUrl}/user/kyc/verify`, formData, configHeaders);
      const decryptedData = await AesDecrypt(response.data.payload);
      return JSON.parse(decryptedData);
    } catch (err: any) {
      setError(err);
      console.error('KYC update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { updateKyc, loading, error };
};
