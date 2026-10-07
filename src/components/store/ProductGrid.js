'use client';

import {useMemo, useState} from 'react';
import ProductCard from './ProductCard';
import {faNumber} from '@/src/lib/store/format';

const SORTS = {
    default: {label: 'پیشنهادی', compare: () => 0},
    updated: {label: 'جدیدترین', compare: (a, b) => (b.updated ?? '').localeCompare(a.updated ?? '')},
    sales: {label: 'پرفروش‌ترین', compare: (a, b) => (b.sales ?? 0) - (a.sales ?? 0)},
    price: {label: 'ارزان‌ترین', compare: (a, b) => (a.min_price ?? Infinity) - (b.min_price ?? Infinity)},
};

/** Category chips + sorting over a server-rendered product list. */
export default function ProductGrid({products}) {
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('default');

    const categories = useMemo(() => {
        const map = new Map();
        products.forEach((p) => p.categories.forEach((c) => map.set(c.slug, c.name)));
        return [...map.entries()].map(([slug, name]) => ({slug, name}));
    }, [products]);

    const visible = useMemo(
        () => products
            .filter((p) => !category || p.categories.some((c) => c.slug === category))
            .sort(SORTS[sort].compare),
        [products, category, sort],
    );

    return (
        <>
            <div className="mb-8 flex items-center justify-between gap-4 md:flex-col md:items-stretch">
                <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر دسته">
                    {[{slug: '', name: 'همه'}, ...categories].map((c) => (
                        <button
                            key={c.slug || 'all'}
                            type="button"
                            onClick={() => setCategory(c.slug)}
                            aria-pressed={category === c.slug}
                            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 hover:border-indigo-300 aria-pressed:border-indigo-700 aria-pressed:bg-indigo-700 aria-pressed:text-white"
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-500">
                    مرتب‌سازی:
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-800"
                    >
                        {Object.entries(SORTS).map(([key, s]) => (
                            <option key={key} value={key}>{s.label}</option>
                        ))}
                    </select>
                </label>
            </div>
            <p className="sr-only" aria-live="polite">{faNumber(visible.length)} محصول</p>
            <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 sm:grid-cols-1">
                {visible.map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index < 3}/>
                ))}
            </div>
        </>
    );
}
