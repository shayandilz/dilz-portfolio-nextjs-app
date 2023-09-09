import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Layout from '@/src/components/layout';
import {fetchCommonData, fetchPostData} from '@/src/utils/fetchData';
import TransitionEffect from "@/src/components/TransitionEffect";
import Link from "next/link";
import {useRouter} from "next/router";


const Post = ({favicon, headerFooter, post }) => {
    const router = useRouter();
    // Extract headings from post content
    const headings = extractHeadings(post.content);
    // Add IDs to headings
    const contentWithIds = addHeadingIds(post.content);
    const [relatedPosts, setRelatedPosts] = useState([]);
    useEffect(() => {
        fetchRelatedPosts(post.categories[0]['term_id'], post.slug).then((posts) => {
            setRelatedPosts(posts);
        });
    }, [post.categories[0]['term_id'], post.slug]);
    if ( router.isFallback ) {
        return <div>Loading...</div>;
    }
    return (
        <Layout
            headerIcon={headerFooter.global.icon.site_logo}
            favicon={favicon.global.icon}
            headerFooter={headerFooter.global.menu || {}}
            socialAccounts={headerFooter.global.social || {}}
            siteTitle={post.title}
            metaData={post.yoast_meta}
        >
            <TransitionEffect/>
            <div className="w-full py-16 flex flex-col items-center">
                <h1 className="text-5xl md:text-3xl font-bold mb-8 text-center text-dark dark:text-light">{post.title}</h1>
                <Image
                    src={post.media.thumbnail}
                    alt={post.media.alt}
                    title={post.media.alt}
                    width={800}
                    height={500}
                    objectFit="cover"
                    className={'rounded-lg'}
                />
                {/* Generate Table of Contents */}
                {headings.length > 0 && (
                    <div className="mt-8 table-of-contents">
                        <fieldset className={'text-center border border-dark dark:border-light px-5 pb-2 rounded-lg'}>
                            <legend className={'font-bold px-2 text-lg text-dark dark:text-light'}>Table of Contents</legend>
                            <ul className={'text-start'}>
                                {headings.map((heading, index) => (
                                    <li className={'py-[6px] dark:text-light text-dark hover:underline transition duration-150 ease-in-out'} key={index}>
                                        <a rel={'nofollow'} href={`#heading-${index}`}>{heading.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </fieldset>
                    </div>
                )}
                <div className="mt-8 post-content prose max-w-4xl text-justify dark:text-light" dangerouslySetInnerHTML={{ __html: contentWithIds }} />
                <p className="mt-4 text-sm text-gray-600 dark:text-light">Published on: {post.date}</p>
                {/* Render Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-8 max-w-4xl pt-8 border-t-2 border-dark">
                        <h5 className={'text-center pb-8 text-2xl font-bold dark:text-light'}>Related Posts</h5>
                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                            {relatedPosts.map((relatedPost) => (
                                <div key={relatedPost.slug} className="flex flex-col justify-between bg-light dark:bg-dark border border-solid border-dark dark:border-light dark:text-light rounded-2xl p-3">
                                    <Image
                                        src={relatedPost.media.thumbnail}
                                        alt={relatedPost.media.alt}
                                        title={relatedPost.media.alt}
                                        width={800}
                                        height={500}
                                        objectFit="cover"
                                        className={'rounded-lg'}
                                    />
                                    <h3 className="text-lg font-semibold py-2">{relatedPost.title}</h3>
                                    <p className="text-sm dark:text-light text-gray-600" dangerouslySetInnerHTML={{ __html: relatedPost.excerpt }} />
                                    <Link href={`/articles/${relatedPost.slug}`} className="dark:text-primaryDark text-primary hover:underline">
                                        Read more
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
// Helper function to fetch related posts based on category
async function fetchRelatedPosts(category, currentPostSlug) {
    const initialPosts = await fetchPostData();
    const relatedPosts = initialPosts.posts.filter((post) => post.categories[0]['term_id'] === category && post.slug !== currentPostSlug);
    return relatedPosts.slice(0, 2); // You can adjust the number of related posts to display
}

// Helper function to extract headings
function extractHeadings(content) {
    const headings = [];
    const headingMatches = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-3]>/gi);

    if (headingMatches) {
        headingMatches.forEach((match, index) => {
            const text = match.replace(/<\/?h\d[^>]*>/g, ''); // Extract text from heading
            headings.push({ index, text });
        });
    }

    return headings;
}

// Helper function to add unique IDs to headings
function addHeadingIds(content) {
    let index = 0;
    return content.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, (match) => {
        index++;
        return match.replace(/<h([1-6])([^>]*)>/i, `<h$1$2 id="heading-${index}" class="anchor dark:text-light text-dark mb-[5px]">`);
    });
}

export async function getStaticProps({ params }) {
    const data = await fetchCommonData();
    const page = 1;
    const perPage = -1;
    const initialPosts = await fetchPostData(page, perPage);
    const post = initialPosts.posts.find((post) => post.slug === params.postSlug);

    return {
        props: {
            favicon: data ?? {},
            headerFooter: data ?? {},
            post,
        },
        revalidate: 10,
    };
}
export async function getStaticPaths() {
    const page = 1;
    const perPage = -1;
    const initialPosts = await fetchPostData(page, perPage);
    const paths = initialPosts.posts.map((post) => ({
        params: { postSlug: post.slug },
    }));

    return {
        paths,
        fallback: 'blocking'
    };
}



export default Post;
