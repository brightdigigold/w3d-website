'use client'
import { useDispatch, useSelector } from "react-redux";
import CheckPinCode from "../ProductDetails/checkPinCode";
import ProductDescription from "../ProductDetails/productDescription";
import { selectUser } from "@/redux/userDetailsSlice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SelectGoldData, SelectSilverData } from "@/redux/metalSlice";
import { useAddToCart } from "@/hooks/useAddToCart";
import useFetchProductDetailsById from "@/hooks/useFetchProductDetailsById";
import useFetchProductCart from "@/hooks/useFetchProductCart";
import { RootState } from "@/redux/store";
import { setLiveGoldPrice, setLiveSilverPrice } from "@/redux/cartSlice";
import { setShowProfileForm } from "@/redux/authSlice";
import { ParseFloat } from "@/components/helperFunctions";
// import { Loading } from "notiflix";
import OtpModal from "@/components/modals/otpModal";
import CartSideBar from "@/components/cart/cartSidebar";
import CoinModal from "@/components/modals/buyCoinModal";
import ImageGallery from "../ProductDetails/productImage";
import CustomImageButton from "@/components/customImageButton";
import Link from "next/link";
import LoginAside from "@/components/authSection/loginAside";
import Loading from "@/app/loading";

const page = ({ params: { slug } }: { params: { slug: string } }) => {
  const user = useSelector(selectUser);
  const id = slug;
  const { _id } = user.data;
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState<number>(1);
  const { productsDetailById, productId, isLoading, error } = useFetchProductDetailsById(id);
  const { coinsInCart, isLoadingCart, errorCart, refetch } = useFetchProductCart(_id);
  const onSuccessfulAdd = () => setOpenCartSidebar(true);
  const { addToCart, isSuccess, } = useAddToCart(_id, refetch, onSuccessfulAdd);
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const goldData = useSelector(SelectGoldData);
  const silverData = useSelector(SelectSilverData);
  const [openCoinModal, setOpenCoinModal] = useState<boolean>(false);
  const [maxCoinError, setMaxCoinError] = useState<string>("");
  const [openLoginAside, setOpenLoginAside] = useState<boolean>(false);
  const [openCartSidebar, setOpenCartSidebar] = useState<boolean>(false);
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userType = useSelector((state: RootState) => state.auth.UserType);
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);
  const liveGoldPrice = useSelector((state: RootState) => state.cart.liveGoldPrice);
  const liveSilverPrice = useSelector((state: RootState) => state.cart.liveSilverPrice);

  useEffect(() => {
    dispatch(setLiveGoldPrice(userType == "corporate" ? goldData.c_totalPrice : goldData.totalPrice));
    dispatch(setLiveSilverPrice(userType == "corporate" ? silverData.c_totalPrice : silverData.totalPrice));
  }, [isloggedIn]);

  useEffect(() => {
    const productCount = getProductCountById(coinsInCart, productId);
    setQuantity(productCount === 0 ? 1 : productCount);
    setCartQuantity(productCount);
  }, [coinsInCart]);

  const openCoinModalHandler = () => {
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
    if (quantity <= 9 && productsDetailById?.coinHave !== undefined && productsDetailById?.coinHave > quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
      setMaxCoinError("");
    } else if (quantity <= 9 && productsDetailById?.coinHave === undefined) {
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
    } else {
      handleLoginClick();
    }
  };

  const totalPrice = useMemo(() => {
    const { weight, iteamtype } = productsDetailById! || {};
    return ParseFloat(
      (weight * quantity) *
      (iteamtype === "GOLD" ? liveGoldPrice : liveSilverPrice),
      2
    );
  }, [productsDetailById, quantity, liveGoldPrice, liveSilverPrice]);

  if (!productsDetailById) {
    return <Loading />;
  }

  return (
    <div className="pt-24 pb-8 xl:pb-8 text-white">
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
          totalCoins={quantity}
          productsDetailById={productsDetailById}
          openModalOfCoin={openCoinModal}
          closeModalOfCoin={closeCoinModalHandler}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12 px-4 xl:px-0">
        <div className="col-span-5 xl:col-span-2 relative">
          {/* Absolute positioning for out-of-stock image */}
          {!productsDetailById.inStock && (
            <div className="absolute top-0 right-0 px-2 rounded-bl-lg">
              <p className="font-medium">Out Of Stock</p>
            </div>
          )}

          <ImageGallery images={productsDetailById.image}/>

          <div className="grid grid-cols-3 items-center">
            {/* Spacer */}
            <div></div>

            {/* BUY NOW */}
            <div className="">
              <CustomImageButton
                img="/lottie/buynow.png"
                isDisabled={!productsDetailById.inStock}
                handleClick={openCoinModalHandler}
                title=""
              />
            </div>

            <div>
              {/* GO TO CART */}
              {quantity === cartQuantity && (
                <div>
                  <Link className="cursor-pointer" href="/cart">
                    <CustomImageButton
                      img="/lottie/Go to cart.gif"
                      isDisabled={!productsDetailById.inStock}
                      title="GO TO CART"
                    />
                  </Link>
                </div>
              )}

              {/* UPDATE CART */}
              {cartQuantity !== 0 && cartQuantity !== quantity && (
                <div>
                  <CustomImageButton
                    img="/lottie/updatenow.png"
                    isDisabled={!productsDetailById.inStock}
                    handleClick={() => addToCartHandler("UpdateCart")}
                    title="UPDATE CART"
                  />
                </div>
              )}

              {/* ADD TO CART */}
              {cartQuantity === 0 && (
                <CustomImageButton
                  img="/lottie/addcart.gif"
                  isDisabled={!productsDetailById.inStock}
                  handleClick={() => addToCartHandler("AddToCart")}
                  title=""
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-span-5 xl:col-span-3 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="mb-2 text-lg xl:text-2xl font-extrabold">{productsDetailById.name}</h1>
              <div className="mb-2 text-sm xl:text-lg">
                Total Price{" "}
                <span className="text-yellow-500 font-bold">₹ {totalPrice}</span>
                <span className="text-yellow-500 pl-1 text-xs"> +3% GST</span>
              </div>
              <div className="text-base text-blue-100">Making Charge ₹{productsDetailById.makingcharges}</div>
              {maxCoinError && <p className="text-red-600">{maxCoinError}</p>}
            </div>

            <div className="flex items-center">
              <div
                onClick={decreaseQty}
                className={styles.p1}
              >
                -
              </div>
              <div className="px-4 text-lg">{quantity}</div>
              <div
                onClick={increaseQty}
                className={styles.p2}
              >
                +
              </div>
            </div>
          </div>

          {/* Pin Code Checker */}
          <CheckPinCode />

          {/* Product Description */}
          <ProductDescription
            description={productsDetailById?.description}
            weight={productsDetailById?.weight}
            purity={productsDetailById?.purity}
            dimension={productsDetailById?.dimension}
            quality={productsDetailById?.quality}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  p1: "m-2 w-6 sm:w-8 px-2 sm:px-3 sm:py-1 bold text-lg text-red-500 cursor-pointer rounded-md bg-themeLight",
  p2: "m-2 w-6 sm:w-8 px-2 sm:px-3 sm:py-1 bold text-lg text-green-500 cursor-pointer rounded-md bg-themeLight",
};

export default page;
