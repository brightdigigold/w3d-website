// Define TypeScript interfaces to describe the shape of your data

import { client } from "@/utils/sanityClient";

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
  title: string;
  slug: PostSlug;
  thumbImage: PostThumbImage;
}

// Update the getBlogPosts function signature to reflect its return type
export async function getBlogPosts(): Promise<BlogPost[]> {
  const query = '*[_type == "post"] | order(publishedAt desc) {title,categories[]->{title},slug,thumbImage{asset->{url}}}';
  const posts: BlogPost[] = await client.fetch(query);
  return posts;
}
