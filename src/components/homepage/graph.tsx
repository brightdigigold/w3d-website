import React from "react";
import Image from "next/image";

const Graph = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-16 py-12 " >
      <p className=" text-white sm:pl-24 text-sm sm:text-2xl extrabold">
        A Closer Look At The Rising Curve of
        <span className=" text-gold01 pl-1">Gold</span> Prices Over The Years.
        From
        <span className=" text-gold01 pl-1">2019-2024</span>
      </p>
      {/* <div className="" style={{ width: "80%", height: "60%" }}>
        <Image src="https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/GrowthGraph.gif" className=" px-0 sm:px-16" width={400} height={400} alt="Growth Graph" />
      </div> */}

      <div className="relative mx-auto pt-10 lg:pt-0 w-full md:w-3/4 lg:w-2/3">
        <Image
          src="https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/GrowthGraph.gif"
          alt="Growth Graph"
          width={1200}
          height={675}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto"
          }} />
      </div>

    </div>
  );
};

export default Graph;
