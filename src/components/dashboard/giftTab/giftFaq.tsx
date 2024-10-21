import { AesDecrypt } from "@/components/helperFunctions";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";

const GiftFaq: React.FC = () => {
  const [accordionData, setAccordionData] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/faqs?type=GIFT`, {
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = AesDecrypt(data.payload);
        setAccordionData(JSON.parse(decryptedData).data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <div className=" col-span-2 p-4 rounded-lg bg-themeLight text-white">
        <p className="text-gold01 text-center text-2xl sm:text-4xl extrabold">
          Gift Faq
        </p>
        <dl className="mt-10 space-y-2 divide-y divide-gray-900/10">
          {accordionData.map((faq, index) => {
            if (index < 5) {
              return (
                <Disclosure as="div" key={faq.slug} className="">
                  {({ open }) => (
                    <>
                      <dt>
                        {open ? (
                          <Disclosure.Button className="faq-back flex w-full relative text-sm sm:text-base items-start justify-between text-left text-white rounded-t-2xl px-4 py-4">
                            <span className="text-base extrabold leading-7">
                              {faq?.title}
                            </span>
                            <span className="ml-6 flex h-7 items-center">
                              {open ? (
                                <FaChevronCircleUp
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              ) : (
                                <FaChevronCircleDown
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        ) : (
                          <Disclosure.Button className="faq-back flex w-full relative text-sm sm:text-base items-start justify-between text-left text-white rounded-2xl px-4 py-4">
                            <span className="text-base extrabold leading-7">
                              {faq?.title}
                            </span>
                            <span className="ml-6 flex h-7 items-center">
                              {open ? (
                                <FaChevronCircleUp
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              ) : (
                                <FaChevronCircleDown
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        )}
                      </dt>
                      <Disclosure.Panel
                        as="dd"
                        className="text-base leading-7 text-gray-600 rounded-b-2xl px-4 py-2 bg-themeBlue"
                      >
                        <p
                          dangerouslySetInnerHTML={{ __html: faq.description }}
                        />
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              );
            }
          })}
          <div className="flex justify-center items-center">
            <Link href="/faqs">
              <div className="mt-4 bg-themeBlue text-black rounded-lg px-12 py-2 cursor-pointer text-lg bold">
                View All
              </div>
            </Link>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default memo(GiftFaq);
