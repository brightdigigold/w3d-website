import React, { useEffect, useState } from 'react'
import styles from './testimonials.module.css'
import Image from 'next/image'
import axios from 'axios'
import Slider from "react-slick";
import ReactHtmlParser from 'react-html-parser';
import { AesDecrypt } from "../middleware"
import { log } from "../logger";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const funcForDecrypt = async (dataToBeDecrypt) => {
    const response = await AesDecrypt(dataToBeDecrypt)
    return response;
  }

  var settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 3,
    cssEase: 'linear',
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
        },
      },
    ],
  };

  useEffect(() => {
    // const configHeaders = { headers: { 'Content-Type': "application/json" } };
    fetch(`${process.env.baseUrl}/public/testimonials?page=0&limit=20`, { headers: { 'content-type': "application/json" } }).then(response => response.json())
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.payload);
        log('testimonial',JSON.parse(decryptedData).data);
        setTestimonials(JSON.parse(decryptedData).data.testimonial)
      })

      .catch(error => console.error(error));

  }, [])
  return (
    <div>
      <div className={`${styles.testimonials_bg} testimonial`}>
        <div className='container'>
          <div className={styles.testimonials_text}>
            Testimonials
          </div>
          <Slider  {...settings}>
            {testimonials.map((item, key) => {
              return (
                <>
                  <div className={styles.user_image_text_bg} key={key}>
                    <div style={{ marginLeft: "10px" }}>
                      <Image src={"/images/testimonial1.png"} height={40} width={40} alt='user' />
                    </div>
                    <div className={styles.user_image}>
                      <Image src={item.thumbnail_image} height={150} width={150} alt='user' />
                    </div>
                    <div className={styles.user_text}>
                      {item.title}
                    </div>
                    <div className={styles.user_description}>
                    {ReactHtmlParser(item.description)}
                    </div>
                    <div style={{ position: "absolute", right: "15px", bottom: "5px" }}>
                      <Image src={"/images/testimonial2.png"} height={40} width={40} alt='user' />
                    </div>
                  </div>
                </>
              )
            })}
          </Slider>
        </div>
      </div>
      <style>{`
        @media screen and (max-width:767px) {
            .testimonial .container{
                --bs-gutter-x: 0rem !important;
            }
        }
      `}</style>
    </div>
  )
}

export default Testimonials
