// "use client";
// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { Autoplay } from "swiper/modules";
// import Image from "next/image";

// const features = [
//   {
//     img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/offer1.webp",
//     blurDataURL: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSDIAAAABJLUvAQC4A1tXJAAAQU1EVgAA3YAAAADUAAABf///tA==",
//   },
//   {
//     img: "https://brightdigigold.s3.ap-south-1.amazonaws.com/offer2.webp",
//     blurDataURL: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSDIAAAABJLUvAQC4A1tXJAAAQU1EVgAA3YAAAADUAAABf///tA==",
//   },
// ];

// export default function OfferSlider() {
//   return (
//     <>
//       <link
//         rel="preload"
//         as="image"
//         href="https://brightdigigold.s3.ap-south-1.amazonaws.com/offer1.webp"
//       />
//       <div className="relative">
//         <Swiper
//           loop={features.length > 1}
//           breakpoints={{
//             640: {
//               slidesPerView: 1,
//               spaceBetween: 10,
//             },
//             768: {
//               slidesPerView: 1,
//               spaceBetween: 10,
//             },
//             1024: {
//               slidesPerView: 1,
//               spaceBetween: 10,
//             },
//           }}
//           autoplay={{
//             delay: 2500,
//             disableOnInteraction: false,
//           }}
//           modules={[Autoplay]}
//           className="mySwiper"
//         >
//           {features.map((feature, index) => (
//             <SwiperSlide key={`${index}-Slider`} className="relative swiper-slide">
//               <Image
//                 src={feature.img}
//                 alt="Bdg offer"
//                 width={1261}
//                 height={400}
//                 // sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1261px"
//                 priority={index === 0}
//                 loading={index === 0 ? "eager" : "lazy"}
//                 placeholder="blur"
//                 layout="intrinsic"
//                 blurDataURL={feature.blurDataURL}
//                 style={{
//                   width: "100%",
//                   height: "auto",
//                 }}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//       <style jsx>{`
//         .swiper-slide {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }

//         .swiper-slide img {
//           object-fit: cover;
//           max-width: 100%;
//           height: auto;
//         }
//       `}</style>
//     </>
//   );
// }


// img: "/offer2.Webp",


"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import Image from "next/image";

export default function OfferSlider() {
  return <>
    <div className=" bg-themeBlue " >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className=""
      >
        <div className="grid">
          <motion.div variants={fadeIn("right", "spring", 0.5, 1)}>
            <Image
              // className="z-10 w-full"
              src="https://brightdigigold.s3.ap-south-1.amazonaws.com/offer2.webp"
              alt="Bdg offer"
              width={1261}
              height={400}
              layout="responsive"
              style={{
                width: "100%",
                height: "auto"
              }} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  </>;
}
