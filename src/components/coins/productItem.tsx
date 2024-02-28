import Image from 'next/image';
import React from 'react';

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


const ProductItem: React.FC<ProductItemProps> = ({ item, isLoggedIn, handleLoginClick, router }) => (
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
            className=""
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
                        } else {
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
);

export default ProductItem;
