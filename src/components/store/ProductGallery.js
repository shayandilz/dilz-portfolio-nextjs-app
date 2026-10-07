'use client';

import Image from 'next/image';
import {useState} from 'react';

export default function ProductGallery({images, title}) {
    const [active, setActive] = useState(0);
    if (!images.length) return null;
    const current = images[active] ?? images[0];

    return (
        <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <Image
                    src={current.url}
                    alt={current.alt || title}
                    fill
                    priority={active === 0}
                    sizes="(max-width: 1023px) 100vw, 720px"
                    className="object-cover"
                />
            </div>
            {images.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="تصاویر محصول">
                    {images.map((image, index) => (
                        <button
                            key={image.url}
                            type="button"
                            role="tab"
                            aria-selected={index === active}
                            aria-label={`تصویر ${index + 1}`}
                            onClick={() => setActive(index)}
                            className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg border-2 border-transparent opacity-70 transition aria-selected:border-indigo-700 aria-selected:opacity-100"
                        >
                            <Image src={image.url} alt="" fill sizes="112px" className="object-cover"/>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
