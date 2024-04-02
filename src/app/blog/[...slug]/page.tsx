'use client'
import NextImage from '@/components/nextImage';
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
          mainImage{
            asset->{
              url
            }
          },
          author->{
            name,
            image{
              asset->{
                url
              }
            }
          },
          publishedAt,
          body
        }`;
      const params = { slug: slug[0] };
      const data = await client.fetch(query, params);
      setPost(data);
    };

    fetchPost();
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className='mt-20 text-white container'>
      <h1 className='text-3xl text-center '>{post.title}</h1>
      <NextImage src={post.mainImage.asset.url} alt={post.title} className="inline-block w-full h-auto" style={{ width: "auto", height: "auto"}} width={1} height={1} priority />
      <div className='grid grid-cols-2 py-5'>
        <div className='flex  items-center'>
          <div className=''><NextImage src={post.author.image.asset.url} alt={post.title} className="inline-block" style={{ width: "full", height: "auto"}} width={50} height={20} priority /></div>
          <div className='ml-3'>{post.author.name}</div>
        </div>
        <div className='flex justify-end text-gray-400'>
          {new Date(post.publishedAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
      <div>
        <BlogDetailsById portableTextContent={post.body} />
      </div>
    </div>
  );
};

export default Page;
