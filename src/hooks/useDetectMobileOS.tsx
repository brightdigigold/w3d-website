import { useEffect, useState } from 'react';

const useDetectMobileOS = () => {
  const [os, setOS] = useState('');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent;

      if (/android/i.test(userAgent)) {
        setOS('Android');
      } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        setOS('iOS');
      } else {
        setOS('Unknown');
      }
    }
  }, []);

  return os;
};

export default useDetectMobileOS;
