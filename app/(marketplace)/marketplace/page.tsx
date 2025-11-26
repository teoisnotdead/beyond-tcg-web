'use client';

import { SalesGrid } from "@/components/marketplace/sales-grid";
import { useSales } from "@/lib/hooks/use-sales";

export default function MarketplacePage() {
    const { data, isLoading, isError } = useSales({ page: 1, limit: 20 });
    const sales = data?.data ?? [];

    return (
        <div className="container py-10 space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-3">Marketplace</h1>
                <p className="text-lg text-muted-foreground">
                    Explora nuestra colección de cartas.
                </p>
            </div>

            {isLoading ? (
                <p className="text-muted-foreground">Cargando cartas...</p>
            ) : isError ? (
                <p className="text-red-500">No pudimos cargar las cartas. Intenta nuevamente.</p>
            ) : (
                <SalesGrid
                    sales={sales}
                    title="Todas las cartas disponibles"
                    description="Pronto agregaremos filtros, búsqueda y paginación en vivo."
                    className="pb-16"
                />
            )}
        </div>
    );
}
