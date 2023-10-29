import React, { useEffect, useRef } from 'react';
// import Button from '../button/Button';
// import CloseIcon from '../CloseIcon';
import styles from './modal.module.css';
import { log } from "./logger";
import {
    FacebookShareButton,
    FacebookIcon,
    EmailShareButton,
    EmailIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
} from 'next-share';
const SocialMediaShare = ({ modalStyle, url, show, onClose, backdropStyle }) => {
    
    const modalRef = useRef(null);
    useEffect(
        () => {
            if (show) {
                modalRef.current.classList.add(styles.visible);
            }
            else {
                modalRef.current.classList.remove(styles.visible);
            }
        }, [show]);
    return (
        <React.Fragment>
            <div onClick={onClose} ref={modalRef} style={backdropStyle} className={`${styles.modal__wrap}`}>
                <buton
                    onClick={onClose}
                    style={{ width: 60, height: 40, position: 'absolute', top: 0, right: 0, margin: '1rem' }}
                    className={styles.close__btn}
                >
                    <button height="20px" width="20px" className={styles.close__icon} />
                </buton>
                <div style={modalStyle} className={styles.modal}>
                    <h1 className='text-white'>Social Share</h1>
                    <div className='social'>
                        <FacebookShareButton
                            url={url} >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>

                        <EmailShareButton
                            url={url} >
                            <EmailIcon size={32} round />
                        </EmailShareButton>

                        <TwitterShareButton
                            url={url} >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>

                        <WhatsappShareButton
                            url={url} >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>

                        <LinkedinShareButton
                            url={url} >
                            <LinkedinIcon size={32} round />
                        </LinkedinShareButton>
                    </div>
                </div>
            </div>
            <style>{`
            .modal_modal__OcmYl{
                min-height:230px !important;
                max-height:230px !important;
                max-width: 400px;
            }
            .modal_visible__N2VK_ .modal_modal__OcmYl{
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                flex-direction: column;
                overflow: hidden;

            }
            .share-container{
                display:flex;
                justify-content:center;
                align-items:center;

            }
             .social{
                 display:flex;
                 justify-content:space-between;
                 align-items:center;
                 width:70%;
             }
            `}</style>
        </React.Fragment>
    );
};

export default SocialMediaShare;