'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { SalesGrid } from '@/components/marketplace/sales-grid';
import { useSales } from '@/lib/hooks/use-sales';

export default function HomePage() {
    const { user, isLoading } = useAuth();
    const { data, isLoading: loadingSales, isError } = useSales({ page: 1, limit: 6 });
    const sales = data?.data ?? [];

    return (
        <div className="min-h-screen">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-sky-500/10 blur-3xl" />
                <div className="container py-16 grid gap-10 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                            Novedades Beyond TCG
                        </span>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                Colecciona sin límites. <span className="text-primary">Comparte la aventura.</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                Conecta con jugadores, descubre cartas difíciles de conseguir y entérate de lo que está pasando en la comunidad. Todo en un solo lugar.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href="/marketplace">
                                <Button size="lg">
                                    Explorar marketplace
                                </Button>
                            </Link>
                            <Link href="/news">
                                <Button size="lg" variant="outline">
                                    Ver noticias
                                </Button>
                            </Link>
                            {!isLoading && !user && (
                                <Link href="/login">
                                    <Button size="lg" variant="ghost">
                                        Acceder
                                    </Button>
                                </Link>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                            <div className="rounded-2xl border bg-card/80 p-4 shadow-sm">
                                <p className="text-2xl font-semibold">+1200</p>
                                <p className="text-sm text-muted-foreground">Cartas listadas</p>
                            </div>
                            <div className="rounded-2xl border bg-card/80 p-4 shadow-sm">
                                <p className="text-2xl font-semibold">24/7</p>
                                <p className="text-sm text-muted-foreground">Marketplace activo</p>
                            </div>
                            <div className="rounded-2xl border bg-card/80 p-4 shadow-sm">
                                <p className="text-2xl font-semibold">Comunidad</p>
                                <p className="text-sm text-muted-foreground">Eventos y torneos</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="relative rounded-3xl border bg-card p-8 shadow-xl overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-sky-500/10" />
                            <div className="relative space-y-4">
                                <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                                    Informe semanal
                                </p>
                                <h2 className="text-2xl font-bold">Top cartas en tendencia</h2>
                                <p className="text-muted-foreground">
                                    Sigue los decks que están dominando y las cartas que todos quieren intercambiar esta semana.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border bg-background/70 p-4">
                                        <p className="text-sm font-semibold">Meta competitivo</p>
                                        <p className="text-muted-foreground text-sm">Actualizaciones rápidas para tus mazos.</p>
                                    </div>
                                    <div className="rounded-2xl border bg-background/70 p-4">
                                        <p className="text-sm font-semibold">Próximos lanzamientos</p>
                                        <p className="text-muted-foreground text-sm">Prepárate para las expansiones que llegan.</p>
                                    </div>
                                </div>
                                <Link href="/news" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                                    Leer todas las noticias →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container py-14">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Eventos</p>
                        <h3 className="text-xl font-semibold mt-2">Crónicas de la comunidad</h3>
                        <p className="text-muted-foreground mt-2">Historias de jugadores, torneos locales y consejos para mejorar tu colección.</p>
                    </div>
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Marketplace</p>
                        <h3 className="text-xl font-semibold mt-2">Compras sin fricción</h3>
                        <p className="text-muted-foreground mt-2">Filtra, guarda y negocia cartas con seguridad en cuestión de minutos.</p>
                    </div>
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Guías</p>
                        <h3 className="text-xl font-semibold mt-2">Aprende lo nuevo</h3>
                        <p className="text-muted-foreground mt-2">Contenido curado para que no te pierdas ningún cambio de reglas o rotación.</p>
                    </div>
                </div>
            </section>

            <div className="pb-16">
                {loadingSales ? (
                    <div className="container text-muted-foreground">Cargando ventas destacadas...</div>
                ) : isError ? (
                    <div className="container text-red-500">No pudimos cargar las ventas. Intenta nuevamente.</div>
                ) : (
                    <SalesGrid
                        sales={sales}
                        limit={6}
                        title="Destacados del marketplace"
                        description="Un vistazo rápido a las cartas que están en vitrina ahora mismo."
                    />
                )}
            </div>
        </div>
    );
}
