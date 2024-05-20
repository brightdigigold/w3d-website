"use client";
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import ReactPlayer from "react-player";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import Image from 'next/image';

export default function Videos() {
    const [videos, setVideos] = useState([
        { id: "JhuNd_fs5Oo", title: "Why Bright Digi Gold ?",img:"/images/buybanner.png" },
        { id: "r2dZ_py_0yc", title: "How to Buy Gold ?",img:"/images/buygold.png" },
        { id: "aV1XiNM5uHw", title: "How to Sell Gold ?",img:"/images/sellbanner.png"  },
        { id: "5bKB71zRMbE", title: "How to get delivery of your gold ?",img:"/images/delivery.png" },
        { id: "bCigluS2tRU", title: "How to earn rewards ?",img:"/images/rewards.png" },
        
    ]);
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    // Adding thumbnail URLs to the videos state
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

    const handleMouseEnter = () => {
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

    return (
        <>
            <div className="bg-theme">
                <div className="mx-auto px-4 sm:px-6 lg:px-16 py-12">
                    <h1 className="text-center text-yellow-500 text-3xl sm:text-5xl extrabold mb-0 sm:mb-6">
                       Know More About Us
                    </h1>
                    <Swiper
                        loop={true}
                        // breakpoints={{
                        //     320: { slidesPerView: 2, spaceBetween: 5 },
                        //     640: { slidesPerView: 2, spaceBetween: 5 },
                        //     768: { slidesPerView: 2, spaceBetween: 5 },
                        //     1024: { slidesPerView: 3, spaceBetween: 5 },
                        // }}

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
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        // effect={"coverflow"}
                        // centeredSlides={true}
                        // coverflowEffect={{
                        //     rotate: 150,
                        //     stretch: 0,
                        //     depth: 10,
                        //     modifier: 1,
                        //     slideShadows: true,
                        // }}
                        // navigation={true}
                        modules={[EffectCoverflow, Navigation, Autoplay]}
                        className="mySwiper"
                        ref={swiperRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        // style={{ padding: "0 20px !important" }}
                    >
                        {videos.map((video:any, index:any) => (
                            <SwiperSlide key={`${index}-Slider`} className="relative swiper-slide p-4 pt-10">
                                <div className="rounded-2xl h-40 sm:h-72 relative overflow-hidden">
                                    <Image
                                        src={video.img}
                                       
                                        alt={video.title}
                                        width={1920}
                                        height={100}
                                        objectFit="cover"
                                        className="rounded-2xl cursor-pointer"
                                        onClick={() => handleVideoClick(video.id)}
                                        
                                    />
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
        </>
    );
}
