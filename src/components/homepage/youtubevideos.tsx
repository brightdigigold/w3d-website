
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import ReactPlayer from "react-player";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import Image from "next/image";

export default function Videos() {
    const [videos, setVideos] = useState([
        { id: "JhuNd_fs5Oo", title: "Why Bright Digi Gold ?", img: "/Why Bright DiGi Gold.jpg" },
        { id: "r2dZ_py_0yc", title: "How to Buy Gold ?", img: "/How to Buy Gold.jpg" },
        { id: "aV1XiNM5uHw", title: "How to Sell Gold ?", img: "/How to sell or Withdraw Gold.jpg" },
        { id: "5bKB71zRMbE", title: "How to get delivery of your gold ?", img: "/How to get Delivery of Gold Coin.jpg" },
        { id: "bCigluS2tRU", title: "How to earn rewards ?", img: "/How to Earn and Use Rewards.jpg" },
    ]);
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const updatedVideos = videos.map(video => ({
            ...video,
            thumbnail: `https://img.youtube.com/vi/${video.id}/0.jpg`
        }));
        setVideos(updatedVideos);
    }, []);

    const videoUrl = id => `https://www.youtube.com/watch?v=${id}`;

    const handleVideoClick = id => {
        setPlayingVideoId(id);
        setModalOpen(true);
    };

    const swiperRef = useRef<any>(null);

    const handleMouseEnter: any = () => {
        if (swiperRef.current && swiperRef.current.swiper.autoplay.running) {
            swiperRef.current.swiper.autoplay.stop();
        }
    };

    const handleMouseLeave = () => {
        if (swiperRef.current && !swiperRef.current.swiper.autoplay.running) {
            swiperRef.current.swiper.autoplay.start();
        }
    };

    const handleCloseModal = (event) => {
        if (event.target === event.currentTarget) {
            setModalOpen(false);
        }
    };

    return <>
        <div className="bg-theme">
            <div className="mx-auto px-4 sm:px-6 lg:px-16 py-12">
                <h1 className="text-center text-yellow-500 text-3xl sm:text-5xl extrabold mb-0 sm:mb-6">
                    Know More About Us
                </h1>
                <Swiper
                    loop={true}
                    breakpoints={{
                        600: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                    }}
                    autoplay={{ delay: 4500, disableOnInteraction: false }}
                    modules={[EffectCoverflow, Navigation, Autoplay]}
                    className="mySwiper"
                    ref={swiperRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {videos.map((video, index) => (
                        <SwiperSlide key={`${index}-Slider`} className="relative swiper-slide p-4 pt-10">
                            <div className="rounded-2xl h-40 sm:h-72 relative overflow-hidden" onClick={() => handleVideoClick(video.id)}>
                                <Image
                                    src={video.img}
                                    alt={video.title}
                                    width={1920}
                                    height={100}
                                    className="rounded-2xl cursor-pointer absolute"
                                    onClick={() => handleVideoClick(video.id)}
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                        objectFit: "cover"
                                    }}>
                                </Image>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
        {isModalOpen && (
            <div className="modal-overlay" onClick={handleCloseModal}>
                <div className="modal-content">
                    <ReactPlayer
                        className="video-player"
                        url={videoUrl(playingVideoId)}
                        playing={true}
                        controls={true}
                        width="100%"
                        height="100%"
                        onEnded={() => setModalOpen(false)}
                    />
                </div>
            </div>
        )}
    </>;
}
