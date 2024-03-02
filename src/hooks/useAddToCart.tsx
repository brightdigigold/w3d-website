import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import { funForAesEncrypt, funcForDecrypt } from "@/components/helperFunctions";

interface UseAddToCartHook {
    addToCart: (action_type: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
}

export const useAddToCart = (
    _id: string,
    quantity: number,
    productId: string,
    refetch: () => void,
    onSuccessfulAdd: () => void  
): UseAddToCartHook => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const addToCart = async (action_type: string) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const token = localStorage.getItem("token");
            const dataToBeEncrypt = {
                user_id: _id,
                count: quantity,
                product_Id: productId,
                action_type,
                from_App: false,
            };

            const encryptedData = await funForAesEncrypt(dataToBeEncrypt);
            const payloadToSend = { payload: encryptedData };
            const configHeaders = {
                headers: {
                    authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };

            const response = await axios.post(
                `${process.env.baseUrl}/user/ecom/create/cart`,
                payloadToSend,
                configHeaders
            );

            const decryptedData = await funcForDecrypt(response.data.payload);
            const parsedData = JSON.parse(decryptedData);

            if (parsedData.status) {
                setIsSuccess(true);
                onSuccessfulAdd();  // Call this function here
                refetch();
            } else {
                setError('Failed to add to cart');
            }
        } catch (error: any) {
            setError(error.message || 'An error occurred');
            Swal.fire({
                html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Error">`,
                title: "Oops...",
                titleText: "Something went wrong!",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { addToCart, isLoading, error, isSuccess };
};
