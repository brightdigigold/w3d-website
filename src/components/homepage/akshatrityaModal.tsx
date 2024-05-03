import { Fragment, useState, useEffect, useRef } from 'react';
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
            document.body.style.overflow = originalOverflow;
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
            <Dialog as="div" className="fixed inset-0 overflow-y-auto z-50" onClose={setOpen}>
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
                            <Dialog.Panel className="relative w-full max-w-md px-4 py-8  rounded-lg shadow-lg transform transition-all sm:max-w-xs">
                                <div className='relative'>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="absolute top-0 right-0 p-2 text-black bg-white  rounded-full border-2 border-white"
                                        aria-label="Close"
                                        style={{ zIndex: 20, width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: 'white' }}
                                    >
                                        x
                                    </button>
                                    <div onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <video ref={videoRef} width="100%"
                                            height="auto" preload="none" autoPlay loop muted playsInline>
                                            <source src="https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/free_coin.mp4" type="video/mp4" />
                                            <track
                                                src="/path/to/subtitles.vtt"
                                                kind="subtitles"
                                                srcLang="en"
                                                label="English"
                                            />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>

                                <div className="">
                                    <Link href={`/coins/akshayaTritiya/${'GOLD'}`}>
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