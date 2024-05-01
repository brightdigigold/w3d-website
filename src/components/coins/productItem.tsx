import { setShowProfileForm } from '@/redux/authSlice';
import { selectUser } from '@/redux/userDetailsSlice';
import Image from 'next/image';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
    const user = useSelector(selectUser);

    return (
        <div
            className="py-4 rounded-md shadow-xl text-center coins_background transition-transform transform hover:scale-105 hover:shadow-lg hover:shadow-sky-100"
        >
            {item.slug == "5-Gram-Gold-Coin" && <div className="absolute top-0 left-0 px-0  rounded-bl-lg">
                <Image alt="offer image" src="/images/akshayTrityaOffer.gif" width={80} height={80} />
            </div>}

            {item.slug == "10-Gram-Gold-Coin" && <div className=" absolute top-0 left-0 px-0  rounded-bl-lg">
                <Image alt="offer image" src="/images/akshayTrityaOffer.gif" width={80} height={80} />

            </div>}
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
                        <Image
                            src={item.image.image}
                            alt="Bright digi gold coins"
                            width={150}
                            height={90}
                        />
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
                        onClick={() => {
                            if (!isLoggedIn) {
                                handleLoginClick();
                            } else if (!user.data.isBasicDetailsCompleted) {
                                dispatch(setShowProfileForm(true));
                            }
                            else {
                                router.push(`/coins/${item.slug}`);
                            }
                        }}
                        className="my-2 bg-themeBlue rounded-2xl extrabold w-3/4 py-2 block"
                    >
                        VIEW
                    </button>
                </div>
            </div>
        </div>
    )
};

export default ProductItem;
