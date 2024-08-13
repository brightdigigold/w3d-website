"use client";
import CustomButton from "@/components/customButton";
import {
  AesDecrypt,
  ParseFloat,
  funForAesEncrypt,
  funcForDecrypt,
} from "@/components/helperFunctions";
import { selectUser } from "@/redux/userDetailsSlice";
import {
  selectGoldVaultBalance,
  selectSilverVaultBalance,
} from "@/redux/vaultSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ConvertMetalModal from "@/components/modals/convertMetalModal";
import {
  calculateFinalAmount,
  setAmountWithTaxGold,
  setAmountWithTaxSilver,
  setAmountWithoutTaxGold,
  setAmountWithoutTaxSilver,
  setCartProducts,
  setFinalAmount,
  setGoldVaultBalance,
  setLiveGoldPrice,
  setLiveSilverPrice,
  setSilverVaultBalance,
  setTotalGoldCoins,
  setTotalGoldWeight,
  setTotalMakingCharges,
  setTotalMakingChargesGold,
  setTotalMakingChargesSilver,
  setTotalMakingWithoutTax,
  setTotalSilverCoins,
  setTotalSilverWeight,
  setUseVaultBalanceSilver,
  calculatePurchasedGoldWeight,
  calculatePurchasedSilverWeight,
  setUseVaultBalanceGold
} from "@/redux/cartSlice";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProgressBar from "@/components/progressBar";
import Swal from "sweetalert2";
import Link from "next/link";
import { getUserAddressList } from "@/api/DashboardServices";
import { FaChevronCircleDown } from "react-icons/fa";
import AddressComponent from "./addressComponent";
import { Address, CartProduct, Product } from "@/types";
import { useRouter } from "next/navigation";
import AddAddressModel from "../modals/addAddressModel";
import CartHeader from "./cartHeader";
import VaultConversionSection from "./vaultConversionSection";
import CartItemsList from "./cartItemsList";
import PriceBreakdown from "./priceBreakDown";
import { toast } from "react-toastify";

interface CartItem {
  product: Product;
}

