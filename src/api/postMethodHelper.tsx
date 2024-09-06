import { AesDecrypt, AesEncrypt } from '@/components/helperFunctions';
import axios, { AxiosRequestConfig } from 'axios';
import Notiflix from 'notiflix';

export const postMethodHelperWithEncryption = async (url: string, data: any, headers: AxiosRequestConfig = {}) => {
    try {
        // Notiflix.Loading.circle();
        const encryptedData = AesEncrypt(data);
        // Create request body and header
        const body = {
            payload: encryptedData,
        };
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                ...headers.headers, // Merge custom headers if any
            },
            ...headers, // Include other config options like onUploadProgress
        };
        // Make the POST request
        const response = await axios.post(url, body, config);
        // Decrypt the response
        const decryptedResponse = JSON.parse(AesDecrypt(response.data.payload));
        console.log("decryptedResponse", decryptedResponse);
        // Return structured success response
        return {
            data: decryptedResponse,
            statusCode: response.status,
            statusText: response.statusText,
        };
    } catch (error: any) {
        let errorMsg = "An unexpected error occurred.";
        let statusCode = error.response?.status || 500;
        let decryptedErrorData: any;

        // Axios-specific error handling
        if (axios.isAxiosError(error)) {
            if (error.response?.data?.payload) {
                decryptedErrorData = JSON.parse(AesDecrypt(error.response.data.payload));
            }
            // Handle specific status codes and provide appropriate messages
            if (statusCode === 400) {
                errorMsg = decryptedErrorData?.message || "Bad Request: Invalid input.";
            } else if (statusCode === 500) {
                errorMsg = "Server Error: Please try again later.";
            } else {
                errorMsg = decryptedErrorData?.message || error.message;
            }
            // Log the error for debugging
            // console.log("Axios Error:", {
            //     code: error.code,
            //     message: error.message,
            //     status: statusCode,
            //     data: decryptedErrorData || error.response?.data, // Use decrypted data if available, otherwise raw data
            // });
        }
        // Return structured error response
        return {
            data: null,
            isError: decryptedErrorData?.status === false || true,
            errorMsg,
            status: decryptedErrorData.status,
            statusCode,                                 /* Axios Error Code */
        };
    } finally {
        Notiflix.Loading.remove();
    }
};
