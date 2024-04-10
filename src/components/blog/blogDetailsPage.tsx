'use client'
import NextImage from '@/components/nextImage';
import BlogDetailsById from '@/components/sanity/showBlogsDetails';
import { client } from '@/utils/sanityClient';
import { useEffect, useState } from 'react';

const PostDisplay = ({ slug }) => {
    const [post, setPost] = useState<any>();

    useEffect(() => {
        const fetchPost = async () => {
            const query = `*[_type == "post" && slug.current == $slug][0]{
        title,
        metaDescription,
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

    console.log('post request', post)
    if (!post) return <div>No post data</div>;

    return (
        <div className='mt-28 text-white container'>
            <h1 className='text-3xl text-center m-8'>{post.title}</h1>
            <NextImage src={post.mainImage.asset.url} alt={post.title} className="inline-block w-full h-auto" style={{ width: "auto", height: "auto" }} width={1} height={1} priority />
            <div className='grid grid-cols-2 py-5'>
                <div className='flex items-center'>
                    <NextImage src={post.author.image.asset.url} alt={post.author.name} className="inline-block" style={{ width: "full", height: "auto" }} width={50} height={20} priority />
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

export default PostDisplay;

