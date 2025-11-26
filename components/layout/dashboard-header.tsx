'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store } from 'lucide-react';

interface DashboardHeaderProps {
    leftSlot?: ReactNode;
    rightSlot?: ReactNode;
}

export function DashboardHeader({ leftSlot, rightSlot }: DashboardHeaderProps) {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const title = segments.length > 1
        ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)
        : 'Dashboard';

    return (
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-3">
                {leftSlot}
                <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                <Link 
                    href="/marketplace" 
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Store className="h-4 w-4" />
                    <span className="hidden sm:inline">Marketplace</span>
                </Link>
                {rightSlot && (
                    <div className="flex items-center gap-2">
                        {rightSlot}
                    </div>
                )}
            </div>
        </header>
    );
}
