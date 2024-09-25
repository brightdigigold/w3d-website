"use client";
import { Tab } from "@headlessui/react";
import OrdersTabs from "../ordersTab/tabs/tabs";
import GiftTab from "../giftTab/tabs";
import { classNames } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { selectUser } from "@/redux/userDetailsSlice";
import { SetUserType } from "@/redux/authSlice";

const data = [
  { id: 1, name: "Orders" },
  { id: 2, name: "Gifting" },
];

const DashboardTopTabs = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userType = useSelector((state: RootState) => state.auth.UserType);

  useEffect(() => {
    dispatch(SetUserType(user.data.type));
  }, [])

  return (
    <div className="w-full pt-32 pb-28 xl:pb-8">
      <Tab.Group defaultIndex={0}>
        {userType !== "temple" && userType !== "corporate" && (
          <Tab.List className="flex space-x-1 rounded p-1 bg-themeLight mx-3">
            {data.map((category, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded py-2.5 text-lg font-medium leading-5",
                    "focus:outline-none",
                    selected ? "bg-themeBlue shadow" : "text-blue-100"
                  )
                }
              >
                {category.name}
              </Tab>
            ))}
          </Tab.List>
        )}
        <Tab.Panels>
          <Tab.Panel
            className={classNames("rounded-xl p-3", "focus:outline-none")}
          >
            <OrdersTabs />
          </Tab.Panel>
          <Tab.Panel
            className={classNames("rounded-xl p-3", "focus:outline-none")}
          >
            {userType !== "temple" ? <GiftTab /> : <p className="text-center text-white bold">Gifting is disabled for temple users.</p>}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default DashboardTopTabs;
