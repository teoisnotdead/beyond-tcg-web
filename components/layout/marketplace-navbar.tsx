'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { ModeToggle } from '@/components/mode-toggle';
import { ShoppingCart, Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from 'react';

const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/news', label: 'Noticias' },
    { href: '/contact', label: 'Contacto' },
];

export function MarketplaceNavbar() {
    const user = useAuthStore((state) => state.user);
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Wait for client-side mount to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold text-primary">
                        TCG MARKET
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                {item.label}
                            </Link>
                        ))}
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
                            <div className="flex flex-col gap-4 py-6">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="text-lg font-medium transition-colors hover:text-primary px-2"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="border-t pt-4 px-2">
                                    {!mounted ? (
                                        <Button variant="outline" className="w-full" disabled>Cargando...</Button>
                                    ) : user ? (
                                        <Link href="/dashboard" onClick={() => setOpen(false)}>
                                            <Button variant="outline" className="w-full">Dashboard</Button>
                                        </Link>
                                    ) : (
                                        <Link href="/login" onClick={() => setOpen(false)}>
                                            <Button className="w-full">Acceder</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <ModeToggle />

                    {/* Desktop Auth Button */}
                    <div className="hidden md:block">
                        {!mounted ? (
                            <Button variant="outline" disabled>...</Button>
                        ) : user ? (
                            <Link href="/dashboard">
                                <Button variant="outline">Dashboard</Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button>Acceder</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
