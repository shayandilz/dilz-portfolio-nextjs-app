import React from 'react';
import Layout from "../components/Layout";
import AnimatedText from "../components/AnimatedText";
import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";
import TransitionEffect from "../components/TransitionEffect";
import {fetchCommonData} from "@/src/utils/fetchData";
import {isEmpty} from "lodash";
const FramerImage = motion(Image)
const FeaturedProject = ({type, title, year, img, link, github, category, client}) => {
    return (
        <article
            className={'w-full flex items-center justify-between rounded-3xl dark:text-light rounded-br-2xl border border-solid border-dark dark:border-light bg-light dark:bg-dark shadow-2xl p-8 relative lg:flex-col lg:p-8 xs:rounded-2xl xs:rounded-br-3xl xs:p-4'}>
            <div className='absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2.5rem] bg-dark  dark:bg-light rounded-br-3xl xs:-right-2 sm:h-[102%] xs:w-full xs:rounded-[1.5rem]'/>
            <Link className={'w-1/2 cursor-pointer overflow-hidden rounded-lg lg:w-full'} href={link} target={'_blank'}>
                <FramerImage
                    src={img}
                    title={title}
                    alt={title}
                    className={'w-full h-auto'}
                    whileHover={{scale: 1.05}}
                    transition={{duration: 0.2}}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
            </Link>
            <div className={'w-1/2 flex flex-col items-start justify-between pl-6 lg:w-full lg:pl-0 lg:pt-6'}>
                <div className={'flex flex-wrap gap-3 items-center justify-start'}>
                    <fieldset className={'text-center border border-dark px-2 pb-2 rounded'}>
                        <legend className={'font-bold px-2'}>Type</legend>
                        <h6 className={'font-bold text-primary'}>{type}</h6>
                    </fieldset>
                    <fieldset className={'text-center border border-dark px-2 pb-2 rounded'}>
                        <legend className={'font-bold px-2'}>Category</legend>
                        <h6 className={'font-bold text-primary'}>{category[0].name}</h6>
                    </fieldset>
                    <fieldset className={'text-center border border-dark px-2 pb-2 rounded'}>
                        <legend className={'font-bold px-2'}>Year</legend>
                        <h6 className={'font-bold text-primary'}>{year}</h6>
                    </fieldset>
                    <fieldset className={'text-center border border-dark px-2 pb-2 rounded'}>
                        <legend className={'font-bold px-2'}>Client</legend>
                        <h6 className={'font-bold text-primary'}>{client}</h6>
                    </fieldset>
                </div>
                <Link className={'hover:underline underline-offset-2'} href={link} target={'_blank'}>
                    <h2 className={'my-4 w-full text-left text-4xl font-bold sm:text-sm'}>{title}</h2>
                </Link>
                <div className={'mt-2 flex items-center'}>
                    {/*<Link className={'w-10'} href={github} target={'_blank'}><GithubIcon/></Link>*/}
                    <Link className={'rounded-lg bg-dark text-light p-2 px-6 text-lg font-semibold sm:px-4 sm:text-base'} href={link}
                          target={'_blank'}>Visit Project</Link>
                </div>
            </div>
        </article>
    )
}
const Project = ({title, type, img, link, github,year, category, client}) => {
    return (
        <article
            className={'w-full flex flex-col items-center justify-center rounded-2xl border border-solid border-dark dark:border-light dark:text-light bg-light dark:bg-dark p-6 relative xs:p-4'}>
            <div className='absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] bg-dark dark:bg-light rounded-br-3xl md:-right-2 md:w-[101%] xs:h-[102%] xs:rounded-[1.5rem]'/>
            <Link className={'w-full cursor-pointer overflow-hidden rounded-lg'} href={link} target={'_blank'}>
                <FramerImage
                    src={img}
                    title={title}
                    alt={title}
                    className={'w-full h-auto'}
                    whileHover={{scale: 1.05}}
                    transition={{duration: 0.2}}
                />
            </Link>
            <div className={'w-full flex flex-col items-start justify-between mt-4'}>
                <div className={'flex flex-wrap gap-3 items-center justify-start'}>
                    <fieldset className={'text-center border border-dark px-2 pb-2 rounded'}>
                        <legend className={'font-bold px-2'}>Type</legend>
                        <h6 className={'font-bold text-primary'}>{type}</h6>
                    </fieldset>
                    <fieldset className={'text-center border border-dark px-2 pb-2 rounded'}>
                        <legend className={'font-bold px-2'}>Category</legend>
                        <h6 className={'font-bold text-primary'}>{category[0].name}</h6>
                    </fieldset>
                    <fieldset className={'text-center border border-dark px-2 pb-2 rounded'}>
                        <legend className={'font-bold px-2'}>Year</legend>
                        <h6 className={'font-bold text-primary'}>{year}</h6>
                    </fieldset>
                    <fieldset className={'text-center border border-dark px-2 pb-2 rounded'}>
                        <legend className={'font-bold px-2'}>Client</legend>
                        <h6 className={'font-bold text-primary'}>{client}</h6>
                    </fieldset>
                </div>
                <Link className={'hover:underline underline-offset-2'} href={link} target={'_blank'}>
                    <h2 className={'my-3 w-full text-left text-2xl font-bold lg:text-lg sm:text-sm'}>{title}</h2>
                </Link>
                <div className={'w-full mt-2 flex items-center justify-between'}>
                    <Link className={' text-md font-semibold underline md:text-base'} href={link}
                          target={'_blank'}>Visit Project
                    </Link>
                    {/*<Link className={'w-8 md:w-6'} href={github} target={'_blank'}><GithubIcon/></Link>*/}

                </div>
            </div>
        </article>
    )
}

