'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/lib/hooks/use-auth';

export default function LoginPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // Si ya hay sesión, redirigir al dashboard
    useEffect(() => {
        if (!isLoading && user) {
            router.replace('/dashboard');
        }
    }, [isLoading, user, router]);

    // Si está cargando o ya hay usuario, no renderizamos el formulario
    if (isLoading || user) {
        return null;
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Bienvenido de nuevo
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Ingresa tu email para acceder a tu cuenta
                    </p>
                </div>

                {/* Mientras se resuelve el estado de auth, mostramos solo el layout */}
                <LoginForm />

                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        href="/register"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}
