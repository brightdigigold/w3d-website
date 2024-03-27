"use client"
import NextImage from '@/components/nextImage';
import { getBlogPosts } from '@/components/sanity/getPost';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Post {
  slug: {
    _type: string;
    current: string;
  };
  thumbImage: {
    asset: {
      url: string;
    };
  };
  title: string;
}

function BlogPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getBlogPosts().then(setPosts);
  }, []);

  console.log('posts', posts);

  return (
    <div>
      <h1 className='mt-24 text-yellow-400 text-center bold text-3xl sm:text-4xl'>Blogs</h1>
      <div className='px-4 sm:px-6 md:px-8 lg:px-10'>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 xl:gap-16 my-6'>
          {posts.map(post => (
            <Link key={post.slug.current} href={`/blog/${post.slug.current}`} passHref className='bg-slate-500 rounded-lg overflow-hidden hover:bg-slate-600 transition-colors'>
              <div>
                {post.thumbImage && (
                    <NextImage src={post.thumbImage.asset.url} alt={post.title} className="inline-block" width={700} height={700} />

                  // <img src={post.thumbImage.asset.url} alt={post.title} className='w-full h-auto' />
                )}
                <h2 className='text-white py-2 text-lg text-center'>{post.title}</h2>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogPosts;
