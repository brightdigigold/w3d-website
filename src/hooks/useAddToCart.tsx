import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { postMethodHelperWithEncryption } from '@/api/postMethodHelper';
import Notiflix from 'notiflix';

interface UseAddToCartHook {
    addToCart: (action_type: string, quantity: number, productId: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
}

export const useAddToCart = (
    _id: string,
    refetch?: () => void,
    onSuccessfulAdd?: () => void
): UseAddToCartHook => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const addToCart = async (action_type: string, quantity: number, productId: string) => {
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

            const configHeaders = {
                headers: {
                    authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };

            const result = await postMethodHelperWithEncryption(
                `${process.env.NEXT_PUBLIC_BASE_URL}/user/ecom/create/cart`,
                dataToBeEncrypt, configHeaders
            );

            if (!result.isError && result.data.status) {
                setIsSuccess(true);
                if (onSuccessfulAdd) onSuccessfulAdd(); // Check if onSuccessfulAdd is defined before calling
                if (refetch) refetch(); // Check if refetch is defined before calling
            } else if (result.isError) {
                // Handle error case
                setError(result?.errorMsg)
                Notiflix.Report.failure('Error', result?.errorMsg || 'An unexpected error occurred.', 'OK');
            }
        } catch (error: any) {
            Swal.fire({
                html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Error">`,
                title: "Oops...",
                titleText: 'Something went wrong!',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { addToCart, isLoading, error, isSuccess };
};

