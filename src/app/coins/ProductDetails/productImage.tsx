import React, { useState } from 'react';
import ReactPlayer from 'react-player';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainMedia, setMainMedia] = useState(images[0]);
  const [activeIndex, setActiveIndex] = useState(0); 
//   console.log("images", images)

  // Function to determine if the media is a video
  const isVideo = (url: string) => {
    return url.endsWith('.mp4');
  };

  // Handle when a thumbnail is clicked
  const handleThumbnailClick = (media: string, index: number) => {
    setMainMedia(media);
    setActiveIndex(index); // Update the active media index
  };

  console.log("mainMedia", mainMedia)

  return (
    <div className="gallery-container">
      {/* Thumbnails */}
      <div className="thumbnails">
        {images.map((media, index) => (
          <div
            key={index}
            className="thumbnail-wrapper"
            onClick={() => handleThumbnailClick(media, index)}
          >
            {/* If it's a video, use the first image as the thumbnail and overlay the play icon */}
            {isVideo(media) ? (
              <div className="video-thumbnail">
                <img
                  src={images[0]} // Use first image as video thumbnail
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
          <ReactPlayer
            url={mainMedia}
            loop={true}
            playing={true}
            width="100%"
            height="100%"
          />
        ) : (
          <img src={mainMedia} alt="Main" className="main-media " />
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
