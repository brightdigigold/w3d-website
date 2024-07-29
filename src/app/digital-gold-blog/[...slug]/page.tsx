import React from 'react';
import { client } from '@/utils/sanityClient';
import PostDisplay from '@/components/blog/blogDetailsPage';

export async function generateMetadata({ params: { slug } }: { params: { slug: string[] } }) {
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
  return {
    title: data.title,
    description: data.metaDescription,
  }
}


export default async function BlogPostPage({ params: { slug } }: { params: { slug: string[] } }) {
  return <PostDisplay slug={slug} />;
}