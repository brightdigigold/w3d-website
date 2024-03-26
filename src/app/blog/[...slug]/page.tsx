'use client'
import BlogDetailsById from '@/components/sanity/showBlogsDetails';
import { client } from '@/utils/sanityClient';
import React, { useEffect, useState } from 'react';

// Assuming the type definition for a post
interface Post {
  title: string;
  slug: {
    current: string;
  };
  mainImage: {
    asset: {
      url: string;
    };
  };
  author: {
    name: string;
    image: {
      asset: {
        url: string;
      };
    };
  };
  publishedAt: string;
  body: any; // Adjust based on your body content type
}

const Page = ({ params: { slug } }: { params: { slug: string[] } }) => {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      // Ensure to use the first item of the slug array
      const query = `*[_type == "post" && slug.current == $slug][0]{
        title,
        "slug": slug.current,
        "mainImage": {
          "asset": {
            "url": true
          }
        },
        "author": {
          "name": true,
          "image": {
            "asset": {
              "url": true
            }
          }
        },
        publishedAt,
        body
      }`;
      const params = { slug: slug[0] }; // Using the first element of the slug array
      const data = await client.fetch(query, params);
      setPost(data);
    };

    fetchPost();
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  console.log('post 65===>', post);

  return (
    <div className='mt-20 text-white'>
      <h1>{post.title}</h1>
       <div>
        <BlogDetailsById portableTextContent={post.body} />
    </div>
    </div>
  );
};

export default Page;
