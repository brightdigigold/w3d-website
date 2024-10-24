import React from 'react';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlForImage } from '@/utils/sanityClient';
// import urlForImage from '@/utils/sanityClient';

const customComponents = {
  types: {
    image: ({ value }: any) => {
      const imageUrl = urlForImage(value.asset._ref);
      return (
        <Image
          src={urlForImage(value)}
          alt="blog image"
          width={700}
          height={700}
        // className="w-auto h-auto object-cover object-center mt-2 mb-1"
        />
      );
    },
  },
  marks: {
    link: ({ value, children }: any) => (
      <a href={value.href} className="text-blue-500 bold">
        {children}
      </a>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="bold mb-5 text-white">{children}</strong>
    ),
    list: (props: any) => {
      return <ul className="list-disc pl-3 p-1">{props.children}</ul>;
    },
    listItem: (props: any) => {
      return <li className=" text-lg">{props.children}</li>;
    },
  },
  block: {
    // Add support for different HTML block elements
    h4: ({ children }: any) => (
      <h4 className="text-yellow-400 poppins-semibold tracking-wide text-xl sm:text-2xl mt-3">
        {children}
      </h4>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-yellow-500 text-lg sm:text-xl bold mt-5">{children}</h3>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-yellow-600 text-md font-bold sm:text-lg mt-6">{children}</h2>
    ),
    normal: ({ children }: any) => (
      <p className="text-lg text-gray-100 my-4 leading-7">{children}</p>
    ),
  },
};

export default function BlogContent({ content }) {
  return (
    <PortableText value={content} components={customComponents} />
  );
}
