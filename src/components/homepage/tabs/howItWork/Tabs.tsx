// import { url } from "aws-sdk/clients/finspace";
import React, { FC } from "react";

type TabsProps = {
  tabs: {
    label: string;
    img: string;
    alt: string;
    index: number;
    Component: FC<{ index: number }>;
  }[];
  selectedTab: number;
  onClick: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

const Tabs: FC<TabsProps> = ({
  className = "tabs-component1",
  tabs = [],
  selectedTab = 0,
  onClick,
  orientation = "horizontal",
}) => {
  const Panel = tabs && tabs.find((tab) => tab.index === selectedTab);

  return (
    <div
      className={
        orientation === "vertical" ? className + " vertical" : className
      }
    >
      <div role="tablist" className="" aria-orientation={orientation}>
        {tabs.map((tab) => (
          <button
            className={selectedTab === tab.index ? "active" : ""}
            onClick={() => onClick(tab.index)}
            key={tab.index}
            type="button"
            role="tab"
            aria-selected={selectedTab === tab.index}
            aria-controls={`tabpanel-${tab.index}`}
            tabIndex={selectedTab === tab.index ? 0 : -1}
            id={`btn-${tab.index}`}
          >
            <div className="flex items-center">
              <img
                src={tab.img}
                alt={tab.alt}
                className="mr-2 sm:mr-4 h-5 sm:h-8"
              />{" "}
              {tab.label}
            </div>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        aria-labelledby={`btn-${selectedTab}`}
        id={`tabpanel-${selectedTab}`}
      >
        {Panel && <Panel.Component index={selectedTab} />}
      </div>
    </div>
  );
};
export default Tabs;
