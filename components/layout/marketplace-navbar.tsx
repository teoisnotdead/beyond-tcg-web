'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { ModeToggle } from '@/components/mode-toggle';
import { ShoppingCart, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';

const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/news', label: 'Noticias' },
    { href: '/contact', label: 'Contacto' },
];

export function MarketplaceNavbar() {
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/40">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold text-primary">
                        Beyond TCG
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "transition-colors",
                                        isActive
                                            ? "text-foreground"
                                            : "text-foreground/60 hover:text-foreground/90"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Cart Icon */}
                    <Link href="/cart" className="relative">
                        <Button variant="ghost" size="icon">
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </Link>

                    {/* Mobile Menu */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="border-l">
                            <SheetHeader className="border-b pb-4">
                                <SheetTitle>Menú</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 py-6 px-3">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "text-lg font-medium transition-colors",
                                                isActive
                                                    ? "text-foreground"
                                                    : "text-foreground/70 hover:text-primary"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                                <div className="border-t pt-4 px-2">
                                    {isLoading ? (
                                        <Button variant="outline" className="w-full" disabled>...</Button>
                                    ) : user ? (
                                        <>
                                            <Link href="/dashboard" onClick={() => setOpen(false)}>
                                                <Button variant="outline" className="w-full">Dashboard</Button>
                                            </Link>
                                            <Button
                                                className="w-full mt-2"
                                                variant="destructive"
                                                onClick={() => {
                                                    logout();
                                                    setOpen(false);
                                                    router.replace('/login');
                                                }}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Cerrar sesión
                                            </Button>
                                        </>
                                    ) : (
                                        <Link href="/login" onClick={() => setOpen(false)}>
                                            <Button className="w-full">Acceder</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Desktop Auth Button */}
                    <div className="hidden md:flex items-center gap-2">
                        {isLoading ? (
                            <Button variant="ghost" size="sm" disabled>...</Button>
                        ) : user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="outline">Dashboard</Button>
                                </Link>
                                <ModeToggle />
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button>Acceder</Button>
                                </Link>
                                <ModeToggle />
                            </>
                        )}
                    </div>

                    {/* Mobile theme toggle (optional, siempre visible) */}
                    <div className="md:hidden">
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
}
