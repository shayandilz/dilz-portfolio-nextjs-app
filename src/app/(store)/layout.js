import localFont from 'next/font/local';
import Script from 'next/script';
import './store.css';
import StoreHeader from '@/src/components/store/StoreHeader';
import StoreFooter from '@/src/components/store/StoreFooter';
import {getSettings} from '@/src/lib/store/api';
import {withDefaults} from '@/src/lib/store/content';

// Root layout of the Persian store. The English portfolio (src/pages) has its own document,
// so moving between the two is a full page load.

const vazirmatn = localFont({
    src: '../../styles/font/vazirmatn/Vazirmatn-Variable.woff2',
    weight: '100 900',
    display: 'swap',
    variable: '--font-vazirmatn',
});

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

export async function generateMetadata() {
    const settings = withDefaults(await getSettings());
    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'https://shayan.website'),
        title: {default: settings.store_name, template: `%s | ${settings.store_name}`},
        description: settings.store_tagline,
        openGraph: {siteName: settings.store_name, locale: 'fa_IR', type: 'website'},
        formatDetection: {telephone: false},
    };
}

export const viewport = {
    themeColor: '#4338ca',
};

export default async function StoreLayout({children}) {
    const settings = withDefaults(await getSettings());

    return (
        <html lang="fa" dir="rtl" className={vazirmatn.variable}>
        <body className={`${vazirmatn.className} flex min-h-screen flex-col`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
            رفتن به محتوای اصلی
        </a>
        <StoreHeader settings={settings}/>
        <main id="main" className="flex-1">{children}</main>
        <StoreFooter settings={settings}/>
        {GA_ID && (
            <>
                <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive"/>
                <Script id="store-ga" strategy="afterInteractive">
                    {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
                </Script>
            </>
        )}
        </body>
        </html>
    );
}
