import Image from 'next/image';
import Link from 'next/link';
import {Badge, PlatformChips, Stars} from './ui';
import {TYPES, toman} from '@/src/lib/store/format';

export default function ProductCard({product, priority = false}) {
    return (
        <article className="store-card group relative flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {product.image ? (
                    <Image
                        src={product.image.url}
                        alt={product.image.alt || product.title}
                        fill
                        priority={priority}
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 380px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                ) : null}
                <div className="absolute start-3 top-3 flex gap-2">
                    <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                        {TYPES[product.type]?.name}
                    </span>
                    <Badge badge={product.badge}/>
                </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-extrabold">
                    <Link href={product.path} className="after:absolute after:inset-0">
                        {product.title}
                    </Link>
                </h3>
                {product.tagline && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.tagline}</p>}
                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <div className="flex flex-col gap-2">
                        <Stars rating={product.rating}/>
                        <PlatformChips platforms={product.platforms}/>
                    </div>
                    {product.min_price ? (
                        <p className="text-end">
                            <span className="block text-xs text-slate-400">شروع قیمت از</span>
                            <span className="font-extrabold text-slate-900">{toman(product.min_price)}</span>
                        </p>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