const Projects = ({favicon,headerFooter, portfolio, pages, meta}) => {
    let projects = '';
    return (
        <Layout
            favicon={favicon.global.icon}
            headerFooter={headerFooter.global.menu || {}}
            socialAccounts={headerFooter.global.social || {}}
            siteTitle={pages.title}
            metaData={meta}
        >
            <TransitionEffect />
            <div className={'w-full mb-16 flex flex-col items-center justify-center'}>
                <section className={'pt-16'}>
                    <AnimatedText className={'mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl'} text='Projects'/>

                    <div className="grid grid-cols-12 gap-16 gap-y-16 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0">
                        {!isEmpty(portfolio) && portfolio.length ? portfolio.map((items, index) => (
                            <div key={index} className={index === 0 ? "col-span-12" : "col-span-4 sm:col-span-12 xl:col-span-6"}>
                                {projects = index.length}
                                {index === 0 ? (
                                    <FeaturedProject
                                        title={items.title}
                                        category={items.category}
                                        img={items.image}
                                        type={items.type ?? 'Wordpress'}
                                        link={items.url}
                                        year={items.year ?? 'Recently'}
                                        github={'/'}
                                        client={items.client}
                                    />
                                ) : (
                                    <Project
                                        title={items.title}
                                        category={items.category}
                                        img={items.image}
                                        type={items.type ?? 'Wordpress'}
                                        link={items.url}
                                        client={items.client ?? 'Personal'}
                                        year={items.year ?? 'Recently'}
                                        github={''}
                                    />
                                )}
                            </div>
                        )) : null}

                    </div>
                </section>
            </div>
        </Layout>
    )
}
export default Projects;

export async function getStaticProps() {
    const data = await fetchCommonData();

    return {
        props: {
            favicon: data ?? {},
            meta: data?.pages?.portfolio?.yoast_meta ?? {},
            headerFooter: data ?? {},
            pages: data?.pages?.portfolio[0].data ?? {},
            portfolio: data?.portfolio ?? {},
        },
        revalidate: 1,
    }
}