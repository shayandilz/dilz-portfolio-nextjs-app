import Link from 'next/link';
import {StoreLogo} from './StoreHeader';
import {NAV_ITEMS} from '@/src/lib/store/nav';
import {jalaliYear} from '@/src/lib/store/format';

export default function StoreFooter({settings}) {
    const contact = [
        settings.telegram && {href: settings.telegram, label: 'تلگرام'},
        settings.whatsapp && {href: settings.whatsapp, label: 'واتس‌اپ'},
        settings.email && {href: `mailto:${settings.email}`, label: settings.email},
    ].filter(Boolean);
    const marketplaces = [
        settings.zhaket_profile && {href: settings.zhaket_profile, label: 'فروشگاه ما در ژاکت'},
        settings.rtl_profile && {href: settings.rtl_profile, label: 'فروشگاه ما در راست‌چین'},
    ].filter(Boolean);

    return (
        <footer className="mt-24 border-t border-slate-200 bg-white">
            <div className="store-container grid grid-cols-4 gap-10 py-14 lg:grid-cols-2 sm:grid-cols-1">
                <div className="col-span-2 lg:col-span-2 sm:col-span-1">
                    <StoreLogo name={settings.store_name}/>
                    <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">{settings.store_tagline}</p>
                </div>
                <div>
                    <h2 className="mb-3 text-sm font-bold">دسترسی سریع</h2>
                    <ul className="space-y-2 text-sm">
                        {[...NAV_ITEMS, {href: '/store/custom-order', label: 'سفارش اختصاصی'}].map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className="text-slate-500 hover:text-indigo-700">{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    {marketplaces.length > 0 && (
                        <>
                            <h2 className="mb-3 text-sm font-bold">خرید محصولات</h2>
                            <ul className="mb-6 space-y-2 text-sm">
                                {marketplaces.map((item) => (
                                    <li key={item.href}>
                                        <a href={item.href} target="_blank" rel="noopener" className="text-slate-500 hover:text-indigo-700">{item.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {contact.length > 0 && (
                        <>
                            <h2 className="mb-3 text-sm font-bold">ارتباط با ما</h2>
                            <ul className="space-y-2 text-sm">
                                {contact.map((item) => (
                                    <li key={item.href}>
                                        <a href={item.href} target="_blank" rel="noopener" className="text-slate-500 hover:text-indigo-700">{item.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
            <div className="border-t border-slate-100">
                <div className="store-container flex items-center justify-between gap-4 py-5 text-xs text-slate-400 sm:flex-col">
                    <span>© {jalaliYear()} — {settings.store_name}</span>
                    <a href="/" lang="en" dir="ltr" className="hover:text-indigo-700">Shayan Portfolio (English)</a>
                </div>
            </div>
        </footer>
    );
}
