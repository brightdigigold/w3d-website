import { api } from "@/api/DashboardServices";
import { funcForDecrypt } from "@/components/helperFunctions";
import { useCallback, useEffect, useState } from "react";

export default function useFetchProductDetailsById(id: string) {
    const [productsDetailById, setProductDetailById] = useState<any>();
    const [productId, setproductId] = useState<string>("");
    const [photo, setphoto] = useState<[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getProductById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(`/public/product/${id}/details`);
            if (response.status) {
                const responseOfApi = await funcForDecrypt(response.data.payload);
                const productDetails = JSON.parse(responseOfApi);
                setProductDetailById(productDetails.data);
                setproductId(productDetails.data.sku);
                setphoto(productDetails.data.image);
            }
        } catch (error: any) {
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    }, [id])

    
    useEffect(() => {
        getProductById(id);
      }, [getProductById]);
    
      return { productsDetailById, productId, error, photo, isLoading };
}