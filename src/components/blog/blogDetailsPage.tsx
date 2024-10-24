'use client';
import PortableText from '@/components/sanity/showBlogsDetails';
import BlogDetailsById from '@/components/sanity/showBlogsDetails';
import  { client, } from '@/utils/sanityClient';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import OtpModal from '../modals/otpModal';

interface BlockSpan {
    _key: string;
    _type: string;
    marks: string[];
    text: string;
}

interface Block {
    _key: string;
    _type: string;
    children: BlockSpan[];
    markDefs: any[];
    style: string;
}

type BlockContent = Block[];

interface PostDisplayDetails {
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
    metaDescription: string;
    body: BlockContent;
}

interface RelatedPost {
    title: string;
    slug: {
        current: string;
    };
    thumbImage: {
        asset: {
            url: string;
        };
    };
}

const PostDisplay = ({ slug }) => {
    const otpModal = useSelector((state: RootState) => state.auth.otpModal);
    const [post, setPost] = useState<PostDisplayDetails | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

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
            // console.log("Fetched post data:", JSON.stringify(data, null, 2));
            setPost(data);
        };

        const fetchRelatedPosts = async () => {
            const query = `*[_type == "post"]{
                title,
                slug,
                thumbImage{
                    asset->{
                        url
                    }
                }
            }`;
            const data = await client.fetch(query);
            const shuffledPosts = data.sort(() => 0.5 - Math.random());
            setRelatedPosts(shuffledPosts.slice(0, 10));
        };

        fetchPost();
        fetchRelatedPosts();
    }, [slug]);

    if (!post) return <div>No post data</div>;

    return (
        <div className="mt-28 text-white container mx-auto px-4">
            {otpModal && <OtpModal />}
            <div className="lg:flex lg:gap-8">
                {/* Main Content */}
                <div className="lg:flex-1">
                    <h1 className="text-3xl text-center m-8">{post.title}</h1>
                    <img src={post.mainImage.asset.url} alt={post.title} className="inline-block w-full h-auto" />
                    <div className="grid grid-cols-2 py-5">
                        <div className="flex items-center">
                            <Image src={post.author.image.asset.url} alt={post.author.name} width={50} height={20} priority />
                            <div className="ml-3">{post.author.name}</div>
                        </div>
                        <div className="flex justify-end text-gray-400">
                            {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                    </div>
                    <div className='w-full sm:grid sm:grid-cols-6 gap-10'>
                        <div className='col-span-4'>
                            <div className="text-justify pb-4 text-xl poppins-medium prose prose-bold:mb-10 text-white">
                                {post.body && post.body.map((block, index) =>
                                    <PortableText key={index} content={block} />
                                )}
                            </div>
                        </div>
                        <div className='col-span-2'>
                            {/* Related Articles Section */}
                            <div className="sticky top-16">
                                <h2 className="text-2xl bold mx-4 text-center sm:mt-6">Read More Articles</h2>
                                <div>
                                    {relatedPosts.map((relatedPost, index) => (
                                        <Link key={index} href={`/digital-gold-blog/${relatedPost.slug.current}`} passHref>
                                            <div className="flex space-x-4  cursor-pointer py-3">
                                                <Image
                                                    src={relatedPost.thumbImage?.asset?.url}
                                                    alt={relatedPost.title}
                                                    width={160}
                                                    height={60}
                                                    className="rounded"
                                                />
                                                <p className="text-md text-white text-lg">{relatedPost.title}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDisplay;

