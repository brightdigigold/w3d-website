import React from 'react'
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface nextImage {
    sizes?: string;
    alt: string;
    src: string | StaticImport;
    height?: number;
    width?: number;
    priority?: boolean;
    className?: string;
    fill?: boolean;
    style?: {};
    placeholder?: "blur" | "empty" | `data:image/${string}`;
}

const NextImage = ({ sizes, alt, src, height, width, priority, className, fill, style, placeholder }: nextImage) => {
    return (
        <Image
            className={`${className}`}
            sizes={sizes}
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            fill={fill}
            style={style}
            placeholder={placeholder}
        />
    )
}

export default NextImage;