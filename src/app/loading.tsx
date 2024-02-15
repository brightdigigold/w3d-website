import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border-t-8 border-yellow-500 border-solid rounded-full h-16 w-16 animate-spin"></div>
      <p className="ml-2 text-yellow-400">Loading...</p>
    </div>
  );
};

export default Loading;
