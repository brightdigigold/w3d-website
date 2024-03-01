import Image from "next/image";

const TabButton = ({ tab, activeTab, handleTabClick }) => (
    <div
      onClick={() => handleTabClick(tab.tabName)}
      className={` text-gray-100 cursor-pointer flex items-center ${activeTab === tab.tabName ? "opacity-100 extrabold" : "opacity-50"}`}
      aria-pressed={activeTab === tab.tabName}
    >
      <div>{tab.src && <Image src={tab.src} alt={tab.alt} className="h-4 sm:h-5 ml-1 sm:ml-2" width={28} height={30} />}</div>
      <div className={`text-sm sm:text-base ml-0 sm:ml-2  ${tab.tabName !== 'SILVER' ? "border-r-2 border-slate-400 pr-1" : ""}`}>{tab.tabName}</div>
    </div>
  );

  export default TabButton