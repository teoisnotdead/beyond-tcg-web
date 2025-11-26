'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    BarChart3,
    FileText,
    ShoppingBag,
    Package,
    History,
    Heart,
    Settings,
    LogOut,
    MoreHorizontal,
    Menu
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';

const sidebarItems = [
    {
        title: 'Home',
        items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
            { title: 'Reports', href: '/dashboard/reports', icon: FileText },
        ],
    },
    {
        title: 'Ventas',
        items: [
            { title: 'Mis Ventas', href: '/dashboard/sales', icon: ShoppingBag },
            { title: 'Productos', href: '/dashboard/products', icon: Package },
        ],
    },
    {
        title: 'Compras',
        items: [
            { title: 'Mis Compras', href: '/dashboard/purchases', icon: History },
            { title: 'Guardados', href: '/dashboard/saved', icon: Heart },
        ],
    },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold" onClick={onLinkClick}>
                    <span className="text-lg">Beyond TCG</span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {sidebarItems.map((section, index) => (
                        <div key={index} className="mb-6">
                            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                                {section.title}
                            </h3>
                            <div className="grid gap-1">
                                {section.items.map((item, itemIndex) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={itemIndex}
                                            href={item.href}
                                            onClick={onLinkClick}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                pathname === item.href
                                                    ? "bg-muted text-primary"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="border-t p-4">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <Link
                        href="/dashboard/settings"
                        onClick={onLinkClick}
                        className={cn(
                            "flex items-center gap-3 text-sm font-medium text-muted-foreground transition-all hover:text-primary"
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        Configuración
                    </Link>
                </div>

                <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar_url} alt={user?.name} />
                            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5 leading-none">
                            <span className="font-semibold text-sm">{user?.name || 'Usuario'}</span>
                            <span className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</span>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                Cerrar Sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

export function DashboardSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Menú de navegación</SheetTitle>
                    </SheetHeader>
                    <SidebarContent onLinkClick={() => setOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-screen flex-col border-r bg-card text-card-foreground">
                <SidebarContent />
            </div>
        </>
    );
}
