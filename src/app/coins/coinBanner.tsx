import React from 'react'
import Image from 'next/image'

const CoinBanner = () => {
    return (
        <div className='flex bg-[#C8E9F2] justify-between mx-auto '>
            <div className='w-1/4  mt-24 lg:mt-12'>
                <Image
                    src="/gaytri.png"
                    alt="gold and silver coin banner"
                    className="rounded-b md:mt-4 ml-10 "
                    width={476}
                    height={456}
                    layout="intrinsic"
                    priority={true}
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            </div>
            <div className="grid place-items-center">
                <div className="mt-48">
                    <div className="text-black text-center pt-1 poppins-bold">
                        <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl fade-in-up">
                            GET FREE DELIVERY
                        </p>
                    </div>
                    <p className="text-black text-center pt-1 poppins-semibold text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl fade-in-up">
                        of Gold and Silver Coins
                    </p>
                    <p className="text-black text-center pt-1 poppins-semibold text-xl sm:text-sm md:text-md lg:text-xl xl:text-2xl 2xl:text-3xl fade-in-up">
                        at your Doorstep
                    </p>
                </div>
            </div>

            <img
                src="/Coins stand (1).png"
                alt="gold and silver coin banner"
                className="rounded-b mt-52 h-2/6 w-2/6 mr-6"
            />
        </div>
    )
}

export default CoinBanner