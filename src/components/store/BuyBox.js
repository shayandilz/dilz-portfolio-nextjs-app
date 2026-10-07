import OutboundLink from './OutboundLink';
import {effectivePrice, faDigits, faNumber, jalali, marketplaceUrl, PLATFORMS, toman} from '@/src/lib/store/format';

function MarketplaceRow({product, marketplace, primary}) {
    const platform = PLATFORMS[marketplace.platform];
    if (!platform) return null;
    const onSale = marketplace.sale_price && marketplace.price && marketplace.sale_price < marketplace.price;

    return (
        <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
                <span className="font-bold text-slate-900">{platform.name}</span>
                {marketplace.price ? (
                    <span className="text-end">
                        {onSale && <del className="block text-xs text-slate-400">{toman(marketplace.price)}</del>}
                        <span className="font-extrabold text-slate-900">{toman(effectivePrice(marketplace))}</span>
                    </span>
                ) : null}
            </div>
            <OutboundLink
                href={marketplaceUrl(marketplace.url, product.slug)}
                event="marketplace_click"
                params={{platform: marketplace.platform, product: product.slug}}
                className={`w-full ${primary ? 'store-btn-primary' : 'store-btn-secondary'}`}
            >
                {platform.buy}
            </OutboundLink>
        </div>
    );
}

export default function BuyBox({product}) {
    const facts = [
        product.version && ['نسخه فعلی', faDigits(product.version)],
        product.updated && ['آخرین به‌روزرسانی', jalali(product.updated)],
        product.released && ['تاریخ انتشار', jalali(product.released)],
        product.sales ? ['تعداد فروش', faNumber(product.sales)] : null,
        product.support_months ? ['پشتیبانی', `${faNumber(product.support_months)} ماه`] : null,
    ].filter(Boolean);

    return (
        <div id="buy" className="store-card scroll-mt-24 p-6">
            {product.marketplaces.length ? (
                <div className="space-y-3">
                    {product.marketplaces.map((m, index) => (
                        <MarketplaceRow key={m.platform} product={product} marketplace={m} primary={index === 0}/>
                    ))}
                    <p className="text-xs leading-6 text-slate-400">
                        قیمت‌ها در زمان انتشار ثبت شده‌اند؛ قیمت نهایی در صفحه مارکت‌پلیس نمایش داده می‌شود.
                    </p>
                </div>
            ) : (
                <p className="rounded-xl bg-slate-50 p-4 text-center font-bold text-slate-600">به‌زودی در ژاکت و راست‌چین</p>
            )}

            {product.demo_url && (
                <OutboundLink
                    href={product.demo_url}
                    event="demo_click"
                    params={{product: product.slug}}
                    className="store-btn-accent mt-4 w-full"
                >
                    مشاهده دمو
                </OutboundLink>
            )}

            {facts.length > 0 && (
                <dl className="mt-6 divide-y divide-slate-100 text-sm">
                    {facts.map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2.5">
                            <dt className="text-slate-500">{label}</dt>
                            <dd className="font-bold text-slate-900">{value}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </div>
    );
}

/** Fixed bar on small screens so the buy action stays reachable while reading. */
export function MobileBuyBar({product}) {
    const prices = product.marketplaces.map(effectivePrice).filter(Boolean);
    if (!product.marketplaces.length) return null;
    return (
        <div className="fixed inset-x-0 bottom-0 z-30 hidden border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:block">
            <div className="flex items-center justify-between gap-4">
                <span className="text-sm">
                    {prices.length ? (
                        <>
                            <span className="block text-xs text-slate-400">شروع قیمت از</span>
                            <span className="font-extrabold text-slate-900">{toman(Math.min(...prices))}</span>
                        </>
                    ) : (
                        <span className="font-bold text-slate-900">{product.title}</span>
                    )}
                </span>
                <a href="#buy" className="store-btn-primary">خرید محصول</a>
            </div>
        </div>
    );
}
