import React from 'react';
import { FaSpinner } from 'react-icons/fa'; 

interface ButtonLoaderProps {
  loading: boolean;
  buttonText: string;
}

const ButtonLoader: React.FC<ButtonLoaderProps> = ({ loading, buttonText }) => {
  return (
    <div  className="button-loader">
      {loading ? <FaSpinner className="spinner" /> : <span>{buttonText}</span>}
    </div>
  );
};

export default ButtonLoader;
