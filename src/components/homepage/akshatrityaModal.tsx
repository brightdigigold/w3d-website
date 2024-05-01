import { Fragment, useState,useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
// import {} from  ''

export default function AkshayTrityaOffer({ }: any) {
    const [open, setOpen] = useState(true);

    const videoRef: any = useRef(null);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            // videoRef.current.pause();
            videoRef.current.play();

            // videoRef.current.currentTime = 0;  // Optionally, rewind the video
            // videoRef.current.play();  // Continue playing muted
        }
    };

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = open ? 'hidden' : originalOverflow;
        return () => {
            document.body.style.overflow = originalOverflow; // Restore on cleanup
        };
    }, [open]);


    useEffect(() => {
        if (open) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [open]);
    
    


    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="z-[110] fixed inset-0 overflow-y-auto" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0  bg-black bg-opacity-50 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-[50] w-screen overflow-y-auto">
                    <div className="flex min-h-full z-[50] items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg  text-left  transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-8">
                                <div  onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    >
                                    <video ref={videoRef} width="320" height="300" preload="none" autoPlay loop muted >
                                        <source src="/video/Free Coin.webM" type="video/webm" />
                                        <track
                                            src="/path/to/subtitles.vtt"
                                            kind="subtitles"
                                            srcLang="en"
                                            label="English"
                                        />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>

                                <div className="">
                                    <Link href={`/coins/folder/${'GOLD'}`}>
                                        <button
                                            type="button"
                                            className="bg-themeDarkBlue text-themeBlueLight bold text-md inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm  text-bg-theme shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
                                        >
                                            Avail This Offer
                                        </button>
                                    </Link>
                                </div>
                            </Dialog.Panel>

                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}