import React, {useRef, useState} from 'react';
import AnimatedText from "../../components/AnimatedText";
import Link from "next/link";
import Image from "next/image";
import {motion, useMotionValue} from "framer-motion";
import TransitionEffect from "../../components/TransitionEffect";
import Layout from "@/src/components/layout";
import {fetchCommonData, fetchPostData} from "@/src/utils/fetchData";
import LoadMore from "@/src/components/loadMore";
import {isBoolean} from "lodash";


const FramerImage = motion(Image);

const MovingImg = ({img, title, link, width, height}) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0)
    const imgRef = useRef(null)

    function handleMouse(event) {
        imgRef.current.style.display = 'inline-block';
        x.set(event.pageX)
        y.set(-10)
    }

    function handleMouseLeave(event) {
        imgRef.current.style.display = 'none';
        x.set(0)
        y.set(0)
    }

    return (
        <Link
            href={link}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
        >
            <h2 className={'capitalize text-xl font-semibold hover:underline'}>{title}</h2>
            <FramerImage
                width={width}
                height={height}
                initial={{opacity: 0}}
                whileInView={{opacity: 1, transition: {duration: 0.2}}}
                style={{x: x, y: y}}
                ref={imgRef}
                src={img}
                alt={title} className={'z-10 w-96 absolute h-auto hidden rounded-lg md:!hidden'}/>
        </Link>
    )
}

const Article = ({img, title, date, link, id, width, height}) => {
    return (
        <motion.li
            key={id}
            initial={{y: 10}}
            whileInView={{y: 0, transition: {duration: 0.5, ease: 'easeInOut'}}}
            viewport={{once: true}}
            className={'relative w-full p-4 py-6 my-4 rounded-xl flex items-center justify-between bg-light dark:bg-dark text-dark dark:text-light first:mt-0 border border-solid border-dark dark:border-light border-r-4 border-b-4 sm:flex-col'}>
            <MovingImg width={width} height={height} title={title} img={img} link={link}/>
            <span
                className={'text-primary dark:text-primaryDark font-semibold pl-4 sm:self-start sm:pl-0 xs:text-sm'}>{date}</span>
        </motion.li>
    )
}
const FeaturedArticle = ({title, time, img, link, summary, id, width, height, alt}) => {
    return (
        <li key={id}
            className={'col-span-1 w-full p-4 bg-light dark:bg-dark border border-solid border-dark dark:border-light dark:text-light rounded-2xl relative'}>
            <div
                className='absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2.5rem] bg-dark dark:bg-light rounded-br-3xl'/>
            <Link href={link}
                  className={'w-full cursor-pointer overflow-hidden rounded-lg inline-block'}>
                <FramerImage
                    src={img}
                    alt={alt}
                    title={alt}
                    className={'w-full h-auto'}
                    whileHover={{scale: 1.05}}
                    transition={{duration: 0.2}}
                    width={width}
                    height={height}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
            </Link>
            <Link href={link}>
                <h2 className="capitalize text-2xl font-bold my-2 mt-4 xs:text-lg">
                    {title}
                </h2>
                <p className={'text-sm mb-2 text-justify'} dangerouslySetInnerHTML={{ __html: summary }} />

                <span className={'text-primary font-semibold'}>{time}</span>
            </Link>
        </li>
    )
}

const Articles = ({favicon, headerFooter, allPosts, meta}) => {
    // Offset value to exclude the first two posts from featured articles
    const [hasNextPage, setNextPage] = useState(allPosts.pagination['hasNextPage'])
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [loadedPosts, setLoadedPosts] = useState(allPosts.posts);

    const loadMorePosts = async () => {
        setLoading(true); // Set loading state to true before fetching
        const nextPage = page + 1;
        const newPosts = await fetchPostData(nextPage);
        setNextPage(newPosts.pagination['hasNextPage'])

        setPage(nextPage);
        setLoadedPosts([...loadedPosts, ...newPosts.posts]);

        setLoading(false); // Set loading state back to false after fetching
    };

    const offset = 2;
    const featuredPosts = loadedPosts.slice(0, 2);
    const regularPosts = loadedPosts.slice(2);

    return (
        <Layout

            headerIcon={headerFooter.global.icon.site_logo}
            favicon={favicon.global.icon}
            headerFooter={headerFooter.global.menu || {}}
            socialAccounts={headerFooter.global.social || {}}
            metaData={meta}
        >
            <TransitionEffect/>
            <div className={'w-full mb-16 flex flex-col items-center justify-center min-h-screen'}>
                <section className={'pt-16'}>
                    <AnimatedText text={'Articles'} className={'mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl'}/>
                    <ul className={'grid grid-cols-2 gap-16 lg-gap-8 md:grid-cols-1 md:gap-y-16'}>
                        {featuredPosts.map((post) => (
                            <FeaturedArticle
                                key={post.ID}
                                title={post.title}
                                link={`/articles/${post.slug}`}
                                img={post.media.thumbnail}
                                alt={post.media.alt}
                                width={post.media.thumbnail_width}
                                height={post.media.thumbnail_height}
                                summary={post.excerpt}
                                time={post.reading_time + ' minute'}
                            />
                        ))}
                    </ul>
                    <h2 className={'font-bold text-4xl w-full my-16 text-center dark:text-light'}>All Articles</h2>
                    <ul>
                        {regularPosts.map((post) => (
                            <Article
                                key={post.ID}
                                title={post.title}
                                link={`/articles/${post.slug}`}
                                img={post.media.thumbnail}
                                width={post.media.thumbnail_width}
                                height={post.media.thumbnail_height}
                                date={post.date}
                            />
                        ))}
                    </ul>
                    {hasNextPage && <LoadMore onClick={loadMorePosts} isLoading={isLoading} />}
                </section>
            </div>
        </Layout>
    )
}
export default Articles;

export async function getStaticProps() {
    const data = await fetchCommonData();
    const initialPosts = await fetchPostData();
    return {
        props: {
            meta: data?.pages?.articles?.yoast_meta ?? {},
            favicon: data ?? {},
            headerFooter: data ?? {},
            allPosts: initialPosts,
        },
        revalidate: 1,
    }
}