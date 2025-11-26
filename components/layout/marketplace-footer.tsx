import Link from "next/link";

export function MarketplaceFooter() {
    return (
        <footer className="container flex flex-col items-center justify-between gap-4 py-8 md:h-24 md:flex-row">
            <div>
                <p className="text-sm font-semibold text-foreground">Beyond TCG Marketplace</p>
                <p className="text-sm text-muted-foreground">La casa para coleccionistas, jugadores y curiosos.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <Link href="/news" className="hover:text-primary">Noticias</Link>
                <Link href="/terminos" className="hover:text-primary">Términos y condiciones</Link>
                <Link href="/privacidad" className="hover:text-primary">Política de privacidad</Link>
            </div>
        </footer>
    );
}
