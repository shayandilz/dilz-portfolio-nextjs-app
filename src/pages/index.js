import {fetchCommonData} from "../utils/fetchData";
import Link from "next/link";
import Image from "next/image";
import AnimatedText from "../components/AnimatedText";
import {LinkArrow} from "../components/Icons";
import HireMe from "../components/HireMe";
import TransitionEffect from "../components/TransitionEffect";
import Layout from '../components/layout';

export default function Home({favicon, headerFooter, homepage, meta}) {

    return (
        <Layout
                headerIcon={headerFooter.global.icon.site_logo}
                favicon={favicon.global.icon}
                headerFooter={headerFooter.global.menu || {}}
                socialAccounts={headerFooter.global.social || {}}
                siteTitle={homepage.data.title}
                metaData={meta}
        >
            <TransitionEffect/>
            <div className={'flex items-start text-dark w-full lg:min-h-full min-h-screen'}>
                <section className=''>
                    <div className="flex items-center justify-center w-full lg:flex-col">
                        <div className={'w-1/2 md:w-full'}>
                            <Image
                                src={homepage.main.image}
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                alt={homepage.main.image['alt']}
                                className={'w-4/5 h-auto lg:hidden md:inline-block md:w-full'}/>
                        </div>
                        <div className={'w-1/2 flex flex-col items-start self-center lg:w-full lg:text-center'}>
                            <AnimatedText text={homepage.main.title}
                                          className='!text-6xl !text-left xl:!text-5xl lg:!text-center lg:!text-6xl md:!text-5xl sm:!text-3xl lg:py-5'/>
                            <p className={'text-base text-medium my-4 dark:text-light md:text-sm sm:text-sm lg:pb-5 text-justify text-black font-medium'}>
                                {homepage.main.text}
                            </p>
                            <div className={'lg:w-full flex items-center justify-start lg:justify-center'}>
                                <Link
                                    target={'_blank'}
                                    className={'bg-dark dark:bg-light dark:text-dark text-light px-6 py-2 flex items-center justify-center text-lg font-semibold dark:hover:bg-dark hover:bg-white transition duration-300 dark:hover:text-light hover:text-dark border border-solid border-transparent hover:border-dark dark:hover:border-light md:p-2 md:px-4 md:text-base rounded-lg'}
                                    href={homepage.main.resume}>Resume {<LinkArrow
                                    className={'w-16 ml-2'}/>}</Link>
                            </div>
                        </div>
                    </div>
                </section>
                <HireMe email={headerFooter.global.contact[0].email || {}}/>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    const data = await fetchCommonData();
    return {
        props: {
            meta: data?.pages?.homepage?.yoast_meta ?? {},
            favicon: data ?? {},
            headerFooter: data ?? {},
            homepage: data?.pages?.homepage
        },
        revalidate: 1,
    }
}