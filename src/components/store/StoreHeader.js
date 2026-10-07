import Link from 'next/link';
import StoreNav from './StoreNav';

export function StoreLogo({name}) {
    return (
        <Link href="/store" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-lg font-black text-white" aria-hidden="true">
                W
            </span>
            <bdi className="text-base font-extrabold tracking-wide text-slate-900 md:text-sm">{name}</bdi>
        </Link>
    );
}

export default function StoreHeader({settings}) {
    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="store-container flex h-16 items-center justify-between gap-4">
                <StoreLogo name={settings.store_name}/>
                <StoreNav/>
                <Link href="/store/custom-order" className="store-btn-primary py-2.5 lg:hidden">
                    سفارش اختصاصی
                </Link>
            </div>
        </header>
    );
}
