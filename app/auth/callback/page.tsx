'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';

// Ruta explícita /auth/callback para el retorno de Google (el grupo (auth) no aparece en la URL)
export default function AuthCallbackPageAlias() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Procesando inicio de sesión con Google...
      </p>
    </div>
  );
}
