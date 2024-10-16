"use client";
import Loading from "@/app/loading";
import LoginAside from "@/components/authSection/loginAside";
import CartSideBar from "@/components/cart/cartSidebar";
import { ParseFloat } from "@/components/helperFunctions";
import CoinModal from "@/components/modals/buyCoinModal";
import OtpModal from "@/components/modals/otpModal";
import { RootState } from "@/redux/store";
import { selectUser } from "@/redux/userDetailsSlice";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import SimpleImageSlider from "react-simple-image-slider";
import { useRouter } from "next/navigation";
import CustomImageButton from "@/components/customImageButton";
import { SelectGoldData, SelectSilverData } from "@/redux/metalSlice";
import CheckPinCode from "../ProductDetails/checkPinCode";
import useFetchProductDetailsById from "../../../hooks/useFetchProductDetailsById";
import useFetchProductCart from "@/hooks/useFetchProductCart";
import { useAddToCart } from "@/hooks/useAddToCart";
import ProductDescription from "../ProductDetails/productDescription";
import { setShowProfileForm } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import ImageGallery from "../ProductDetails/productImage";
import Image from "next/image";
import CustomButton from "@/components/customButton";
import { MdInfo } from "react-icons/md";
import Swal from "sweetalert2";
import { numberToWords } from "@/utils/helperFunctions";

