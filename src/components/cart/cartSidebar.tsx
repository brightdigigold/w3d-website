"use client";
import { funcForDecrypt } from "@/components/helperFunctions";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { api } from "@/api/DashboardServices";
import CustomButton from "../customButton";
interface CartSideBarProps {
  isOpen: boolean;
  onClose: () => void;
  productsDetailById: any;
  totalCoins: number;
}

const CartSideBar: React.FC<CartSideBarProps> = ({
  isOpen,
  onClose,
  productsDetailById,
  totalCoins,
}) => {
  const [ProductList, setProductList] = useState<any[]>([]);

  useEffect(() => {
    getAllProducts("ALL");
  }, []);

  const getAllProducts = async (params: any) => {
    try {
      let url = `/public/products?limit=50&page=0`;
      if (params) {
        url = `/public/products?limit=50&page=0&metal=${params}`;
      }
      const response = await api.get(url);
      if (response.status) {
        const coins = await funcForDecrypt(response.data.payload);
        const x = JSON.parse(coins);
        const shuffledProducts = shuffle(x.data); // Shuffle the products
        setProductList(shuffledProducts.slice(0, 4)); // Display any 4 products
      }
    } catch (error) {
      // alert(error);
    }
  };

  // Shuffle function
  const shuffle = (array: any[]) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };
  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <aside
    ref={sidebarRef}
      className={`fixed top-0 right-0 h-full lg:w-6/12 md:w-8/12 sm:w-8/12 bg-theme shadow-lg transform translate-x-${
        isOpen ? "0" : "full"
      } transition-transform ease-in-out z-50`}
      style={{ zIndex: 1000, maxHeight: "100vh", overflowY: "auto" }}
    >
      <div className="grid h-screen mt-12 w-full">
        <div className="w-full p-4">
          <button
            onClick={onClose}
            className="absolute top-6 end-2.5 text-white hover:text-gold01 text-xl cursor-pointer"
          >
            <FaTimes size={26} className="text-themeBlueLight" />
          </button>
          <p className="text-center text-2xl">Add More Products</p>
          <div className="flex items-center mt-12">
            <div className="border-2 border-gray-100 p-2">
              <Image
                src={productsDetailById.image[0]}
                alt={productsDetailById.imageAlt}
                height={100}
                width={120}
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
            </div>
            <div>
              <p className="text-green-400 text-2xl ml-6">Added to cart</p>
              <p className="text-white text-xl ml-6">
                {productsDetailById.name}
              </p>
            </div>
          </div>
          <div className="mt-6">
            {ProductList.reduce((pairs, item, index) => {
              if (index % 2 === 0) {
                pairs.push([]);
              }
              pairs[pairs.length - 1].push(item);
              return pairs;
            }, []).map(
              (pair: any[], pairIndex: React.Key | null | undefined) => (
                <div key={pairIndex} className="flex space-x-4 py-3">
                  {pair.map((item, index) => (
                    <div
                      key={index}
                      className="py-4 rounded-md shadow-xl text-center coins_background transition-transform transform hover:scale-105  hover:shadow-lg hover:shadow-sky-100 flex-grow"
                      style={{ flex: "1" }}
                    >
                      <div
                        style={{
                          backgroundSize: "cover",
                          backgroundPosition: "bottom",
                          backgroundImage: `url(${
                            item.iteamtype.toLowerCase() === "gold"
                              ? "/images/goldpart.png"
                              : "/images/silverpart.png"
                          })`,
                        }}
                        className=""
                      >
                        <div className="flex flex-col items-center py-2 px-2">
                          <div>
                            <Image
                              src={item.image.image}
                              alt="coin image"
                              width={100}
                              height={90}
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
                            <span className="text-base sm:text-2xl font-bold ml-1">
                              ₹{item.makingcharges}
                            </span>
                          </div>
                          <Link
                            href={`/coins/${item.slug}`}
                            className="my-2 bg-themeBlue text-black rounded-2xl font-extrabold w-3/4 py-2 block"
                          >
                            VIEW
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
        <div className="text-center pb-12">
          <Link
            className="cursor-pointer font-semibold bg-themeBlue text-black w-1/2 text-center py-2 px-10 rounded-xl"
            href="/cart"
          >
            <CustomButton
              title="GO TO CART"
              isDisabled={!productsDetailById.inStock}
            />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default CartSideBar;
