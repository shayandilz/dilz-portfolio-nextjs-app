import '../styles/globals.css'
import {AnimatePresence} from "framer-motion";
import {useRouter} from "next/router";
import { Analytics } from '@vercel/analytics/react';
function MyApp({ Component, pageProps }) {
    const router = useRouter()
    return (
        <>
            <AnimatePresence mode={'wait'}>
                <Component key={router.asPath} {...pageProps} />
                {/*<Analytics />*/}
            </AnimatePresence>
        </>
    )
}
export default MyApp