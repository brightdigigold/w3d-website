import React from "react";

const Graph = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-16 py-12 " >
      <p className=" text-white sm:pl-24 text-sm sm:text-2xl extrabold">
        A Closer Look At The Rising Curve of
        <span className=" text-gold01 pl-1">Gold</span> Prices Over The Years.
        From
        <span className=" text-gold01 pl-1">2019-2024</span>
      </p>
      <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/GrowthGraph.gif" className="w-full px-0 sm:px-16" alt="Growth Graph"/>
    </div>
  );
};

export default Graph;
