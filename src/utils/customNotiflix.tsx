import Notiflix from 'notiflix';

export const initializeNotiflix = () => {
  Notiflix.Report.init({
    width: '320px',
    borderRadius: '8px  red',
    titleFontSize: '18px',
    messageFontSize: '14px',
    svgSize: '40px',
    backgroundColor: `linear-gradient(0.69deg, #154c6d 0.62%, #12242e 101.27%)`,
    // backOverlayColor: 'rgba(0,0,0,0.5)', // Background overlay
    success: {
      svgColor: '#28a745',  // Success icon color
      titleColor: '#155724',
      messageColor: '#155724',
    },
    failure: {
      svgColor: '#e74c3c',  // Failure icon color
      titleColor: '#FFFFFF',
      messageColor: '#FFFFFF',
      buttonBackground: '#cde8f1',
      buttonColor: '#000000',
      backOverlayColor: 'transparent',
    },
    info: {
      svgColor: '#3498db',  // Info icon color
      titleColor: '#0c5460',
      messageColor: '#0c5460',
    },
  });
};
