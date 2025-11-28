import { NewsGrid } from "@/components/news/news-grid";
import { newsArticles } from "@/lib/data/news";

export default function NewsPage() {
    return (
        <div className="space-y-10 pb-16">
            <header className="container space-y-3 pt-12">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    Actualizaciones
                </span>
                <h1 className="text-4xl font-bold tracking-tight">Noticias</h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                    Mantente al día con las novedades, lanzamientos y eventos de la comunidad Beyond TCG.
                </p>
            </header>

            <NewsGrid
                articles={newsArticles}
                filterable
                title="Últimas novedades"
                description="Filtra por categoría para seguir lo que pasa en la escena Beyond TCG."
            />
        </div>
    );
}
