import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Notiflix from "notiflix";
import { log } from "./logger";

const PageLoader = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      // Show the page loader
      // Implement your own logic here, such as displaying a progress bar or spinner
      Notiflix.Loading.custom({svgSize:'180px',customSvgCode: '<object type="image/svg+xml" data="/svg/pageloader.svg">svg-animation</object>'});
    };

    const handleRouteChangeComplete = () => {
      // Hide the page loader
      // Implement your own logic here to hide the loader
      log('Page loaded');
      Notiflix.Loading.remove();
    };

    const handleRouteChangeError = () => {
      // Handle any error during route change
      // Implement your own logic here to handle the error
      log('Error loading page');
      Notiflix.Loading.remove();
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.events]);

  return null;
};

export default PageLoader;
