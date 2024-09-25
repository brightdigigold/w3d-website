import React, { useState } from 'react';
import ReactPlayer from 'react-player';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [mainMedia, setMainMedia] = useState(images[0]);
    const [activeIndex, setActiveIndex] = useState(0); // Track which image or video is active

    // Function to determine if the media is a video
    const isVideo = (url: string) => {
        return url.endsWith('.mp4');
    };

    // Handle when a thumbnail is clicked
    const handleThumbnailClick = (media: string, index: number) => {
        setMainMedia(media);
        setActiveIndex(index); // Update the active media index
    };

    return (
        <div className="gallery-container">
            {/* Thumbnails */}
            <div className="thumbnails">
                {images.map((media, index) => (
                    <img
                        key={index}
                        src={isVideo(media) ? 'https://via.placeholder.com/100x100?text=Video' : media}
                        alt={`Thumbnail ${index}`}
                        className={`thumbnail-image ${activeIndex === index ? 'active-thumbnail' : ''}`}
                        onClick={() => handleThumbnailClick(media, index)}
                    />
                ))}
            </div>

            {/* Main Media (Image or Video) */}
            <div className="main-media-container">
                {isVideo(mainMedia) ? (
                    <ReactPlayer
                        url={mainMedia}
                        loop={true}
                        autoPlay={true}
                        playing={true}
                        width="100%"
                        height="100%"
                    />
                ) : (
                    <img src={mainMedia} alt="Main" className="main-media" />
                )}
            </div>
        </div>
    );
};

export default ImageGallery;




{/* <ReactPlayer
            url={mainMedia}
            loop={true}
            autoPlay={true}
            playing={true}
            width="100%"
            height="100%"
          /> */}