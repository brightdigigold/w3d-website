import TagManager from 'react-gtm-module';

export const initializeGTM = () => {
  const tagManagerArgs = {
    gtmId: 'G-886B7Z7WNT', // Replace with your GTM container ID
  };

  TagManager.initialize(tagManagerArgs);
};