import { Fragment, useState, useRef } from 'react';
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


    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0   transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="scroll-smooth focus:scroll-auto flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="  relative transform overflow-hidden rounded-lg  px-4 pb-4 pt-5 text-left  transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-8">
                                <div  onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    >
                                    <video ref={videoRef} width="320" height="240" preload="none" autoPlay loop muted >
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
                                            // style={{
                                            //     background: 'linear-gradient(to right, #f83b0d, #fbb273, #fbc844)'
                                            // }}
                                            className="bg-themeBlue inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-bg-theme shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
                                        >
                                            Avail The Offer
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
