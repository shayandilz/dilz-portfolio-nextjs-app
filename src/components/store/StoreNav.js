'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useRef} from 'react';
import {NAV_ITEMS} from '@/src/lib/store/nav';

const isActive = (pathname, href) => (href === '/store' ? pathname === href : pathname.startsWith(href));

export default function StoreNav() {
    const pathname = usePathname();
    const menu = useRef(null);

    // Close the mobile menu after navigating
    useEffect(() => {
        if (menu.current) menu.current.open = false;
    }, [pathname]);

    return (
        <>
            <nav aria-label="منوی اصلی" className="flex items-center gap-1 lg:hidden">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 aria-[current=page]:bg-indigo-50 aria-[current=page]:text-indigo-700"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <details ref={menu} className="relative hidden lg:block">
                <summary className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200" aria-label="منو">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
                    </svg>
                </summary>
                <nav aria-label="منوی موبایل" className="absolute end-0 top-14 z-40 flex w-64 flex-col rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                            className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-50 aria-[current=page]:bg-indigo-50 aria-[current=page]:text-indigo-700"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link href="/store/custom-order" className="store-btn-primary mt-2">سفارش اختصاصی</Link>
                </nav>
            </details>
        </>
    );
}
