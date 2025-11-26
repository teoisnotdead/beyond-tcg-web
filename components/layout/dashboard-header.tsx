'use client';

import { usePathname } from 'next/navigation';

export function DashboardHeader() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const title = segments.length > 1
        ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)
        : 'Dashboard';

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
            <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
        </header>
    );
}
