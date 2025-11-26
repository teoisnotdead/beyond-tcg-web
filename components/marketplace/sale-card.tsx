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

const SALE_STATUS_LABELS: Record<Sale['status'], string> = {
    available: "Disponible",
    reserved: "Reservada",
    shipped: "Enviado",
    delivered: "Entregado",
    completed: "Completado",
    cancelled: "Cancelado",
};

export function SaleCard({ sale }: SaleCardProps) {
    const {
        image_url,
        name,
        description,
        status,
        language,
        quantity,
        price,
        id,
    } = sale;

    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    const displayPrice = Number.isFinite(numericPrice) ? currencyFormatter.format(numericPrice) : price;
    const statusLabel = status ? SALE_STATUS_LABELS[status] ?? status : "Sin estado";

    return (
        <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex gap-4 p-4">
                <div className="relative w-40 shrink-0 overflow-hidden rounded-xl bg-muted aspect-3/4">
                    {image_url ? (
                        <Image
                            src={image_url}
                            alt={name}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(min-width: 1280px) 240px, (min-width: 1024px) 200px, (min-width: 640px) 180px, 60vw"
                            quality={90}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 via-background to-primary/5 text-muted-foreground text-xs">
                            Imagen no encontrada
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/10 to-background/60" />
                    <div className="absolute left-2 top-2 rounded-full bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
                        {statusLabel}
                    </div>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold leading-tight line-clamp-2">{name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                        </div>
                        <span className="rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary h-fit">
                            {language?.name || "Idioma"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-bold text-primary">{displayPrice}</p>
                            <p className="text-xs text-muted-foreground">Stock: {quantity}</p>
                        </div>
                        <Link
                            href={`/marketplace/${id}`}
                            className="inline-flex items-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
                        >
                            Ver detalle
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
