'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/hooks/use-auth';
import { registerSchema, RegisterValues } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Chrome } from 'lucide-react';

export function RegisterForm() {
    const { register: registerUser, loginWithGoogle } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(values: RegisterValues) {
        setLoading(true);
        setError(null);
        try {
            await registerUser(values.name, values.email, values.password);
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError('Error al registrarse. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleRegister() {
        setLoading(true);
        setError(null);
        try {
            await loginWithGoogle();
        } catch (err: any) {
            console.error(err);
            const message =
                err instanceof Error
                    ? err.message
                    : 'No se pudo completar el registro con Google';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input placeholder="Tu nombre" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="tu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirmar Contraseña</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    disabled={loading}
                    aria-label="Registrarse con Google"
                    onClick={handleGoogleRegister}
                >
                    <Chrome className="h-5 w-5" />
                    {loading ? 'Conectando con Google...' : 'Continuar con Google'}
                </Button>
            </form>
        </Form>
    );
}