const page = ({ params: { slug } }: { params: { slug: string } }) => {
  // console.log("params: " , slug);
  const user = useSelector(selectUser);
  const router = useRouter();
  const id = slug;
  const { _id } = user.data;
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState<number>(1);
  const { productsDetailById, productId, isLoading, } = useFetchProductDetailsById(id);
  const { coinsInCart, isLoadingCart, errorCart, refetch } = useFetchProductCart(_id);
  const onSuccessfulAdd = () => setOpenCartSidebar(true);
  const { addToCart, isSuccess, error} = useAddToCart(_id, refetch, onSuccessfulAdd);
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const goldData = useSelector(SelectGoldData);
  const silverData = useSelector(SelectSilverData);
  const [openCoinModal, setOpenCoinModal] = useState<boolean>(false);
  const [maxCoinError, setMaxCoinError] = useState<string>("");
  const [openLoginAside, setOpenLoginAside] = useState<boolean>(false);
  const [openCartSidebar, setOpenCartSidebar] = useState<boolean>(false);
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);
  const [applyDiwaliOffer, setapplyDiwaliOffer] = useState(false);

  useEffect(() => {
    const productCount = getProductCountById(coinsInCart, productId);
    setQuantity(productCount === 0 ? 1 : productCount);
    setCartQuantity(productCount);
  }, [coinsInCart]);

  const openCoinModalHandler = () => {
    // console.log("isloggedIn", isloggedIn)
    if (isloggedIn) {
      setMaxCoinError("");

      if (!user?.data?.isBasicDetailsCompleted) {
        dispatch(setShowProfileForm(true));
        return;
      }
      setOpenCoinModal(true);
    } else {
      handleLoginClick();
    }
  };

  const closeCoinModalHandler = () => {
    setOpenCoinModal(false);
  };

  const getProductCountById = (coinsInCart: any, productId: any) => {
    for (const cartItem of coinsInCart) {
      if (cartItem.product.sku == productId) {
        return cartItem.product.count;
      }
    }
    return 0;
  };

  const increaseQty = useCallback(() => {
    if (quantity <= 99 && productsDetailById?.coinHave !== undefined && productsDetailById?.coinHave > quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
      setMaxCoinError("");
    } else if (quantity <= 99 && productsDetailById?.coinHave === undefined) {
      setMaxCoinError("Oops! This Coin Is Not Available. Please Try Again After Some Time.");
    } else {
      setMaxCoinError(`You can only purchase ${quantity} coins.`);
    }
  }, [quantity, productsDetailById]);


  const decreaseQty = useCallback(() => {
    setMaxCoinError("");
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }, [quantity]);

  const handleLoginClick = () => {
    setOpenLoginAside(!openLoginAside);
  };

  const addToCartHandler = async (action_type: string,) => {
    if (isloggedIn) {
      setMaxCoinError("");
      await addToCart(action_type, quantity, productId);
      // refetch();
    } else {
      handleLoginClick();
    }
  };

  const totalPrice = useMemo(() => {
    const { weight, iteamtype } = productsDetailById! || {};
    return ParseFloat(
      (weight * quantity) *
      (iteamtype === "GOLD" ? goldData.totalPrice : silverData.totalPrice),
      2
    );
  }, [productsDetailById, quantity, goldData.totalPrice, silverData.totalPrice]);

  // useEffect(() => {
  //   if (!_id) {
  //     router.push('/')
  //   }
  // }, [])

  if (!productsDetailById) {
    return <Loading />;
  }

  const diwaliOfferHandler = () => {
    if (!applyDiwaliOffer) {
      // If the offer is not applied, apply it and show the success alert
      Swal.fire({
        html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
        title: `You will receive ${numberToWords(quantity)} <br /> ${productsDetailById?.name === '10 Gram Gold Coin' ? '10-Gram-Silver' : '5-Gram-Silver'
          }-${quantity === 1 ? 'coin' : 'Coins'} for free!`,
        width: '450px',
        padding: '2em',
        showConfirmButton: false,
        timer: 3500,
      });
    }
    // Toggle the state
    setapplyDiwaliOffer((prev) => !prev);
  };

  return (
    <div className="container pt-20 sm:pt-32  text-white pb-28 xl:pb-8">

      {openLoginAside && (
        <LoginAside
          isOpen={openLoginAside}
          onClose={() => setOpenLoginAside(false)}
        />
      )}

      {otpModal && <OtpModal />}

      {openCartSidebar && (
        <CartSideBar
          productsDetailById={productsDetailById}
          totalCoins={quantity}
          isOpen={openCartSidebar}
          onClose={() => setOpenCartSidebar(false)}
        />
      )}

      {openCoinModal && (
        <CoinModal
          applyDiwaliOffer={applyDiwaliOffer}
          totalCoins={quantity}
          productsDetailById={productsDetailById}
          openModalOfCoin={openCoinModal}
          closeModalOfCoin={closeCoinModalHandler}
        />
      )}

      <div className="grid sm:grid-cols-5 gap-4">
        <div className="relative col-span-2">
          {/* Absolute positioning for out-of-stock image */}
          {!productsDetailById.inStock && (
            <div className="bg-red-600 absolute top-0 right-0 px-2  rounded-bl-lg">
              <p className="font-medium">Out Of Stock</p>
            </div>
          )}

          {id == "5-Gram-Gold-Coin" && (
            <div className="absolute top-0 right-0 px-0 rounded-bl-lg">
              <Image
                alt="offer image"
                src="/images/akshayTrityaOffer.gif"
                width={80}
                height={80}
                className="rotate-image"
              />
            </div>
          )}


          {id == "10-Gram-Gold-Coin" && (
            <div className="absolute top-0 right-0 px-0  rounded-bl-lg">
              <Image alt="offer image" src="/images/akshayTrityaOffer.gif" width={80} height={80} className="rotate-image" />
            </div>
          )}

          <ImageGallery images={productsDetailById.image} />

          <div className="grid grid-cols-2 gap-2 items-center mt-1">
            {/* BUY NOW */}
            <div>
              <CustomImageButton
                img="/lottie/buynow.png"
                isDisabled={!productsDetailById.inStock}
                handleClick={() => {
                  openCoinModalHandler();
                }}
                title={""}
              />
            </div>

            <div className={`fade-section ${applyDiwaliOffer ? 'disabled' : ''}`}>
              {/* <div className={`fade-section }`}> */}
              <div>
                {/* GO TO CART */}
                {quantity === cartQuantity && (
                  <div>
                    <Link className="cursor-pointer" href="/cart">
                      <CustomImageButton
                        img="/lottie/Go to cart.gif"
                        isDisabled={!productsDetailById.inStock || applyDiwaliOffer}
                        // isDisabled={!productsDetailById.inStock}
                        title="GO TO CART"
                      />
                    </Link>
                  </div>
                )}

                {/* Update TO CART */}
                {cartQuantity !== 0 && cartQuantity !== quantity && (
                  <div>
                    <CustomImageButton
                      img="/lottie/updatenow.png"
                      isDisabled={!productsDetailById.inStock || applyDiwaliOffer}
                      // isDisabled={!productsDetailById.inStock}
                      handleClick={() => {
                        addToCartHandler("UpdateCart");
                      }}
                      title="UPDATE CART"
                    />
                  </div>
                )}

                {/* ADD TO CART */}
                {cartQuantity === 0 && (
                  <CustomImageButton
                    img="/lottie/addcart.gif"
                    // isDisabled={!productsDetailById.inStock}
                    isDisabled={!productsDetailById.inStock || applyDiwaliOffer}
                    handleClick={() => {
                      addToCartHandler("AddToCart");
                    }}
                    title=""
                  />
                )}
              </div>
            </div>
          </div>
          {
            id == "5-Gram-Gold-Coin" || id == "10-Gram-Gold-Coin" ? (
              <div className="text-center">
                <CustomButton
                  containerStyles="px-3 extrabold cursor-pointer text-md bg-[#FFD835] text-black sm:mt-3 text-center py-2 rounded-3xl"
                  isDisabled={!productsDetailById.inStock}
                  handleClick={diwaliOfferHandler}
                  title={!applyDiwaliOffer ? 'APPLY DIWALI OFFER' : 'OFFER APPLIED'}
                />
                <div>
                  <div className="tooltip mt-2">
                    <MdInfo size={24} className="" color="yellow" />
                    <span className="tooltiptext">
                      <ul className="text-sm text-justify">
                        <li className="m-2">1. When you purchase 5 GM Gold Coin(s), you will receive 5 GM Silver Coin(s). Similarly, if you purchase 10 GM Gold Coin(s), you will receive 10 GM Silver Coin(s).</li>
                        <li className="m-2">2. The "Convert from Vault" option is not applicable to this offer.</li>
                        <li className="m-2">3. You cannot use the Cart feature to avail this offer.</li>
                      </ul>
                    </span>
                  </div>
                </div>
              </div>
            ) : null
          }
        </div>

        <div className="col-span-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="mb-2 sm:text-lg extrabold">
                {productsDetailById.name}
              </h1>
              <div className="mb-2">
                Total Price{" "}
                <span className="text-yellow-500 text-base sm:text-xl bold">
                  ₹ {totalPrice}
                </span>
                <span className="text-yellow-500 pl-1 text-xxs sm:text-xs mt-1">
                  {" "}
                  +3% GST
                </span>
              </div>
              <div className="text-base sm:text-lg bold text-blue-100 ">
                Making Charge ₹{productsDetailById.makingcharges}
              </div>
              {maxCoinError && <p className="text-red-600">{maxCoinError}</p>}
            </div>
            <div className="flex items-center rounded-lg bg-themeLight">
              <div onClick={() => {
                decreaseQty();
              }} className={styles.p1}>
                -
              </div>
              <div className="">{quantity}</div>
              <div onClick={() => {
                increaseQty();
              }} className={styles.p2}>
                +
              </div>
            </div>
          </div>
          {/*check pin code */}
          <CheckPinCode />

          {/*coin description */}
          <ProductDescription
            description={productsDetailById?.description}
            weight={productsDetailById?.weight}
            purity={productsDetailById?.purity}
            dimension={productsDetailById?.dimension}
            quality={productsDetailById?.quality}
          />
        </div>
      </div>
    </div >
  );
};

const styles = {
  p1: "m-2 w-6 sm:w-8 px-2 sm:px-3 sm:py-1 bold text-lg text-red-500 cursor-pointer rounded-md bg-themeLight",
  p2: "m-2 w-6 sm:w-8 px-2 sm:px-3 sm:py-1 bold text-lg text-green-500 cursor-pointer rounded-md bg-themeLight",
};

export default page;
