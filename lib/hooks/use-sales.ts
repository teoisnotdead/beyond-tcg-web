import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Sale, SalesResponse } from "@/types/api";

export interface UseSalesParams {
    page?: number;
    limit?: number;
    categories?: string[];
    languages?: string[];
    search?: string;
    enabled?: boolean;
}

export function useSales(params: UseSalesParams = {}) {
    const {
        page = 1,
        limit = 12,
        categories,
        languages,
        search,
        enabled = true,
    } = params;

    return useQuery({
        queryKey: ["sales", { page, limit, categories, languages, search }],
        enabled,
        queryFn: async (): Promise<SalesResponse> => {
            const { data } = await apiClient.get<SalesResponse>("/sales", {
                params: {
                    page,
                    limit,
                    categories: categories?.join(","),
                    languages: languages?.join(","),
                    search,
                },
            });

            const payload = (data as any)?.data ? data : { data: data as unknown as Sale[], total: 0, page, totalPages: 0 };

            const computedTotal = payload.total ?? 0;
            const computedTotalPages = payload.totalPages ?? (limit ? Math.max(1, Math.ceil(computedTotal / limit)) : 1);

            return {
                success: (payload as any).success,
                data: payload.data ?? [],
                total: computedTotal,
                page: payload.page ?? page,
                totalPages: computedTotalPages,
            };
        },
        staleTime: 30_000,
    });
}
