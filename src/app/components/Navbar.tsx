'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const isAbout = pathname === '/about';

    return (
        <nav className="fixed top-6 left-6 z-[999]">
            <Link
                href={isAbout ? '/' : '/about'}
                className="text-[11px] tracking-[0.25em] uppercase font-mono text-ink/60 hover:text-ink transition-colors duration-200"
            >
                {isAbout ? '← Gallery' : 'About'}
            </Link>
        </nav>
    );
}