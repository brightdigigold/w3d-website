import PortableText from "react-portable-text";
import React from 'react';

// Assuming you have a custom component for someCustomType
const CustomComponent = ({ children }) => (
  <div className="custom-component">{children}</div>
);

const BlogDetailsById = ({ portableTextContent }) => (
  <div>
    <PortableText
      content={portableTextContent}
      serializers={{
        h4: ({ children }) => <h4 className=" bold py-3 text-2xl">{children}</h4>,
        p: ({ children }) => <p className="m-3 prose bg-black-600">{children}</p>,
        section: ({ children }) => <section className="bg-yellow-600">{children}</section>,
        article: ({ children }) => <article className="bg-green-600">{children}</article>,
        span: ({ children }) => <span className="bg-red-700">{children}</span>,
        ul: ({ children }) => <ul className="m-3">{children}</ul>,
        ol: ({ children }) => <ol className="m-3">{children}</ol>,
        li: ({ children }) => <li className="m-3">{children}</li>,
        strong: ({ children }) => <strong className="bold">{children}</strong>,
        someCustomType: CustomComponent, // Use your actual custom type name here
        // Add more custom serializers as needed
      }}
    />
  </div>
);

export default BlogDetailsById;
