import React, { useState } from 'react';
import ReactPlayer from 'react-player';

interface ImageGalleryProps {
  images: (string | null)[]; // The array can contain null values
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  // Filter out null or invalid media URLs and set the first valid one as the main media
  const validImages = images.filter(Boolean) as string[]; // Filters out null or undefined values

  const [mainMedia, setMainMedia] = useState(validImages[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Function to check if a media URL is a video
  const isVideo = (url: string) => url.endsWith('.mp4');

  // Handle thumbnail click
  const handleThumbnailClick = (media: string, index: number) => {
    setMainMedia(media);
    setActiveIndex(index);
  };

  // console.log("mainMedia", mainMedia)

  return (
    <div className="gallery-container">
      {/* Thumbnails */}
      <div className="thumbnails">
        {validImages.map((media, index) => (
          <div
            key={index}
            className="thumbnail-wrapper"
            onClick={() => handleThumbnailClick(media, index)}
          >
            {isVideo(media) ? (
              <div className="video-thumbnail">
                <img
                  src={validImages[0]} // Use first image as video thumbnail
                  alt={`Video Thumbnail ${index}`}
                  className={`thumbnail-image ${activeIndex === index ? 'active-thumbnail' : ''}`}
                />
                <div className="play-icon">&#9658;</div> {/* Play icon overlay */}
              </div>
            ) : (
              <img
                src={media}
                alt={`Thumbnail ${index}`}
                className={`thumbnail-image ${activeIndex === index ? 'active-thumbnail' : ''}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Media (Image or Video) */}
      <div className="main-media-container">
        {isVideo(mainMedia) ? (
          <ReactPlayer url={mainMedia} loop playing width="100%" height="100%" />
        ) : (
          <img src={mainMedia} alt="Main" className="main-media" />
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
