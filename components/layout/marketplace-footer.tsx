import Link from "next/link";

const footerLinks = [
    { href: "/news", label: "Noticias" },
    { href: "/terminos", label: "Términos y condiciones" },
    { href: "/privacidad", label: "Política de privacidad" },
];

export function MarketplaceFooter() {
    return (
        <footer className="border-t border-border/50 bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex flex-col items-center justify-between gap-4 py-8 md:h-24 md:flex-row">
                <div>
                    <p className="text-sm font-semibold text-foreground">Beyond TCG Marketplace</p>
                    <p className="text-sm text-muted-foreground">La casa para coleccionistas, jugadores y curiosos.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {footerLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-primary">
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}
