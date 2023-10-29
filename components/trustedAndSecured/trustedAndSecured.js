import React, { useEffect, useState, useRef } from "react";
import style from "./trusted.module.css";
import axios from "axios";
import { AesEncrypt, AesDecrypt } from "../middleware";
import Image from "next/image";
import Slider from "react-slick";
import { log } from "../logger";


const TrustedAndSecured = () => {
  const [trustedAndSecured, setTrustedAndSecured] = useState([]);
  const funcForDecrypt = async (dataToBeDecrypt) => {
    const response = await AesDecrypt(dataToBeDecrypt);
    //
    return response;
  };

  var settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 5,
    slidesToScroll: 1,
    cssEase: 'linear',
    arrows: false,
    margin:10,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          autoplay: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          autoplay: true,
        },
      },
    ],
  };


  const funForAesEncrypt = async (dataToBeEncrypt) => {
    const response = await AesEncrypt(dataToBeEncrypt);
    //
    return response;
  };

  const TrustedAndSecureBanner = async () => {
    let dataToBeEncryptPayload = {
      type: "trusted_and_secure_banner_web",
    };
    const resAfterEncryptData = await funForAesEncrypt(dataToBeEncryptPayload);
    const payloadToSend = {
      payload: resAfterEncryptData,
    };
    axios
      .post(`${process.env.baseUrl}/data/banner/images`, payloadToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.data.payload);
        log("decryptedData", JSON.parse(decryptedData).data)
        setTrustedAndSecured(JSON.parse(decryptedData).data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    TrustedAndSecureBanner();
  }, []);
  return (
    <>
      <div className={style.trusted_and_secured}>
        <div className="container">
          <div className={style.trusted_text}>Trusted and secured by</div>
          <div className={style.trusted_brand}>
            <Slider  {...settings}>
              {trustedAndSecured.map((item, key) => {
                return (
                  <>
                    <div className={style.trusted_brand_logo} key={key}>
                      <div className={style.trusted_and_secured_box}>
                        <Image
                          src={item.value}
                          height={100}
                          width={100}
                          alt="trusted-images"
                        />
                      </div>
                    </div>
                  </>
                );
              })}
            </Slider>
          </div>
        </div>

      </div>
      {/* <div className={style.trusted_and_secured}>
        <div className="container-fluid px-3 pe-3">
          <div className={style.trusted_text}>Trusted and secured by</div>
          <div className="row" style={{ rowGap: "20px" }}>
            <div className="col-md-2 col-sm-4 col-12">
              <div className={style.trusted_and_secured_box}>
                <Image src={"/images/trusted2.svg"} height={100} width={100} alt="cashfree payment" />
              </div>
            </div>
            <div className="col-md-2 col-sm-4 col-12">
              <div className={style.trusted_and_secured_box}>
                <Image src={"/images/trusted3.svg"} height={100} width={100} alt="cashfree payment" />
              </div>
            </div>
            <div className="col-md-2 col-sm-4 col-12">
              <div className={style.trusted_and_secured_box}>
                <Image src={"/images/trusted4.svg"} height={100} width={100} alt="cashfree payment" />
              </div>
            </div>
            <div className="col-md-2 col-sm-4 col-12">
              <div className={style.trusted_and_secured_box}>
                <Image src={"/images/trusted5.svg"} height={100} width={100} alt="cashfree payment" />
              </div>
            </div>
            <div className="col-md-2 col-sm-4 col-12">
              <div className={style.trusted_and_secured_box}>
                <Image src={"/images/trusted6.svg"} height={100} width={100} alt="cashfree payment" />
              </div>
            </div>
            <div className="col-md-2 col-sm-4 col-12">
              <div className={style.trusted_and_secured_box}>
                <Image src={"/images/trusted7.svg"} height={75} width={75} alt="cashfree payment" />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default TrustedAndSecured
