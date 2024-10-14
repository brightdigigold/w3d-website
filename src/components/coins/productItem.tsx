import { setShowProfileForm } from '@/redux/authSlice';
import { RootState } from '@/redux/store';
import { selectUser } from '@/redux/userDetailsSlice';
import Image from "next/image";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';

export interface Product {
    slug: string;
    image: { image: string };
    name: string;
    makingcharges: number;
    iteamtype: string;
}

export interface ProductItemProps {
    item: Product;
    isLoggedIn: boolean;
    handleLoginClick: () => void;
    router: any;
}

const ProductItem: React.FC<ProductItemProps> = ({ item, isLoggedIn, handleLoginClick, router }) => {
    const dispatch = useDispatch();
    const devotee_isNewUser = useSelector((state: RootState) => state.auth.devotee_isNewUser);
    const isLoggedInForTempleReceipt = useSelector((state: RootState) => state.auth.isLoggedInForTempleReceipt);
    const user = useSelector(selectUser);
    const [isLoading, setIsLoading] = useState(false);

    const handleViewClick = async () => {
        setIsLoading(true);
        Notiflix.Loading.pulse('Loading...');
        try {
            if (isLoggedIn) {
                router.push(`/coins/${item.slug}`);
            }
            else if (!isLoggedIn && !isLoggedInForTempleReceipt) {
                handleLoginClick();
            }
            else if (isLoggedInForTempleReceipt && devotee_isNewUser) {
                dispatch(setShowProfileForm(true));
            }
            else if (!user.data.isBasicDetailsCompleted) {
                dispatch(setShowProfileForm(true));
            }
        } finally {
            setIsLoading(false);
            Notiflix.Loading.remove();
        }
    };

    return (
        <div
            className="py-4 rounded-md shadow-xl text-center coins_background transition-transform transform hover:scale-105 hover:shadow-lg hover:shadow-sky-100"
        >
            <div
                style={{
                    backgroundSize: "cover",
                    backgroundPosition: "bottom",
                    backgroundImage: `url(${item.iteamtype.toLowerCase() === "gold"
                        ? "/images/goldpart.png"
                        : "/images/silverpart.png"
                        })`,
                }}
            >
                <div className="flex flex-col items-center px-2">
                    <div>
                        {(item.slug == "5-Gram-Gold-Coin" || item.slug == "10-Gram-Gold-Coin") && <div className="absolute top-0 left-0 px-0  rounded-bl-lg">
                            <img alt="offer image" src="/images/akshayTrityaOffer.gif" className='h-14 sm:h-20' />
                        </div>}
                        <Image
                            src={item.image.image}
                            alt="Bright digi gold coins"
                            width={256}
                            height={256}
                            style={{
                                maxWidth: "100%",
                                height: "auto"
                            }} />
                    </div>
                    <div className="mt-2 text-xs sm:text-base text-white">
                        {item.name}
                    </div>
                    <div className="text-themeBlueLight text-xs sm:text-lg items-center">
                        Making charges
                        <span className="text-base sm:text-2xl bold ml-1">
                            ₹{item.makingcharges}
                        </span>
                    </div>
                    <button
                        onClick={handleViewClick}
                        className="my-2 bg-themeBlue rounded-2xl extrabold w-3/4 py-2 block justify-center items-center"
                        disabled={isLoading}
                    >
                        VIEW
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
