// import PortableText from "react-portable-text";
import React, { ElementType } from 'react';
import SanityBlockContent from "@sanity/block-content-to-react"

interface BlockSpan {
  _key: string;
  _type: string;
  text: string;
  marks?: string[];
}

interface Block {
  _key: string;
  _type: 'block' | string;
  children: BlockSpan[];
  markDefs?: any[];
  style: string;
}

interface PortableTextProps {
  content: BlockContent;
  serializers?: SerializerComponents;
}
interface SerializerComponents {
  [key: string]: ElementType<any>;
}

const defaultSerializers = SanityBlockContent.defaultSerializers

const customSerializers = {
  marks: {
    link: ({ mark, children }: { mark: any; children: React.ReactNode }) => (
      <a href={mark.href} className='text-blue-600'>
        {children}
      </a>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className='bold'>
        {children}
      </strong>
    ),
  },
  block: (props: any) => {
    if (props.node.style === 'h4') {
      return <h4 className='text-yellow-400 text-lg mt-3 bold'>{props.children}</h4>;
    }
    return defaultSerializers.types.block(props);
  },
};

const PortableText: React.FC<PortableTextProps> = ({ content, ...additionalOptions }) => {

  return (
    <SanityBlockContent
      blocks={content}
      serializers={customSerializers}
      {...additionalOptions}
    />
  );
};

export default PortableText;



/**
 * Converts portable text block content to a plain text string without formatting.
 *
 * @param {[Object]} [blocks=[]] Portable text blocks
 */

interface Block {
  _key: string;
  _type: 'block' | string;
  children: BlockSpan[];
  markDefs?: any[]; // Adjust according to your needs
  style: string; // For example: "h1", "h2", "normal", etc.
}
// If you have other block types, you can extend this union type
type BlockContent = Block; // Extend this with other types as needed, e.g., `| ImageBlock | VideoBlock`

export const blockContentToPlainText = (blocks: BlockContent[] = []) =>
  blocks
    .map((block) =>
      block._type === "block" && block.children
        ? block.children.map((span) => span.text).join("")
        : ""
    )
    .join("\n\n");


// Assuming you have a custom component for someCustomType
// const CustomComponent = ({ children }) => (
//   <div className="custom-component">{children}</div>
// );

// const BlogDetailsById = ({ portableTextContent }) => (
//   <div>
//     <PortableText
//       content={portableTextContent}
//       serializers={{
//         h4: ({ children }) => <h4 className=" bold py-3 text-2xl">{children}</h4>,
//         strong: ({ children }) => <strong className="bold">{children}</strong>,
//         someCustomType: CustomComponent, // Use your actual custom type name here
//         // Add more custom serializers as needed
//       }}
//     />
//   </div>
// );

// export default BlogDetailsById;