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
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SimpleImageSlider from "react-simple-image-slider";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import CustomImageButton from "@/components/customImageButton";
import { SelectGoldData, SelectSilverData } from "@/redux/metalSlice";
import CheckPinCode from "../ProductDetails/checkPinCode";
import useFetchProductDetailsById from "../../../hooks/useFetchProductDetailsById";
import useFetchProductCart from "@/hooks/useFetchProductCart";
import { useAddToCart } from "@/hooks/useAddToCart";

const page = ({ params }: any) => {
  const user = useSelector(selectUser);
  const id = params.slug;
  const { _id } = user.data;
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const { productsDetailById, productId, photo, isLoading, error } = useFetchProductDetailsById(id);
  const { coinsInCart, isLoadingCart, errorCart, refetch } = useFetchProductCart(_id);
  const onSuccessfulAdd = () => setOpenCartSidebar(true);
  const { addToCart, isSuccess, } = useAddToCart(_id, quantity, productId, onSuccessfulAdd, refetch,);
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const goldData = useSelector(SelectGoldData);
  const silverData = useSelector(SelectSilverData);
  const [openCoinModal, setOpenCoinModal] = useState<boolean>(false);
  const [maxCoinError, setMaxCoinError] = useState<string>("");
  const [openLoginAside, setOpenLoginAside] = useState<boolean>(false);
  const [openCartSidebar, setOpenCartSidebar] = useState<boolean>(false);
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);

  const openCoinModalHandler = () => {
    if (isloggedIn) {
      setMaxCoinError("");
      if (!user?.data?.isKycDone) {
        Swal.fire({
          title: "Oops...!",
          titleText:
            "It seems your KYC is pending. Please complete your KYC first.",
          padding: "2em",
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
          showCancelButton: true,
          confirmButtonText: "Complete Your KYC",
          denyButtonText: `Don't save`,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/myAccount");
          }
        });
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

  useEffect(() => {
    const productCount = getProductCountById(coinsInCart, productId);
    setQuantity(productCount === 0 ? 1 : productCount);
    setCartQuantity(productCount);
  }, [coinsInCart]);

  const increaseQty = () => {
    const { coinHave } = productsDetailById;

    if (quantity <= 9) {
      if (coinHave !== undefined && coinHave > quantity) {
        setQuantity((prevQuantity) => prevQuantity + 1);
        setMaxCoinError("");
      } else if (coinHave === undefined) {
        setMaxCoinError(
          `Oops! This Coin Is Not Available. Please Try Again After Some Time.`
        );
      } else {
        setMaxCoinError(`You can only purchase ${quantity} coins.`);
      }
    } else {
      setMaxCoinError(`You can only purchase ${quantity} coins of at a time`);
    }
  };

  const decreaseQty = () => {
    setMaxCoinError("");
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleLoginClick = () => {
    setOpenLoginAside(!openLoginAside);
  };

  const addToCartHandler = async (action_type: string) => {
    if (isloggedIn) {
      setMaxCoinError("");
      await addToCart(action_type);
      // refetch();
    } else {
      handleLoginClick();
    }
  };

  const totalPrice = ParseFloat(
    +productsDetailById?.weight *
    quantity *
    (productsDetailById?.iteamtype === "GOLD"
      ? goldData.totalPrice
      : silverData.totalPrice),
    2
  );


  if (!productsDetailById) {
    return <Loading />;
  }

  return (
    <div className="container pt-32 py-16 text-white pb-28 xl:pb-8">

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

      <div className="grid xl:grid-cols-5 gap-12">
        <div className="col-span-5 xl:col-span-2 relative">
          {/* Absolute positioning for out-of-stock image */}
          {!productsDetailById.inStock && (
            <div className="bg-red-600 absolute top-0 right-0 px-2  rounded-bl-lg">
              <p className="font-medium">Out Of Stock</p>
            </div>
          )}
          <div className="hidden sm:block bg-themeLight rounded p-4">
            <SimpleImageSlider
              width={400}
              height={400}
              images={photo}
              showBullets={false}
              style={{ margin: "0 auto" }}
              showNavs={false}
              loop={true}
              autoPlay={true}
              bgColor="#red"
              autoPlayDelay={2.0}
              slideDuration={0.5}
            />
          </div>
          <div className="block sm:hidden bg-themeLight rounded p-4">
            <SimpleImageSlider
              width={240}
              height={240}
              images={photo}
              showBullets={false}
              style={{ margin: "0 auto" }}
              showNavs={false}
              loop={true}
              autoPlay={true}
              bgColor="#red"
              autoPlayDelay={2.0}
              slideDuration={0.5}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 items-center mt-2">

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
            {/* { GO TO CART } */}
            {quantity == cartQuantity && (
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

            {/* Update TO CART */}
            {cartQuantity !== 0 && cartQuantity !== quantity && (
              <div>
                <CustomImageButton
                  img="/lottie/updatenow.png"
                  isDisabled={!productsDetailById.inStock}
                  handleClick={() => {
                    addToCartHandler("UpdateCart");
                  }}
                  title="UPDATE CART"
                />
              </div>
            )}

            {/* ADD TO CART */}
            {cartQuantity == 0 && (
              <CustomImageButton
                img="/lottie/addcart.gif"
                isDisabled={!productsDetailById.inStock}
                handleClick={() => {
                  addToCartHandler("AddToCart");
                }}
                title={""}
              />
            )}
          </div>
        </div>
        <div className="col-span-5 xl:col-span-3">
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
              <div onClick={decreaseQty} className={styles.p1}>
                -
              </div>
              <div className="">{quantity}</div>
              <div onClick={increaseQty} className={styles.p2}>
                +
              </div>
            </div>
          </div>
          {/* pin code */}
          <CheckPinCode />
          {/*coin description */}
          <div className="bg-themeLight px-4 py-4 rounded-md mt-4">
            <p className="text-sm">{productsDetailById.description}</p>
            <div className="grid grid-cols-4 mt-4">
              <div className=" text-center px-2">
                <img
                  src={"/24K guaranteed .png"}
                  alt="icons"
                  className="mx-auto mb-2 h-12 sm:h-20"
                />
                <p className="font-8x sm:text-base">
                  24K Guaranteed <br /> Quality Certified
                </p>
              </div>
              <div className="text-center px-2">
                <img
                  src={"/Free Insurance.png"}
                  alt="icons"
                  className="mx-auto mb-2  h-12 sm:h-20"
                />
                <p className="font-8x sm:text-base">
                  Free Insurance <br /> on Delivery
                </p>
              </div>
              <div className="text-center px-2">
                <img
                  src={"/order tracking support.png"}
                  alt="icons"
                  className="mx-auto mb-2   h-12 sm:h-20"
                />
                <p className="font-8x sm:text-base">
                  Order Tracking &<br />
                  Support
                </p>
              </div>
              <div className="text-center px-2">
                <img
                  src={"/zero negative.png"}
                  alt="icons"
                  className="mx-auto mb-2 h-12 sm:h-20"
                />
                <p className="font-8x sm:text-base">
                  Zero negative <br /> weight tolerance
                </p>
              </div>
            </div>
            <div className="mt-6">
              <table>
                <tbody>
                  <tr>
                    <td className="w-32 inline-block">Weight </td>
                    <td className="pl-2 bold">
                      {productsDetailById.weight} Gm
                    </td>
                  </tr>
                  <tr>
                    <td className="w-32 inline-block">Metal Purity</td>
                    <td className="pl-2">{productsDetailById.purity}</td>
                  </tr>
                  <tr>
                    <td className="w-32 inline-block">Dimension</td>
                    <td className="pl-2">{productsDetailById.dimension}</td>
                  </tr>
                  <tr>
                    <td className="w-32 inline-block">Quality</td>
                    <td className="pl-2">{productsDetailById.quality}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
