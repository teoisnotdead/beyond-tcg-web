'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';

export default function HomePage() {
    const { user, isLoading } = useAuth();

    return (
        <div className="container py-10 space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-4">Home</h1>
                <p className="text-lg text-muted-foreground">
                    Bienvenido a Beyond TCG Marketplace.
                </p>
            </div>

            {/* Botón Acceder solo cuando NO hay sesión */}
            {!isLoading && !user && (
                <Link href="/login">
                    <Button size="lg">
                        Acceder
                    </Button>
                </Link>
            )}
        </div>
    );
}
