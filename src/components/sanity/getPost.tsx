// Define TypeScript interfaces to describe the shape of your data

import { client } from "@/utils/sanityClient";
import { SanityClient } from "@sanity/client";

interface PostAsset {
  url: string;
}

interface PostThumbImage {
  asset: PostAsset;
}

interface PostSlug {
  _type: string;
  current: string;
}

interface categories {
  title: string;
}

interface BlogPost {
  categories: categories [];
  metaDescription: string;
  title: string;
  slug: PostSlug;
  thumbImage: PostThumbImage;
}

// Update the getBlogPosts function signature to reflect its return type
export async function getBlogPosts(): Promise<BlogPost[]> {
  const query = '*[_type == "post"] | order(publishedAt desc) {title,metaDescription,categories[]->{title},slug,thumbImage{asset->{url}}}';
  const posts: BlogPost[] = await client.fetch(query);
  return posts;
}
export async function getPrivacyPosts() {
  const query = '*[_type=="policy"&& slug.current=="privacy-policy"][0]{body}';
  const posts = await client.fetch(query);
  return posts;
}

export async function getShippingPosts() {
  const query = '*[_type=="policy"&& slug.current=="shipping-policy"][0]{body}';
  const posts = await client.fetch(query);
  return posts;
}
export async function gettermsPosts() {
  const query = '*[_type=="policy"&& slug.current=="terms-and-conditions"][0]{body}';
  const posts = await client.fetch(query);
  return posts;
}
export async function getrefundsPosts() {
  const query = '*[_type=="policy"&& slug.current=="refund-and-cancellation"][0]{body}';
  const posts = await client.fetch(query);
  return posts;
}




