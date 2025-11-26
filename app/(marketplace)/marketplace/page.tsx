'use client';

import { useState } from "react";
import { SalesGrid } from "@/components/marketplace/sales-grid";
import { useSales } from "@/lib/hooks/use-sales";

export default function MarketplacePage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useSales({ page, limit: 6 });
    const sales = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;

    return (
        <div className="container py-10 space-y-8">
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
                    showPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(nextPage) => setPage(nextPage)}
                />
            )}
        </div>
    );
}
