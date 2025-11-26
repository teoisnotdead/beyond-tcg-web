import { cn } from "@/lib/utils";
import { Sale } from "@/types/api";
import { SaleCard } from "./sale-card";

interface SalesGridProps {
    sales: Sale[];
    limit?: number;
    title?: string;
    description?: string;
    className?: string;
}

export function SalesGrid({ sales, limit, title, description, className }: SalesGridProps) {
    const items = limit ? sales.slice(0, limit) : sales;

    return (
        <section className={cn("container space-y-6", className)}>
            {(title || description) && (
                <div className="space-y-2">
                    {title && <h2 className="text-2xl font-bold">{title}</h2>}
                    {description && <p className="text-muted-foreground">{description}</p>}
                </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((sale) => (
                    <SaleCard key={sale.id} sale={sale} />
                ))}
            </div>
        </section>
    );
}
