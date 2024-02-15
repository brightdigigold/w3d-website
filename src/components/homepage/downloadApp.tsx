'use client'
import React from "react";
import Image from "next/image";
import Link from "next/link";

const DownloadApplication = () => {
  const [activeItem, setActiveItem] = React.useState(0);

  const handleClick = (index: any) => {
    setActiveItem(index);
  };
  
  function scrollToElement1() {
    const element = document.getElementById("selectedApp");
    if (element) {
      element.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  function scrollToElement2() {
    const element = document.getElementById("selectedApp");
    if (element) {
      element.scrollTo({
        top: 300,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  function scrollToElement3() {
    const element = document.getElementById("selectedApp");
    if (element) {
      element.scrollTo({
        top: 600,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  return (
    <div>
      <div className="mobile_google_application">
        <div className="container scroll">
          <div className="mobile_and_application">
            <div className="mobile_border">
              <div className="inner_mobile">
                <div className="mobile_header">
                  <div className="mobile_time">9:41</div>
                  <div className="mobile_battery_side">
                    <Image
                      src={"/images/Cellular Connection.svg"}
                      height={30}
                      width={30}
                      alt="Cellular"
                    />
                    <Image
                      src={"/images/Wifi.svg"}
                      height={30}
                      width={30}
                      alt="Wifi"
                    />
                    <Image
                      src={"/images/Battery.svg"}
                      height={30}
                      width={30}
                      alt="Battery"
                    />
                  </div>
                </div>
                <div className="pure_gold" id="selectedApp">
                  <Image
                    src={"/images/1.svg"}
                    id="myElement1"
                    height={250}
                    width={450}
                    alt="1"
                  />
                  <Image
                    src={"/images/2.svg"}
                    id="myElement2"
                    height={250}
                    width={450}
                    alt="2"
                  />
                  <Image
                    src={"/images/3.svg"}
                    id="myElement3"
                    height={250}
                    width={450}
                    alt="3"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="application download-list">
                <ul>
                  <li
                    className={activeItem === 0 ? "activeItem" : ""}
                    onClick={() => handleClick(0)}
                  >
                    <Image
                      src={"/images/pure.svg"}
                      height={120}
                      width={120}
                      onClick={scrollToElement1}
                      className={activeItem === 0 ? "activeItem" : "inactive"}
                      alt="99pure"
                    />
                  </li>
                  <li
                    className={activeItem === 1 ? "activeItem" : ""}
                    onClick={() => handleClick(1)}
                  >
                    <Image
                      src={"/images/gold-karet.svg"}
                      height={85}
                      width={85}
                      onClick={scrollToElement2}
                      className={activeItem === 1 ? "activeItem" : "inactive"}
                      alt="24karat"
                    />
                  </li>
                  <li
                    className={activeItem === 2 ? "activeItem" : ""}
                    onClick={() => handleClick(2)}
                  >
                    <Image
                      src={"/images/secure_bann.svg"}
                      height={120}
                      width={120}
                      onClick={scrollToElement3}
                      className={activeItem === 2 ? "activeItem" : "inactive"}
                      alt="secure"
                    />
                  </li>
                </ul>
              </div>
              <div className="download_application">Download Our App</div>
              <div className="download_btn flex-md-column flex-lg-row">
                <div className="google_play">
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.brightdigigold.customer"
                    target="_blank"
                  >
                    <Image
                      src={"/images/playstore.svg"}
                      height={150}
                      width={400}
                      alt="google_play"
                    />
                  </Link>
                </div>
                <div className="apple_play">
                  <Link
                    href="https://apps.apple.com/in/app/bright-digi-gold-buy-24k-gold/id1640972173"
                    target="_blank"
                  >
                    <Image
                      src={"/images/appstore.svg"}
                      height={150}
                      width={400}
                      alt="apple_play"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
         .download-list {
            display: flex;
            justify-content: center;
            align-items: center;
        }
         .download-list   ul {
          list-style: none;
          display: flex;
          padding-left:0px !important;
        }
        .download-list li {
          margin-right: 20px;
          border-right: 2px solid #ccc;
          padding-right: 20px;
        }
        .download-list ul li{
            opacity: 0.5;
            border-right: 2px solid black;
        }
        .download-list .activeItem {
          opacity: 1;
          cursor:pointer;
        }
        .download-list .inactive {
          opacity: 0.5;
          cursor:pointer;
        }
        .scroll ::-webkit-scrollbar {
        display:none;
        }
        .mobile_google_application {
            margin-top: 30px;
        }
        
        .mobile_and_application {
            display: flex;
            gap: 50px;
            align-items: center;
        }
        
        .mobile_border {
            background: rgba(41, 48, 69, 0.9);
            border-radius: 50px 50px 0px 0px;
            max-width: 600px;
            padding: 20px 20px 0px 20px;
        }
        
        .download_application {
            margin-top: 80px;
            margin-left: 40px;
            font-weight: 700;
            font-size: 24px;
            line-height: 150%;
            /* identical to box height, or 36px */
            text-transform: capitalize;
            color: #222739;
            font-family: 'NunitoSans-Bold';
            text-align: center;
        }
        
        .google_play,
        .apple_play {
            width: 100%;
            border-radius: 8px;
            padding: 5px 50px;
            /* cursor: pointer; */
                /* background: #000000; */
        }
        
        .google_play img,
        .apple_play img{
            margin: auto;
        }
        
        .download_btn {
            display: flex;
            gap: 30px;
            align-items: center;
            margin-left: 40px;
            margin-top: 30px;
        }
        
        .mobile_time {
            font-family: 'SF Pro Text';
            font-style: normal;
            font-weight: 600;
            font-size: 17.875px;
            line-height: 25px;
            text-align: center;
            letter-spacing: -0.3575px;
            color: #FFFFFF;
        }
        
        .inner_mobile {
            background: #222739;
            border-radius: 30px 30px 0px 0px;
            padding: 10px 10px 0px 10px;
        }
        
        .mobile_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
        }
        
        .mobile_battery_side {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        .application ul {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        
        .pure_gold {
            height: 400px;
            overflow-y: scroll;
        }
        
        
        
        @media screen and (max-width:767px) {
            .mobile_and_application {
                display: flex;
                flex-wrap: wrap;
            }
        
            .download_application {
                margin-top: 10px;
                margin-left: 10px;
            }
        
            .download_btn {
                display: flex;
                gap: 50px;
                align-items: center;
                margin: 20px;
            }
        
            .google_play,
            .apple_play {
                width: 100%;
                /* background: #000000; */
                border-radius: 8px;
                padding:0px;
            } `}</style>
    </div>
  );
};

export default DownloadApplication;
