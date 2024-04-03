'use client'
import { getBlogPosts } from '@/components/sanity/getPost';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Post {
  categories: { title: string }[];
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    getBlogPosts().then(setPosts);
  }, []);

  // Extract a list of unique categories
  const categories = Array.from(new Set(posts.flatMap(post => post.categories.map(category => category.title))));

  // Filter posts based on the selected category
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.categories.some(category => category.title === selectedCategory))
    : posts;

  return (
    <div className='container'>
      <h1 className='mt-24 text-yellow-400 text-center extrabold text-3xl sm:text-5xl'>Blogs</h1>
      {/* Category Selector */}
      <div className='flex px-8 m-2 items-center '>
        <p className='text-white text-sm md:text-lg m-2 text-center'>Select Category</p>
        <select value={selectedCategory || ''} onChange={(e) => setSelectedCategory(e.target.value || null)} className="cursor-pointer text-white rounded bg-themeDarkBlue px-2 mx-4 py-2 w-auto focus:outline-none">
          <option value="">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className='px-4 sm:px-6 md:px-8 lg:px-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 xl:gap-16 my-6'>
          {filteredPosts.map(post => (
            <Link key={post.slug.current} href={`/blog/${post.slug.current}`} passHref>
              <div className='bg-header rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg'>
                {post.thumbImage && (
                  <Image src={post.thumbImage.asset.url} alt={post.title} className="inline-block" width={700} height={700} priority />
                )}
                <h3 className='text-white py-2 text-sm md:text-lg text-center'>{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogPosts;
