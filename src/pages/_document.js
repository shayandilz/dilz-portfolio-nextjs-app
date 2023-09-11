import {Html, Head, Main, NextScript} from 'next/document'
import Script from "next/script";

export default function Document() {
    return (
        <Html lang="en">
            <Head/>
            <body>
            <Script strategy='beforeInteractive' id={'theme-switcher'}>
                {`
                    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      document.documentElement.classList.add('dark')
                    } else {
                      document.documentElement.classList.remove('dark')
                    }
          `}
            </Script>
            <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />

            <Script strategy="lazyOnload">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
            </Script>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
