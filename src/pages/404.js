/**
 * External Link.
 */
import Link from 'next/link';
import Layout from "@/src/components/layout";
import {fetchCommonData} from "@/src/utils/fetchData";

function Error404({favicon, headerFooter, meta}) {
    return (<Layout
        headerIcon={headerFooter.global.icon.site_logo}
        favicon={favicon.global.icon}
        headerFooter={headerFooter.global.menu || {}}
        socialAccounts={headerFooter.global.social || {}}
        siteTitle={'404'}
        metaData={meta}>
        <div className="h-screen w-full flex flex-col justify-center items-center">
            <h1 className="text-[15rem] lg:text-9xl font-extrabold dark:text-light text-dark tracking-widest">404</h1>
            <div className="dark:bg-primaryDark bg-primary px-2 text-2xl rounded rotate-12 absolute">
                Page Not Found
            </div>
            <button className="mt-5">
                <Link href={'/'}
                      className="relative inline-block text-sm font-medium dark:text-primaryDark text-primary group active:text-orange-500 focus:outline-none focus:ring"
                >
        <span
            className="absolute inset-0 transition-transform translate-x-1 translate-y-1 dark:bg-primaryDark bg-primary group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

                    <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
          <router-link to="/">Go Home</router-link>
        </span>
                </Link>
            </button>
        </div>
    </Layout>);
}

export default Error404;

export async function getStaticProps() {
    const data = await fetchCommonData();
    return {
        props: {
            meta: data?.pages?.homepage?.yoast_meta ?? {}, favicon: data ?? {}, headerFooter: data ?? {},
        }, revalidate: 1,
    }
}
