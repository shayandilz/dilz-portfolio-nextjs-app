'use client';

/**
 * External link that reports a GA4 event before leaving (marketplace_click, demo_click, ...).
 */
export default function OutboundLink({href, event, params, children, ...props}) {
    const track = () => {
        if (event && typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', event, {...params, link_url: href, transport_type: 'beacon'});
        }
    };

    return (
        <a href={href} target="_blank" rel="noopener" onClick={track} {...props}>
            {children}
        </a>
    );
}
