import { selectUser } from "@/redux/userDetailsSlice";
import React, { FC, Fragment, useState, useRef } from "react";
import { useSelector } from "react-redux";
import BankVerification from "./addedBanksOrUPI";
import { CSSTransition } from "react-transition-group";
import AddNewBank from "./addNewBank";
import { PlusIcon } from "@heroicons/react/20/solid";

interface PayoutOptionTabProps {
  onCompleteKYC: () => void;
}

const PayoutOptionTab: FC<PayoutOptionTabProps> = ({ onCompleteKYC }) => {
  const user = useSelector(selectUser);
  const [toggleBankVerification, setToggleBankVerification] = useState(false);

  // Create a ref for the element to be transitioned
  const nodeRef = useRef(null);

  const toggleBankVerificationHandler = () => {
    setToggleBankVerification((prevToggle) => !prevToggle);
  };

  return (
    <Fragment>
      {user.data.isKycDone ? (
        <div className={`text-white ${toggleBankVerification ? "open" : ""}`}>
          <div className="coins_background rounded-tl rounded-tr">
            <div className="border-b p-4 flex justify-between items-center">
              <p className="text-white flex items-center">
                <img src="/bankmenu.png" className="h-6 inline-block pr-2" />
                Bank Details
              </p>

              <div
                onClick={toggleBankVerificationHandler}
                className="flex items-center gap-1 text-gold01 cursor-pointer"
              >
                <PlusIcon className="h-5" />
                Add Bank
              </div>
            </div>
          </div>
          <CSSTransition
            in={toggleBankVerification}
            timeout={500}
            classNames="bank-verification"
            unmountOnExit
            nodeRef={nodeRef} // Pass the ref here
          >
            <div ref={nodeRef}>
              <AddNewBank
                toggleBankVerificationHandler={toggleBankVerificationHandler}
              />
            </div>
          </CSSTransition>
          <BankVerification toggled={toggleBankVerification} />
        </div>
      ) : (
        <div className="w-full h-auto coins_background rounded flex flex-col items-center justify-center">
          <p className="text-white text-center text-xl extrabold p-4">
            Please Complete Your KYC First
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default PayoutOptionTab;
