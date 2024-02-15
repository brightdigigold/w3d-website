import { fetchCoupons } from "@/api/DashboardServices";
import { useEffect, useState } from "react"

export const useCoupons = () => {
    const [coupons, setCoupons] = useState([])
    useEffect(() => {
        const fetchCouponsData = async () => {
            try {
                const response: any = await fetchCoupons();
                const couponsData = await JSON.parse(response);
                setCoupons(couponsData.data)
            } catch (error) {
                console.error('Error fetching metal data:', error);
            }
        };
        fetchCouponsData()
    }, []);
    return coupons
}