import { customButtonProps } from "@/types";
import clsx from "clsx";
import Image from "next/image";
import { ImSpinner8 } from "react-icons/im";

const CustomButton = ({
  title,
  containerStyles,
  handleClick,
  btnType,
  textStyles,
  Icon,
  isDisabled,
  loading,
  noPadding = false,
}: customButtonProps) => {
  return (
    <button
      disabled={isDisabled || loading} // Disable the button if loading
      type={btnType || "button"}
      // className={`flex justify-center items-center ${containerStyles}`} // Flexbox centering both horizontally and vertically
      className={clsx(
        {
          "flex justify-center items-center": Icon || loading, 
          "custom-btn": !(Icon || loading), 
        },
        containerStyles 
      )}
      onClick={handleClick}
      style={{
        minWidth: '120px',
        padding: noPadding ? '0px' : '8px',
      }}
    >
      {loading ? (
        <ImSpinner8 className="animate-spin m-1" /> // Spinner is centered vertically and horizontally
      ) : (
        <span className={`text-center ${textStyles}`}>{title}</span> // Centered text when not loading
      )}

      {Icon && !loading && (
        <div className="relative w-6 h-6 ml-2">
          <Image
            src={Icon}
            alt="Icon"
            fill
            className="object-contain"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      )}
    </button>
  );
};

export default CustomButton;
