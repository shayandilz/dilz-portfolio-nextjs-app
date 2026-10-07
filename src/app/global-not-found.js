import Link from 'next/link';
import localFont from 'next/font/local';
import '../styles/globals.css';

// 404 for URLs that match no route. The app has two root layouts (English portfolio in src/pages,
// Persian store in src/app/(store)), so this page renders its own document.
// Unknown /store/... paths use src/app/(store)/store/not-found.js instead.

const assistant = localFont({
    src: [
        {path: '../styles/font/monst/woff2/Assistant-Regular.woff2', weight: '400'},
        {path: '../styles/font/monst/woff2/Assistant-Bold.woff2', weight: '700'},
    ],
});

export const metadata = {
    title: '404 - Page Not Found',
    robots: {index: false},
};

export default function GlobalNotFound() {
    return (
        <html lang="en">
        <body className={`${assistant.className} bg-light`}>
        <main className="h-screen w-full flex flex-col justify-center items-center text-dark">
            <h1 className="text-[15rem] lg:text-9xl font-extrabold tracking-widest">404</h1>
            <div className="bg-primary px-2 text-2xl rounded rotate-12 absolute">Page Not Found</div>
            <div className="mt-8 flex gap-4">
                <Link href="/" className="rounded-lg bg-dark text-light px-6 py-3 font-semibold">Go Home</Link>
                <Link href="/store" className="rounded-lg border border-dark px-6 py-3 font-semibold">فروشگاه وردپرس</Link>
            </div>
        </main>
        </body>
        </html>
    );
}
