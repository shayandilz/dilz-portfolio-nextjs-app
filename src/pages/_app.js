import '../styles/globals.css'
import {AnimatePresence} from "framer-motion";
import {useRouter} from "next/router";
import { Analytics } from '@vercel/analytics/react';
import Script from "next/script";
import React from "react";
function MyApp({ Component, pageProps }) {
    const router = useRouter()
    return (
        <>
            <AnimatePresence mode={'wait'}>
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                />

                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
                </Script>
                <Component key={router.asPath} {...pageProps} />
                {/*<Analytics />*/}

            </AnimatePresence>
        </>
    )
}
export default MyApp