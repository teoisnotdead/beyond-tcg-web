'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar, DashboardSidebarMobile } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/hooks/use-auth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // Proteger todas las rutas del dashboard
    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login');
        }
    }, [isLoading, user, router]);

    // Mientras se resuelve la sesión o se redirige, no renderizamos contenido
    if (isLoading || !user) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <DashboardSidebar />
            <div className="flex flex-col">
                <DashboardHeader
                    leftSlot={(
                        <div className="md:hidden">
                            <DashboardSidebarMobile />
                        </div>
                    )}
                    rightSlot={(
                        <ModeToggle />
                    )}
                />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
