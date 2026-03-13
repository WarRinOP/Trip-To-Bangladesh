'use client';

import { useEffect, useState } from 'react';

export function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop || document.body.scrollTop;
            const max = el.scrollHeight - el.clientHeight;
            setProgress(max > 0 ? (scrolled / max) * 100 : 0);
        };
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 z-[999] h-[3px] bg-accent-gold transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
        />
    );
}