const Cart = () => {
  const user = useSelector(selectUser);
  const { _id } = user.data;
  const token = localStorage.getItem("token");
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [encryptedPayload, setEncryptedPayload] = useState<string>("");
  const cart = useSelector((state: RootState) => state.cart);
  const goldData = useSelector((state: RootState) => state.gold);
  const silverData = useSelector((state: RootState) => state.silver);
  const cartProducts = useSelector((state: RootState) => state.cart.products);
  const finalAmount = useSelector((state: RootState) => state.cart.finalAmount);
  const liveGoldPrice = useSelector((state: RootState) => state.cart.liveGoldPrice);
  const totalGoldCoins = useSelector((state: RootState) => state.cart.totalGoldCoins);
  const goldGstForCart = useSelector((state: RootState) => state.cart.goldGstForCart);
  const liveSilverPrice = useSelector((state: RootState) => state.cart.liveSilverPrice);
  const totalGoldWeight = useSelector((state: RootState) => state.cart.totalGoldWeight);
  const isGoldVault = useSelector((state: RootState) => state.cart.useVaultBalanceGold);
  const silverGstForCart = useSelector((state: RootState) => state.cart.silverGstForCart);
  const totalSilverCoins = useSelector((state: RootState) => state.cart.totalSilverCoins);
  const isSilverVault = useSelector((state: RootState) => state.cart.useVaultBalanceSilver);
  const totalSilverWeight = useSelector((state: RootState) => state.cart.totalSilverWeight);
  const amountWithTaxGold = useSelector((state: RootState) => state.cart.amountWithTaxGold);
  const totalMakingCharges = useSelector((state: RootState) => state.cart.totalMakingCharges);
  const amountWithTaxSilver = useSelector((state: RootState) => state.cart.amountWithTaxSilver);
  const goldVaultWeightUsed = useSelector((state: RootState) => state.cart.goldVaultWeightUsed);
  const purchasedGoldWeight = useSelector((state: RootState) => state.cart.purchasedGoldWeight);
  const amountWithoutTaxGold = useSelector((state: RootState) => state.cart.amountWithoutTaxGold);
  const totalMakingWithoutTax = useSelector((state: RootState) => state.cart.totalMakingWithoutTax);
  const silverVaultWeightUsed = useSelector((state: RootState) => state.cart.silverVaultWeightUsed);
  const purchasedSilverWeight = useSelector((state: RootState) => state.cart.purchasedSilverWeight);
  const totalGoldMakingCharges = useSelector((state: RootState) => state.cart.totalMakingChargesGold);
  const amountWithoutTaxSilver = useSelector((state: RootState) => state.cart.amountWithoutTaxSilver);
  const totalMakingChargesSilver = useSelector((state: RootState) => state.cart.totalMakingChargesSilver);
  const goldVaultBalance = useSelector(selectGoldVaultBalance);
  const silverVaultBalance = useSelector(selectSilverVaultBalance);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [maxCoinError, setMaxCoinError] = useState<String>("");
  const [openConvertMetalModal, setOpenConvertMetalModal] = useState<boolean>(false);
  const [metalTypeToConvert, setMetalTypeToConvert] = useState<String>("GOLD");
  const [addressList, setaddressList] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<String>("");
  const [showAddNewAddress, setShowAddNewAddress] = useState<boolean>(false);

  const openConvertMetalModalHandler = (metalTypeToConvert: string) => {
    const vaultBalanceOfMetal = metalTypeToConvert === 'GOLD' ? goldVaultBalance : silverVaultBalance;
    const payloadLengthOfMetal = metalTypeToConvert === 'GOLD' ? goldPayload.length : silverPayload.length;

    setOpenConvertMetalModal(!(vaultBalanceOfMetal === 0 || payloadLengthOfMetal === 0));
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const ViewBreakUp = () => {
    setIsOpened((wasOpened) => !wasOpened);
  };

  const updateAddressList = async () => {
    try {
      const addresses = await getUserAddressList();
      setaddressList(addresses);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getAllProductsOfCart();
    dispatch(setUseVaultBalanceGold(false));
    dispatch(setUseVaultBalanceSilver(false));
    dispatch(setGoldVaultBalance(goldVaultBalance));
    dispatch(setSilverVaultBalance(silverVaultBalance));
    calculateTotals();
    updateAddressList();
  }, []);

  const calculateTotals = () => {
    let totalGoldWeight = 0;
    let totalSilverWeight = 0;
    let totalGoldMakingCharges = 0;
    let totalSilverMakingCharges = 0;
    let totalMakingCharges = 0;
    let totalMakingWithoutTax = 0;
    let silverGstForCart = 0;
    let amountWithTaxSilver = 0;
    let amountWithoutTaxSilver = 0;
    let GoldGstForCart = 0;
    let amountWithTaxGold = 0;
    let amountWithoutTaxGold = 0;
    let finalAmount = 0;
    let totalGoldCoins = 0;
    let totalSilverCoins = 0;
    let totalGstForMakingCharges = 0;

    cartProducts.forEach((item) => {
      const itemWeight = item?.product?.count * item?.product?.weight;
      const itemMakingCharges = +item?.product?.makingcharges;

      if (item?.product?.iteamtype === "GOLD") {
        totalGoldWeight += itemWeight;
        totalGoldMakingCharges += itemMakingCharges;
        totalGoldCoins += item?.product?.count;
      } else if (item?.product?.iteamtype === "SILVER") {
        totalSilverWeight += itemWeight;
        totalSilverMakingCharges += itemMakingCharges;
        totalSilverCoins += item?.product?.count;
      }
      totalMakingCharges += itemMakingCharges * item?.product?.count;
      totalGstForMakingCharges = ParseFloat((totalMakingCharges * 0.18), 2);
      totalMakingWithoutTax = ParseFloat(totalMakingCharges - totalGstForMakingCharges, 2)
      amountWithoutTaxSilver = ParseFloat(liveSilverPrice * totalSilverWeight, 2);
      silverGstForCart = ParseFloat(totalSilverWeight * liveSilverPrice * 0.03, 2);
      amountWithTaxSilver = ParseFloat(totalSilverWeight * liveSilverPrice + silverGstForCart, 2);
      amountWithoutTaxGold = ParseFloat(liveGoldPrice * totalGoldWeight, 2);
      GoldGstForCart = ParseFloat(totalGoldWeight * liveGoldPrice * 0.03, 2);
      amountWithTaxGold = ParseFloat(totalGoldWeight * liveGoldPrice + GoldGstForCart, 2);
      // finalAmount = ParseFloat(amountWithTaxGold + amountWithTaxSilver + totalMakingCharges, 2);
    });

    // Dispatch actions to update the state in the Redux store
    dispatch(setTotalGoldWeight(totalGoldWeight));
    dispatch(setTotalSilverWeight(totalSilverWeight));
    dispatch(setTotalMakingChargesGold(totalGoldMakingCharges));
    dispatch(setTotalMakingChargesSilver(totalSilverMakingCharges));
    dispatch(setTotalMakingCharges(totalMakingCharges));
    dispatch(setTotalMakingWithoutTax(totalMakingWithoutTax));
    dispatch(setGoldVaultBalance(goldVaultBalance));
    dispatch(setSilverVaultBalance(silverVaultBalance));
    dispatch(setAmountWithTaxSilver(amountWithTaxSilver));
    dispatch(setAmountWithoutTaxSilver(amountWithoutTaxSilver));
    dispatch(setAmountWithTaxGold(amountWithTaxGold));
    dispatch(setAmountWithoutTaxGold(amountWithoutTaxGold));
    dispatch(calculateFinalAmount());
    // dispatch(setFinalAmount(finalAmount));
    dispatch(setTotalGoldCoins(totalGoldCoins));
    dispatch(setTotalSilverCoins(totalSilverCoins));
  };

  useEffect(() => {
    calculateTotals();
    dispatch(setGoldVaultBalance(goldVaultBalance));
    dispatch(setSilverVaultBalance(silverVaultBalance));
    dispatch(setLiveGoldPrice(goldData.totalPrice));
    dispatch(setLiveSilverPrice(silverData.totalPrice));
    dispatch(calculatePurchasedGoldWeight());
    dispatch(calculatePurchasedSilverWeight());
  }, [cart.products, liveGoldPrice, liveSilverPrice, isGoldVault, isSilverVault,]);

  const closeConvertMetalHandler = () => {
    setOpenConvertMetalModal(false);
  };

  const goldPayload = cart.products
    .filter((item) => item?.product?.iteamtype === "GOLD")
    .map((item) => ({
      makingcharge: item?.product?.makingcharges,
      productId: item?.product?.sku,
      count: item?.product?.count,
    }));

  const silverPayload = cart.products
    .filter((item) => item?.product?.iteamtype === "SILVER")
    .map((item) => ({
      makingcharge: item?.product?.makingcharges,
      productId: item?.product?.sku,
      count: item?.product?.count,
    }));

  const getAllProductsOfCart = async () => {
    try {
      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.get(
        `${process.env.baseUrl}/user/ecom/getCartProduct/cart/${_id}`,
        configHeaders
      );
      const decryptedData = AesDecrypt(response.data.payload);
      const finalResult = JSON.parse(decryptedData);

      // Validate cart data only when initially loading the cart
      console.log("Cart data orginal", finalResult)
      const validatedCartProducts = await validateCartData(finalResult.data.cartProductForWeb);

      dispatch(setCartProducts(validatedCartProducts));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const validateCartData = async (cartData: CartItem[]): Promise<CartProduct[]> => {
    let error = ""
    const validatedData: CartProduct[] = [];

    for (const item of cartData) {
      if (item.product.count > item.product.coinHave) {
        // Adjust the count to the maximum available stock
        item.product.count = item.product.coinHave;
        error = "Your cart has been adjusted according to our stock availability.";
      }

      if (item.product.coinHave > 0) {
        validatedData.push({
          product: {
            ...item.product,
          },
        });
      } else {
        // Remove item from cart if stock is zero
        await deleteFromCart(item.product.sku);
      }
    }

    // html: "Your cart has been adjusted according to our stock availability.",
    if (error) {
      Swal.fire({
        title: "Stock Adjustment",
        html: error,
      })
    }

    return validatedData;
  };

  const handleCartAction = async (
    productId: string,
    action_type: string,
    quantityChange: number
  ) => {
    setMaxCoinError("");

    try {
      const dataToBeEncrypt = {
        user_id: _id,
        count: quantityChange,
        product_Id: productId,
        action: action_type,
        from_App: false,
      };

      const resAfterEncryptData = await funForAesEncrypt(dataToBeEncrypt);

      const payloadToSend = {
        payload: resAfterEncryptData,
      };

      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.put(
        `${process.env.baseUrl}/user/ecom/action/cart`,
        payloadToSend,
        configHeaders
      );

      const decryptedData = await funcForDecrypt(response.data.payload);

      if (JSON.parse(decryptedData).status) {
        // Just refresh the cart products without re-validating them
        await getAllProductsOfCart();
      }
    } catch (error) {
      Swal.fire({
        html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const increaseQty = async (maxForCart: number, coinHave: number, productId: string, currentCount: number) => {
    if (currentCount >= maxForCart) {
      setMaxCoinError(`You can only purchase ${maxForCart} coins of this item.`);
    } else if (currentCount < coinHave) {
      await handleCartAction(productId, "ADD", currentCount + 1);
    } else {
      setMaxCoinError(`You can only purchase ${coinHave} coins. Insufficient stock.`);
    }
  };

  const decreaseQty = async (productId: string, productCount: number) => {
    if (productCount > 1) {
      await handleCartAction(productId, "SUBTRACT", productCount - 1);
    } else {
      setMaxCoinError("Quantity cannot be less than 1.");
    }
  };

  const deleteFromCart = async (productId: any) => {
    await handleCartAction(productId, "DELETE", 1);
  };


  useEffect(() => {
    dispatch(setTotalGoldWeight(totalGoldWeight));
    dispatch(setTotalSilverWeight(totalSilverWeight));
    dispatch(setTotalMakingChargesGold(totalGoldMakingCharges));
    dispatch(setTotalMakingChargesSilver(totalMakingChargesSilver));
    dispatch(setTotalMakingCharges(totalMakingCharges));
    dispatch(setTotalMakingWithoutTax(totalMakingWithoutTax));
    dispatch(setGoldVaultBalance(goldVaultBalance));
    dispatch(setSilverVaultBalance(silverVaultBalance));
    dispatch(setAmountWithTaxSilver(amountWithTaxSilver));
    dispatch(setAmountWithoutTaxSilver(amountWithoutTaxSilver));
    dispatch(setAmountWithTaxGold(amountWithTaxGold));
    dispatch(setAmountWithoutTaxGold(amountWithoutTaxGold));
    dispatch(calculateFinalAmount());
    dispatch(setFinalAmount(finalAmount));
  }, [isGoldVault, isSilverVault]);

  const dataToEncrept = {
    orderType: "CART",
    goldCoins: goldPayload,
    silverCoins: silverPayload,
    liveGoldPrice: liveGoldPrice,
    liveSilverPrice: liveSilverPrice,
    isSilverVault: isSilverVault,
    isGoldVault: isGoldVault,
    paymentType: "",
    vaultUsedWeight: {
      Gold: isGoldVault ? goldVaultWeightUsed : 0,
      Silver: isSilverVault ? silverVaultWeightUsed : 0,
    },
    fromApp: false,
    addressId: selectedAddressId,
    totalWeight: {
      totalGoldWeight: totalGoldWeight,
      totalSilverWeight: totalSilverWeight,
      purchasedGoldWeight: !isGoldVault ? totalGoldWeight : purchasedGoldWeight,
      purchasedSilverWeight: !isSilverVault
        ? totalSilverWeight
        : purchasedSilverWeight,
    },
    totalAmount: {
      amountWithTaxGold: amountWithTaxGold,
      amountWithoutTaxGold: amountWithoutTaxGold,
      amountWithTaxSilver: amountWithTaxSilver,
      amountWithoutTaxSilver: amountWithoutTaxSilver,
      totalMakingWithoutTax: totalMakingWithoutTax,
      totalMakingCharges: totalMakingCharges,
      finalAmount: finalAmount,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const resAfterEncryptData = await funForAesEncrypt(dataToEncrept);
      setEncryptedPayload(resAfterEncryptData);
    };

    fetchData();
  }, [dataToEncrept]);



  const handleProceed = async () => {
    try {
      const dataToBeEncrypt = {
        goldCoins: goldPayload,
        silverCoins: silverPayload,
      };
      const resAfterEncryptData = await funForAesEncrypt(dataToBeEncrypt);

      const payloadToSend = {
        payload: resAfterEncryptData,
      };

      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(`${process.env.baseUrl}/user/ecom/placecart/orderCheck`, payloadToSend, configHeaders);
      const decryptedData = await funcForDecrypt(response.data.payload);
      const finalData = JSON.parse(decryptedData);
      console.log("decrypted data: ", finalData);
      return finalData;

    } catch (error) {
      Swal.fire({
        html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const checkoutCart = async () => {
    setLoading(true);
    try {
      if (addressList && addressList.length == 0) {
        Swal.fire({
          title: "Oops...!",
          titleText: "No address found!",
          padding: "2em",
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
          showCancelButton: true,
          confirmButtonText: "Add Address",
          denyButtonText: `Don't save`,
        }).then((result) => {
          if (result.isConfirmed) {
            setShowAddNewAddress(true);
          }
        });
        return;
      }

      if (isGoldVault || isSilverVault) {
        if (!user.data.isKycDone) {
          Swal.fire({
            title: "Oops...!",
            titleText:
              "It seems your KYC is pending. Please complete your KYC first.",
            padding: "2em",
            html: `<img src="/lottie/oops.gif" class="swal2-image-custom" alt="Successfully Done">`,
            showCancelButton: true,
            confirmButtonText: "Complete Your KYC",
            denyButtonText: `Don't save`,
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/myAccount");
            }
          });
          return;
        } else {
          const finalData = await handleProceed();
          if (finalData && finalData.status) {
            router.push(`/checkout?data=${encryptedPayload}`);
          }
        }
      } else {
        const finalData = await handleProceed();
        if (finalData && finalData.status) {
          router.push(`/checkout?data=${encryptedPayload}`);
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPriceBreakdownItemCart = ({
    label,
    value,
    index,
    imageUrl,
  }: any) => (
    <div className="py-1">
      <div className="justify-between flex items-center">
        <div key={index} className="mb-1 flex items-center">
          {imageUrl && (
            <div className="mr-1">
              <img src={imageUrl} alt={label} className="w-10 h-10" />
            </div>
          )}
          <span className="tracking-wide text-gray-300">{label}</span>
        </div>
        <div>
          <span className="text-blue-100 tracking-wide bold">
            {value.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
      <hr
        className="my-0 border-t border-gray-400 mt-1"
        style={{
          backgroundImage:
            "linear-gradient(to right, #d2d6dc 50%, transparent 50%)",
          backgroundSize: "0.4rem 2px",
          backgroundRepeat: "repeat-x",
          border: "none",
          height: "1px",
        }}
      />
    </div>
  );

  if (!cartProducts.length) {
    return (
      <div className="px-4 sm:px-6 lg:px-16 pt-6 pb-16 justify-between">
        <p className="text-gray-100 text-2xl text-center px-4 py-2">
          No Item In Cart
        </p>
        <div className=" flex justify-center">
          <div >
            <img src="/lottie/Empty carts.gif" />
            <div className=" flex justify-center">
              <Link
                className="text-black bg-themeBlue rounded px-4 py-2 "
                href="/coins"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const closeAddNewAddress = () => {
    setShowAddNewAddress(false);
  };


  return (
    <div className="text-white">
      {openConvertMetalModal && (
        <ConvertMetalModal
          metalTypeToConvert={metalTypeToConvert}
          openModalOfCoin={openConvertMetalModal}
          closeModalOfCoin={closeConvertMetalHandler}
        />
      )}

      {showAddNewAddress && (
        <AddAddressModel
          onCancel={closeAddNewAddress}
          onAddressListUpdate={updateAddressList}
        />
      )}

      <CartHeader />
      <div className="grid grid-cols-3 gap-6 px-4 sm:px-6 lg:px-16 pt-6 pb-24 justify-between">
        <div className="bg-themeLight rounded-xl col-span-3 xl:col-span-2">
          {/* vault conversion */}
          <VaultConversionSection
            goldVaultBalance={goldVaultBalance}
            silverVaultBalance={silverVaultBalance}
            setMetalTypeToConvert={setMetalTypeToConvert}
            openConvertMetalModalHandler={openConvertMetalModalHandler}
          />

          {/* Render your cart items using ProductList state */}
          <div className="py-2 mt-3 p-3 ">
            <CartItemsList
              cartProducts={cartProducts}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              deleteFromCart={deleteFromCart}
              maxCoinError={maxCoinError}
            />
          </div>
        </div>
        {/* payments disclosure */}
        <div className="text-white col-span-3 xl:col-span-1 bg-themeLight p-3 h-fit rounded-xl hidden lg:block">
          <AddressComponent
            addressList={addressList}
            onSelectAddress={handleSelectAddress}
          />
          <PriceBreakdown
            goldPayload={goldPayload}
            silverPayload={silverPayload}
            totalGoldCoins={totalGoldCoins}
            totalSilverCoins={totalSilverCoins}
            totalGoldWeight={totalGoldWeight}
            totalSilverWeight={totalSilverWeight}
            amountWithTaxGold={amountWithTaxGold}
            amountWithTaxSilver={amountWithTaxSilver}
            totalMakingCharges={totalMakingCharges}
            finalAmount={finalAmount}
            isGoldVault={isGoldVault}
            goldVaultWeightUsed={goldVaultWeightUsed}
            purchasedGoldWeight={purchasedGoldWeight}
            isSilverVault={isSilverVault}
            silverVaultWeightUsed={silverVaultWeightUsed}
            purchasedSilverWeight={purchasedSilverWeight}
            loading={loading}
            checkoutCart={checkoutCart} />
        </div>

        <div className="text-white col-span-3 xl:col-span-1 coins_background w-full p-3 fixed left-0 bottom-0 block lg:hidden z-[48] rounded-t-lg">
          {!isOpened && (
            <AddressComponent
              addressList={addressList}
              onSelectAddress={handleSelectAddress}
            />
          )}
          {isOpened && (
            <div className=" overflow-y-scroll">
              <div className="flex items-center text-xl extrabold tracking-widest sm:tracking-wider">
                <AiOutlineShoppingCart className="text-yellow-400" size={28} />
                <p className="px-2">Price Breakdown</p>
              </div>
              {(goldPayload.length > 0 || silverPayload.length > 0) && (
                <div className="mt-3 text-xs sm:text-base">
                  {goldPayload.length > 0 && (
                    <>
                      {renderPriceBreakdownItemCart({
                        imageUrl: "/coin1.png",
                        label: "Total Gold Coins",
                        value: totalGoldCoins,
                      })}
                      {renderPriceBreakdownItemCart({
                        label: "Total Gold Weight",
                        value: totalGoldWeight + " gm",
                      })}
                      {isGoldVault &&
                        renderPriceBreakdownItemCart({
                          label: "Gold Vault Used",
                          value: goldVaultWeightUsed + " gm",
                        })}
                      {isGoldVault &&
                        renderPriceBreakdownItemCart({
                          label: "Total Purchasing Gold Weight",
                          value: purchasedGoldWeight + " gm",
                        })}
                      {renderPriceBreakdownItemCart({
                        label: "Total Gold Coin Price (Incl. 3% GST)",
                        value: "₹ " + amountWithTaxGold.toLocaleString("en-IN"),
                      })}
                    </>
                  )}
                  <div className="mt-3">
                    {silverPayload.length > 0 && (
                      <>
                        {renderPriceBreakdownItemCart({
                          imageUrl: "/Rectangle.png",
                          label: "Total Silver Coins",
                          value: totalSilverCoins,
                        })}
                        {renderPriceBreakdownItemCart({
                          label: "Total Silver Weight",
                          value: totalSilverWeight + " gm",
                        })}
                        {isSilverVault &&
                          renderPriceBreakdownItemCart({
                            label: "Silver Vault Used",
                            value: silverVaultWeightUsed + " gm",
                          })}
                        {isSilverVault &&
                          renderPriceBreakdownItemCart({
                            label: "Total Purchasing Silver Weight",
                            value: purchasedSilverWeight + " gm",
                          })}
                        {renderPriceBreakdownItemCart({
                          label: "Total Silver Coin Price (Incl. 3% GST)",
                          value:
                            "₹ " + amountWithTaxSilver.toLocaleString("en-IN"),
                        })}
                        {renderPriceBreakdownItemCart({
                          label: "Total Making Charges (Incl. 18% GST)",
                          value:
                            "₹ " + totalMakingCharges.toLocaleString("en-IN"),
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="my-5">
            <ProgressBar
              fromCart={true}
              metalTypeForProgressBar={"both"}
              displayMetalType={"both"}
            />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-100 text-xl sm:text-2xl extrabold tracking-wide">
                {finalAmount.toLocaleString("en-IN")}
                <span className="text-gray-400 text-sm ml-1 font-thin tracking-tighter">
                  Incl. (GST)
                </span>
              </p>
              <p
                onClick={ViewBreakUp}
                className=" underline cursor-pointer text-gold01 text-base flex items-center gap-2"
              >
                View Breakup <FaChevronCircleDown className="h-4" />
              </p>
            </div>
            <div>
              <CustomButton
                btnType="button"
                title="PROCEED"
                loading={loading}
                containerStyles="inline-flex w-full justify-center rounded-xl bg-themeBlue px-5 py-3 text-base extrabold text-black ring-1 ring-inset sm:mt-0 sm:w-auto"
                handleClick={() => {
                  checkoutCart();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;