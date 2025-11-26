'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import { useAuth } from '@/lib/hooks/use-auth';

export default function RegisterPage() {
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
                        Crear una cuenta
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Ingresa tus datos para registrarte
                    </p>
                </div>
                <RegisterForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        href="/login"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        ¿Ya tienes una cuenta? Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
