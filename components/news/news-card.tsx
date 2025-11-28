import Image from "next/image";
import Link from "next/link";
import { CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";

const newsDateFormatter = new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

interface NewsCardProps {
    article: NewsArticle;
    className?: string;
}

export function NewsCard({ article, className }: NewsCardProps) {
    const parsedDate = article.date ? new Date(article.date) : null;
    const formattedDate = parsedDate && !Number.isNaN(parsedDate.getTime())
        ? newsDateFormatter.format(parsedDate)
        : article.date;

    return (
        <article className={cn(
            "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl",
            className
        )}>
            <div className="relative h-44 w-full overflow-hidden bg-muted">
                {article.imageUrl ? (
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(min-width: 1280px) 420px, (min-width: 1024px) 360px, (min-width: 640px) 320px, 90vw"
                        quality={90}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 via-background to-primary/5 text-sm text-muted-foreground">
                        Imagen no disponible
                    </div>
                )}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/10 to-background/70" />
                {article.tag && (
                    <div className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
                        {article.tag}
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span className="font-medium text-foreground">{article.author}</span>
                    </div>
                    <span className="h-1 w-1 rounded-full bg-border" aria-hidden />
                    <div className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{formattedDate}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2">
                        {article.title}
                    </h3>
                    {article.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.excerpt}
                        </p>
                    )}
                </div>

                <div className="mt-auto pt-1">
                    {article.href ? (
                        <Link
                            href={article.href}
                            className="inline-flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold transition group-hover:border-primary group-hover:text-primary"
                        >
                            Ver más
                            <span
                                aria-hidden
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            >
                                →
                            </span>
                        </Link>
                    ) : (
                        <span className="inline-flex items-center rounded-lg border border-border/80 bg-muted/30 px-3 py-2 text-sm font-semibold text-muted-foreground">
                            Próximamente
                        </span>
                    )}
                </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-primary/5 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        </article>
    );
}
