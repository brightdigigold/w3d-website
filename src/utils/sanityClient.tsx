import { createClient } from '@sanity/client'

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
    dataset: "production" as string,
    apiVersion: '2024-03-25',
    useCdn: true,
})
