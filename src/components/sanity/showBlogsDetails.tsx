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
        h4: ({ children }) => <h1 style={{ color: "red" }}>{children}</h1>,
        li: ({ children }) => <li className="">{children}</li>,
        someCustomType: CustomComponent, // Use your actual custom type name here
        // Add more custom serializers as needed
      }}
    />
  </div>
);

export default BlogDetailsById;
