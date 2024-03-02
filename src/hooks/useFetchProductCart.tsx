import { AesDecrypt } from "@/components/helperFunctions";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useFetchProductCart(_id: string) {
    const [coinsInCart, setCoinsInCart] = useState<any[]>([]);
    const [errorCart, setErrorCart] = useState<string | null>(null);
    const [isLoadingCart, setIsLoadingCart] = useState<boolean>(false);

    const getAllProductsOfCart = useCallback(async () => {
        setIsLoadingCart(true);
        setErrorCart(null);

        console.log('called!!!')


        try {
            const token = localStorage.getItem("token");
            const configHeaders = {
                headers: {
                    authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await axios.get(
                `${process.env.baseUrl}/user/ecom/getCartProduct/cart/${_id}`,
                configHeaders
            );
            const decryptedData = AesDecrypt(response.data.payload);
            const finalResult = JSON.parse(decryptedData).data.cartProductForWeb;
            setCoinsInCart(finalResult);
        } catch (error: any) {
            setErrorCart('Unable to get Your Cart Product. Please try again.');
        } finally {
            setIsLoadingCart(false);
        }
    }, [])

    useEffect(() => {
        getAllProductsOfCart();
    }, [getAllProductsOfCart]);

    return { coinsInCart, errorCart, isLoadingCart, refetch: getAllProductsOfCart };
}