import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";

const CartItemsList = ({ cartProducts, increaseQty, decreaseQty, deleteFromCart, maxCoinError }) => {
    console.log("maxCoinError",  maxCoinError)
    
    // Trigger toast notification for errors
    useEffect(() => {
        if (maxCoinError) {
            toast.error(maxCoinError, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                pauseOnFocusLoss: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
    }, [maxCoinError]);

    return (
        <div className="mt-3">
            {cartProducts?.map((product) => (
                <CartItem
                    key={product?.product._id}
                    product={product}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                    deleteFromCart={deleteFromCart}
                />
            ))}
            <ToastContainer />
        </div>
    );
};

const CartItem = ({ product, increaseQty, decreaseQty, deleteFromCart }) => (
    <div className="rounded-xl bg-themeLight mb-3 sm:p-4 p-3 shadow-black shadow-sm">
        <div className="flex justify-between">
            <div className="flex gap-2 items-center">
                <img src={product?.product?.image?.image} className="h-14 w-14 sm:h-32 sm:w-32" alt="vault" />
                <CartItemDetails product={product} />
            </div>
            <CartItemActions product={product} increaseQty={increaseQty} decreaseQty={decreaseQty} deleteFromCart={deleteFromCart} />
        </div>
    </div>
);

const CartItemDetails = ({ product }) => (
    <div>
        <p className="poppins-semibold text-sm sm:text-xl text-gray-200">{product?.product?.name}</p>
        <p className="text-xs sm:text-lg text-gray-300">Making Charges: ₹{product?.product?.makingcharges}</p>
        <p className="text-xxs sm:text-lg text-gray-300">Metal Purity: {product?.product?.purity}</p>
        <p className="text-xxs sm:text-lg text-gray-300">Dimension: {product?.product?.dimension}</p>
    </div>
);

const CartItemActions = ({ product, increaseQty, decreaseQty, deleteFromCart }) => (
    <div className="items-center justify-end pt-2 md:pt-0">
      <div className="flex items-center rounded-lg bg-themeLight px-2 py-2 shadow-black shadow-sm">
        <div className="px-[6px] py-[4px] sm:p-2 rounded-md bg-themeLight text-red-500 cursor-pointer" onClick={() => decreaseQty(product?.product?.sku, product?.product?.count)}>
          <IoMdRemove />
        </div>
        <div className="mx-2 sm:mx-2 text-xs sm:text-lg">{product?.product?.count}</div>
        <div className="px-[6px] py-[4px] sm:p-2 rounded-md bg-themeLight text-green-400 cursor-pointer" onClick={() => increaseQty(product?.product?.maxForCart, product?.product?.coinHave, product?.product?.sku, product?.product?.count)}>
          <IoMdAdd />
        </div>
      </div>
      <div className="py-3 flex justify-end">
        <MdDelete className="cursor-pointer justify-end text-red-400 text-3xl sm:text-xl md:text-4xl lg:text-4xl" onClick={() => deleteFromCart(product?.product?.sku)} />
      </div>
    </div>
  );
  

export default CartItemsList;
