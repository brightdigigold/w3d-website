"use client";
import { customButtonProps } from "@/types";
import Image from "next/image";
import { ImSpinner8 } from "react-icons/im"; // Spinner icon

const CustomButton = ({
  title,
  containerStyles,
  handleClick,
  btnType,
  textStyles,
  Icon,
  isDisabled,
  loading, // Add loading prop
}: customButtonProps) => {
  return (
    <button
      disabled={isDisabled || loading} // Disable the button if loading
      type={btnType || "button"}
      className={`flex justify-center ${containerStyles}`} // Flexbox centering horizontally
      onClick={handleClick}
      style={{ minWidth: '120px', padding: '10px' }} // Set a min-width and padding for consistent button size
    >
      {loading ? (
        <ImSpinner8 className="animate-spin text-xl mt-4" /> // Centered spinner horizontally
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

// "use client";
// import { customButtonProps } from "@/types";
// import { ImSpinner8 } from "react-icons/im"; // Spinner icon

// const CustomButton = ({
//   title,
//   containerStyles,
//   handleClick,
//   btnType,
//   textStyles,
//   isDisabled,
//   loading, // Add loading prop
// }: customButtonProps) => {
//   return (
//     <button
//       disabled={isDisabled || loading} // Disable the button if loading
//       type={btnType || "button"}
//       className={`flex justify-center ${containerStyles}`} // Flexbox centering horizontally
//       onClick={handleClick}
//       style={{ minWidth: '120px', padding: '10px' }} // Set a min-width and padding for consistent button size
//     >
//       {loading ? (
//         <ImSpinner8 className="animate-spin text-xl mt-4" /> // Centered spinner horizontally
//       ) : (
//         <span className={`text-center ${textStyles}`}>{title}</span> // Centered text when not loading
//       )}
//     </button>
//   );
// };

// export default CustomButton;


