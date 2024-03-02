import { api } from "@/api/DashboardServices";
import { funcForDecrypt } from "../components/helperFunctions";
import { useCallback, useEffect, useState } from "react";
import { Product } from "../components/coins/productItem";

export default function useFetchProductCoins(params: any) {
    const [ProductList, setProductList] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
    const getAllProducts = useCallback(async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        let url = `/public/products?limit=50&page=0${params ? `&metal=${params}` : ''}`;
        const response = await api.get(url); 
        if (response.status) {
          const ProductData = await funcForDecrypt(response.data.payload);
          const coins = JSON.parse(ProductData);
          setProductList(coins.data);
        }
      } catch (error: any) {
        setError(error.toString());
      } finally {
        setIsLoading(false);
      }
    }, [params]); 
  
    useEffect(() => {
      getAllProducts();
    }, [getAllProducts]);
  
    return { ProductList, error, isLoading };
  }
  