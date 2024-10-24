import { createClient } from '@sanity/client';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import createImageUrlBuilder from "@sanity/image-url";

// Initialize Sanity Client
export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
    dataset: 'production',
    apiVersion: '2024-03-25',
    useCdn: true,
});

// Create Image URL Builder
const imageBuilder = createImageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
    dataset: 'production',
  });
  
  export const urlForImage = (source: SanityImageSource) => {
    return imageBuilder?.image(source).auto("format").fit("max").url();
  };
