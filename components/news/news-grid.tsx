'use client';

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NewsCard } from "./news-card";
import type { NewsArticle } from "@/types/news";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface NewsGridProps {
    articles: NewsArticle[];
    title?: string;
    description?: string;
    className?: string;
    limit?: number;
    filterable?: boolean;
    ctaHref?: string;
    ctaLabel?: string;
    pageSize?: number;
    showPagination?: boolean;
}

const normalizeTag = (value?: string | null) => value?.trim().toLowerCase() ?? "";

export function NewsGrid({
    articles,
    title,
    description,
    className,
    limit,
    filterable = false,
    ctaHref,
    ctaLabel,
    pageSize = 9,
    showPagination = true,
}: NewsGridProps) {
    const tags = useMemo(() => {
        if (!filterable) return [];
        const unique = Array.from(new Set(
            articles
                .map((article) => article.tag)
                .filter(Boolean)
                .map((tag) => normalizeTag(tag))
        ));
        return unique.map((value) => ({
            value,
            label: articles.find((article) => normalizeTag(article.tag) === value)?.tag ?? value,
        }));
    }, [articles, filterable]);

    const [activeTag, setActiveTag] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const filtered = useMemo(() => (
        filterable && activeTag !== "all"
            ? articles.filter((article) => normalizeTag(article.tag) === activeTag)
            : articles
    ), [activeTag, articles, filterable]);

    const shouldPaginate = showPagination && !limit;
    const totalPages = shouldPaginate
        ? Math.max(1, Math.ceil(filtered.length / pageSize))
        : 1;

    useEffect(() => {
        if (!shouldPaginate) return;
        setCurrentPage(1);
    }, [activeTag, shouldPaginate]);

    useEffect(() => {
        if (!shouldPaginate) return;
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages, shouldPaginate]);

    const startIndex = shouldPaginate ? (currentPage - 1) * pageSize : 0;
    const endIndex = shouldPaginate ? startIndex + pageSize : undefined;
    const items = limit
        ? filtered.slice(0, limit)
        : filtered.slice(startIndex, endIndex);

    const pages = useMemo(() => {
        if (!shouldPaginate) return [];
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const visible: number[] = [1];
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 2) {
            end = 3;
        } else if (currentPage >= totalPages - 1) {
            start = totalPages - 2;
        }

        for (let i = start; i <= end; i++) visible.push(i);
        visible.push(totalPages);

        return visible;
    }, [currentPage, shouldPaginate, totalPages]);

    const handleChange = (page: number) => {
        if (!shouldPaginate) return;
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <section className={cn("container space-y-6", className)}>
            {(title || description || ctaHref) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2">
                        {title && <h2 className="text-2xl font-bold">{title}</h2>}
                        {description && <p className="text-muted-foreground">{description}</p>}
                    </div>
                    {ctaHref && (
                        <Link
                            href={ctaHref}
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            {ctaLabel ?? "Ver más noticias"}
                        </Link>
                    )}
                </div>
            )}

            {filterable && tags.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant={activeTag === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTag("all")}
                        className="rounded-full"
                    >
                        Todo
                    </Button>
                    {tags.map((tag) => (
                        <Button
                            key={tag.value}
                            variant={activeTag === tag.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveTag(tag.value)}
                            className="rounded-full"
                        >
                            {tag.label}
                        </Button>
                    ))}
                </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((article) => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </div>

            {shouldPaginate && totalPages > 1 && (
                <Pagination className="pt-2">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                aria-disabled={currentPage <= 1}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleChange(currentPage - 1);
                                }}
                                className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
                            />
                        </PaginationItem>

                        {pages.map((page, idx) => {
                            const prevPage = pages[idx - 1];
                            const showEllipsis = idx > 0 && page - prevPage > 1;
                            return (
                                <Fragment key={page}>
                                    {showEllipsis && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleChange(page);
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                </Fragment>
                            );
                        })}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                aria-disabled={currentPage >= totalPages}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleChange(currentPage + 1);
                                }}
                                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </section>
    );
}
