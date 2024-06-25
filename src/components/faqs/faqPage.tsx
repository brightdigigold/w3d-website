"use client";
import React, { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { FaChevronCircleDown, FaChevronCircleUp, FaPlus, FaMinus } from 'react-icons/fa';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { funcForDecrypt } from '../helperFunctions';
import OtpModal from '../modals/otpModal';

const Section = ({ sectionType, faqData, isActive }: any) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null); // Track the index of the open item

  if (!isActive) {
    return null;
  }

  const handleToggle = (index: number) => {
    // Toggle the open state based on the index. If the same index is clicked, close it.
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderSection = () => {
    return faqData.map((faq: any, index: number) => {
      if (faq.type === sectionType) {
        const isOpen = index === openIndex; // Determine if this FAQ is open
        return (
          <Disclosure as="div" key={index} className="pt-4">
            <>
              <dt onClick={() => handleToggle(index)}> {/* Updated to use handleToggle */}
                <Disclosure.Button className={`faq-back flex w-full relative text-sm sm:text-base items-start justify-between text-left text-white ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'} px-4 py-4`}>
                  <span className="text-base bold leading-7">
                    {faq.title}
                  </span>
                  <span className="ml-6 flex h-7 items-center">
                    {isOpen ? (
                      <FaMinus className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <FaPlus className="h-6 w-6" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </dt>
              <Disclosure.Panel as="dd" className="bold sm:text-lg leading-7 text-gray-600 rounded-b-2xl px-4 py-2 bg-themeBlue">
                <p dangerouslySetInnerHTML={{ __html: faq.description }} />
              </Disclosure.Panel>
            </>
          </Disclosure>
        );
      }
      return null; // Return null for unmatched type, ensuring all paths return a value
    }).filter(Boolean); // Filter out any nulls from the map
  };

  return (
    <div>
      <h3 className="py-6 text-gold01 text-center text-2xl">{sectionType}</h3>
      <dl className="space-y-2 divide-y divide-gray-900/10">
        {renderSection()}
      </dl>
    </div>
  );
};

const Faq = () => {
  const [faqData, setFaqData] = useState<any[]>([]);
  const [activeSectionType, setActiveSectionType] = useState("BDG");
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);


  const handleSectionClick = (type: string) => {
    setActiveSectionType(type);
  };

  useEffect(() => {
    fetch(`${process.env.baseUrl}/public/faqs`, {
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.payload);
        setFaqData(JSON.parse(decryptedData).data);
      })
      .catch((error) => console.error(error));
  }, []);
  // "BDG", WILL BE PUT INSIDE THE sectionTypes ARRAY TO SHOW
  const sectionTypes = [
    "BDG",
    "BUY",
    "SELL",
    "DELIVERY",
    "GIFT",
    "RNE",
    "KYC",
    "DIGITAL GOLD",
  ];

  return (
    <div>
      {otpModal && <OtpModal />}
      <div className="mx-auto pt-4 pb-28 xl:pb-8 px-4 sm:px-6 lg:px-16 py-4 text-white">
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-x-2 gap-y-5 sm:gap-x-5 mt-6 place-items-center">
          <div className="w-full ">
            <div
              onClick={() => handleSectionClick("BDG")}
              className={`cursor-pointer rounded-md w-full bg-themeLight block sm:inline-block px-2 sm:px-6 py-1 sm:py-2 text-center shadow-xl text-white hover:border-1 ${
                activeSectionType === "BDG"
                  ? "border-1 border-themeDarkBlue"
                  : ""
              }`}
            >
              <img src="/faq1.png" className="h-12 mx-auto" />
              <p className="text-xxs  sm:text-sm mt-1">BDG</p>
            </div>
          </div>
          <div className="w-full">
            <div onClick={() => handleSectionClick("BUY")}
              className={`cursor-pointer rounded-md w-full bg-themeLight block sm:inline-block px-2 sm:px-6 py-1 sm:py-2 text-center shadow-xl text-white  ${
                activeSectionType === "BUY"
                  ? "border-1 border-themeDarkBlue"
                  : ""
              }`}
            >
              <img
                // onClick={() => handleSectionClick("BUY")}
                src="/faq2.png"
                className="h-12 mx-auto"
              />
              <p className="text-xxs  sm:text-sm mt-1">BUY</p>
            </div>
          </div>
          <div className="w-full ">
            <div onClick={() => handleSectionClick("SELL")}
              className={`cursor-pointer rounded-md w-full bg-themeLight block sm:inline-block px-2 sm:px-6 py-1 sm:py-2 text-center shadow-xl text-white  ${
                activeSectionType === "SELL"
                  ? "border-1 border-themeDarkBlue"
                  : ""
              }`}
            >
              <img
                // onClick={() => handleSectionClick("SELL")}
                src="/faq3.png"
                className="h-12 mx-auto"
              />
              <p className="text-xxs  sm:text-sm mt-1">SELL</p>
            </div>
          </div>
          <div className="w-full ">
            <div
              onClick={() => handleSectionClick("DELIVERY")}
              className={`cursor-pointer rounded-md w-full bg-themeLight block sm:inline-block px-2 sm:px-6 py-1 sm:py-2 text-center shadow-xl text-white  ${
                activeSectionType === "DELIVERY"
                  ? "border-1 border-themeDarkBlue"
                  : ""
              }`}
            >
              <img src="/faq4.png" className="h-12 mx-auto" />
              <p className="text-xxs  sm:text-sm mt-1">DELIVERY</p>
            </div>
          </div>
          <div className="w-full">
            <div
              onClick={() => handleSectionClick("GIFT")}
              className={`cursor-pointer rounded-md w-full bg-themeLight block sm:inline-block px-2 sm:px-6 py-1 sm:py-2 text-center shadow-xl text-white  ${
                activeSectionType === "GIFT"
                  ? "border-1 border-themeDarkBlue"
                  : ""
              }`}
            >
              <img src="/faq5.png" className="h-12 mx-auto" />
              <p className="text-xxs  sm:text-sm mt-1">GIFT</p>
            </div>
          </div>
          <div className="w-full">
            <div
              onClick={() => handleSectionClick("RNE")}
              className={`cursor-pointer rounded-md w-full bg-themeLight block sm:inline-block px-2 sm:px-6 py-1 sm:py-2 text-center shadow-xl text-white  ${
                activeSectionType === "RNE"
                  ? "border-1 border-themeDarkBlue"
                  : ""
              }`}
            >
              <img src="/faq6.png" className="h-12 mx-auto" />
              <p className="text-xxs  sm:text-sm mt-1">RNE</p>
            </div>
          </div>
          <div className="w-full">
            <div
              onClick={() => handleSectionClick("KYC")}
              className={`cursor-pointer rounded-md w-full bg-themeLight block sm:inline-block px-2 sm:px-6 py-1 sm:py-2 text-center shadow-xl text-white  ${
                activeSectionType === "KYC"
                  ? "border-1 border-themeDarkBlue"
                  : ""
              }`}
            >
              <img src="/faq7.png" className="h-12 mx-auto" />
              <p className="text-xxs  sm:text-sm mt-1">KYC</p>
            </div>
          </div>
          <div className="w-full">
            <div
              onClick={() => handleSectionClick("DIGITAL GOLD")}
              className={`cursor-pointer rounded-md w-full bg-themeLight block sm:inline-block px-2 sm:px-6 py-1 sm:py-2 text-center shadow-xl text-white  ${
                activeSectionType === "DIGITAL GOLD"
                  ? "border-1 border-themeDarkBlue"
                  : ""
              }`}
            >
              <img src="/faq8.png" className="h-9 mx-auto" />
              <p className="text-xxs  sm:text-sm mt-1">DIGITAL GOLD</p>
            </div>
          </div>
        </div>

        {sectionTypes.map((sectionType) => (
          <Section
            key={sectionType}
            sectionType={sectionType}
            faqData={faqData}
            isActive={activeSectionType === sectionType}
          />
        ))}
      </div>
    </div>
  );
};

export default Faq;

