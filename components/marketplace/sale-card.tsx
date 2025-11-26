import Image from "next/image";
import Link from "next/link";
import { Sale } from "@/types/api";

const currencyFormatter = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
});

interface SaleCardProps {
    sale: Sale;
}

export function SaleCard({ sale }: SaleCardProps) {
    const numericPrice = typeof sale.price === "string" ? parseFloat(sale.price) : sale.price;
    const displayPrice = Number.isFinite(numericPrice) ? currencyFormatter.format(numericPrice) : sale.price;

    return (
        <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-48 bg-muted">
                {sale.image_url ? (
                    <Image
                        src={sale.image_url}
                        alt={sale.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 320px, 100vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 via-background to-primary/5 text-muted-foreground text-sm">
                        Sin imagen
                    </div>
                )}
                <div className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
                    {sale.status}
                </div>
            </div>
            <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2">{sale.name}</h3>
                    <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                        {sale.language?.name || "Idioma"}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{sale.description}</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xl font-bold text-primary">{displayPrice}</p>
                        <p className="text-xs text-muted-foreground">Stock: {sale.quantity}</p>
                    </div>
                    <Link
                        href={`/marketplace/${sale.id}`}
                        className="inline-flex items-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
                    >
                        Ver detalle
                    </Link>
                </div>
            </div>
        </article>
    );
}
