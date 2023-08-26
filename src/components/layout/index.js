import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar'
import Footer from './Footer';
import BackToTopButton from "@/src/components/BackToTopButton";
import {Montserrat} from 'next/font/google';
import {sanitize} from "@/src/utils/miscellaneous";


const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-mont'
})
const Layout = ({children, favicon, headerFooter, socialAccounts, className = '', siteTitle, metaData}) => {
    const {
        title,
        desc,
        meta_robots,
        canonical,
        og_title,
        og_desc,
        og_image,
        og_type,
        og_url,
        reading_time,
        schema,
        og_update,
        og_publish,
        og_modify
    } = metaData ?? {}
    const {width, height, alt, type, url} = og_image ?? {}
    return (
        <div className={` font-mont bg-light dark:bg-dark w-full min-w-screen`}>
            <Head>
                <title>{title ?? 'Dilz'}</title>
                <meta name="description" content={desc}/>
                <link rel="canonical" href={canonical}/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta charSet="UTF-8"/>
                <link rel="icon" href={favicon.url ?? 'favicon.ico'} type="image/x-icon"/>
                <meta property="og:title" content={og_title}/>
                <meta property="og:description" content={og_desc}/>
                <meta property="og:image:width" content={width}/>
                <meta property="og:image:height" content={height}/>
                <meta property="og:image:type" content={type}/>
                <meta property="og:image:alt" content={alt}/>
                <meta property="og:image" content={url}/>
                <meta property="og:image:secure_url" content={url}/>
                <meta property="og:url" content={og_url}/>
                <meta property="og:type" content={og_type}/>
                <meta property="og:updated_time" content={og_update}/>
                <meta property="article:published_time" content={og_publish}/>
                <meta property="article:modified_time" content={og_modify}/>
                <meta name="robots" content={meta_robots.index + ', ' + meta_robots.follow}/>
                <script type="application/ld+json"
                        className={'yoast-schema-graph'}
                        key={'yoastSchema'}
                        dangerouslySetInnerHTML={{__html: sanitize(schema)}}
                />
            </Head>
            <Navbar header={headerFooter} social={socialAccounts}/>
            <main className={`w-full h-full inline-block z-0 bg-light dark:bg-dark px-20 sm:px-5 ${className}`}>
                {children}
                <BackToTopButton />
            </main>
            <Footer/>
        </div>
    );
};

export default Layout;