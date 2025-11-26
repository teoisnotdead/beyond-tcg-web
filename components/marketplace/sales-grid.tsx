import { Fragment, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Sale } from "@/types/api";
import { SaleCard } from "./sale-card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface SalesGridProps {
    sales: Sale[];
    limit?: number;
    title?: string;
    description?: string;
    className?: string;
    showPagination?: boolean;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export function SalesGrid({
    sales,
    limit,
    title,
    description,
    className,
    showPagination = false,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
}: SalesGridProps) {
    const items = limit ? sales.slice(0, limit) : sales;
    const pages = useMemo(() => {
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
    }, [currentPage, totalPages]);

    const handleChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPageChange?.(page);
    };

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= totalPages;

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

            {showPagination && totalPages > 1 && (
                <Pagination className="pt-2">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                aria-disabled={isPrevDisabled}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleChange(currentPage - 1);
                                }}
                                className={isPrevDisabled ? "pointer-events-none opacity-50" : undefined}
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
                                aria-disabled={isNextDisabled}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleChange(currentPage + 1);
                                }}
                                className={isNextDisabled ? "pointer-events-none opacity-50" : undefined}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </section>
    );
}
