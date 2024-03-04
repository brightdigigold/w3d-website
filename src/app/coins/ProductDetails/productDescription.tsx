import React, { memo } from 'react'

const ProductDescription = ({description, weight, purity, dimension, quality}) => {
    console.log('re render from details')

    return (
        <div className="bg-themeLight px-4 py-4 rounded-md mt-4">
            <p className="text-sm">{description}</p>
            <div className="grid grid-cols-4 mt-4">
                <div className=" text-center px-2">
                    <img
                        src={"/24K guaranteed .png"}
                        alt="icons"
                        className="mx-auto mb-2 h-12 sm:h-20"
                    />
                    <p className="font-8x sm:text-base">
                        24K Guaranteed <br /> Quality Certified
                    </p>
                </div>
                <div className="text-center px-2">
                    <img
                        src={"/Free Insurance.png"}
                        alt="icons"
                        className="mx-auto mb-2  h-12 sm:h-20"
                    />
                    <p className="font-8x sm:text-base">
                        Free Insurance <br /> on Delivery
                    </p>
                </div>
                <div className="text-center px-2">
                    <img
                        src={"/order tracking support.png"}
                        alt="icons"
                        className="mx-auto mb-2   h-12 sm:h-20"
                    />
                    <p className="font-8x sm:text-base">
                        Order Tracking &<br />
                        Support
                    </p>
                </div>
                <div className="text-center px-2">
                    <img
                        src={"/zero negative.png"}
                        alt="icons"
                        className="mx-auto mb-2 h-12 sm:h-20"
                    />
                    <p className="font-8x sm:text-base">
                        Zero negative <br /> weight tolerance
                    </p>
                </div>
            </div>
            <div className="mt-6">
                <table>
                    <tbody>
                        <tr>
                            <td className="w-32 inline-block">Weight </td>
                            <td className="pl-2 bold">
                                {weight} Gm
                            </td>
                        </tr>
                        <tr>
                            <td className="w-32 inline-block">Metal Purity</td>
                            <td className="pl-2">{purity}</td>
                        </tr>
                        <tr>
                            <td className="w-32 inline-block">Dimension</td>
                            <td className="pl-2">{dimension}</td>
                        </tr>
                        <tr>
                            <td className="w-32 inline-block">Quality</td>
                            <td className="pl-2">{quality}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default memo(ProductDescription)