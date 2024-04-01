"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import { getBlogPosts } from '@/components/sanity/getPost';
import Link from "next/link";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

interface Post {
  slug: {
    _type: string;
    current: string;
  };
  thumbImage: {
    asset: {
      url: string;
    };
  };
  title: string;
}

export default function Blog() {

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getBlogPosts().then(posts => setPosts(posts.slice(0, 8)));
  }, []);

  // console.log('posts 64', posts);

  return (
    <>
      <div className="bg-theme">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-center text-yellow-500 text-3xl sm:text-5xl extrabold mb-0 sm:mb-6">
            Our Blogs
          </h1>
          <Swiper
            loop={true}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 5,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 5,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 5,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 5,
              },
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            effect={"coverflow"}
            // grabCursor={true}
            centeredSlides={true}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            navigation={true}
            modules={[EffectCoverflow, Navigation, Autoplay]}
            className="mySwiperblog"
            style={{ padding: "0 20px !important" }}
          >
            {posts.map((feature, index) => (
              <SwiperSlide
                key={`${index}-Slider`}
                className="relative swiper-slide p-0 sm:p-4 pt-10"
              >
                <Link href={`/blog/${feature.slug.current}`} passHref>
                <div className="rounded-2xl h-44 sm:h-72 relative">
                  <div className="flex justify-center">
                    <Image
                      src={feature.thumbImage?.asset?.url}
                      className="rounded-2xl cursor-pointer"
                      alt="insite"
                      width={1920}
                      height={800}
                    />
                  </div>
                </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
