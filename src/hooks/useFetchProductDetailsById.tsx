import { api } from "@/api/DashboardServices";
import { funcForDecrypt } from "@/components/helperFunctions";
import { useCallback, useEffect, useState } from "react";

interface ProductDetails {
    coinHave: number;
    createdAt: string;
    description: string;
    dimension: string;
    image: string[];
    imageAlt: string;
    inStock: boolean;
    iteamtype: string;
    makingcharges: string;
    maxForCart: number;
    name: string;
    purity: string;
    quality: string;
    sku: string;
    slug: string;
    status: boolean;
    updatedAt: string;
    weight: number;
    __v: number;
    _id: string;
}


export default function useFetchProductDetailsById(id: string) {
    const [productsDetailById, setProductDetailById] = useState<ProductDetails>();
    const [productId, setproductId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const getProductById = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(`/public/product/${id}/details`);
            if (response.status) {
                const responseOfApi = await funcForDecrypt(response.data.payload);
                const productDetails = JSON.parse(responseOfApi);
                const { ...finalData } = productDetails.data
                setProductDetailById(finalData);
                setproductId(productDetails.data.sku);
            }
        } catch (error: any) {
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    }, [id])

    useEffect(() => {
        getProductById();
    }, [getProductById]);

    return { productsDetailById, productId, error, isLoading };
}