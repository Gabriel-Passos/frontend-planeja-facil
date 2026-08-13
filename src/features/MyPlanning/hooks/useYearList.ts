import { api } from "@/src/lib/api";
import { useCallback, useEffect, useState } from "react";
import type { PaginationMeta, SortOrder, Year } from "../types/year.types";

interface PaginatedYears {
  data: Year[];
  meta: PaginationMeta;
}

interface UseYearsListReturn {
  years: Year[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;

  page: number;
  limit: number;
  order: SortOrder;
  searchInput: string;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setOrder: (order: SortOrder) => void;
  setSearchInput: (value: string) => void;

  refetchYears: () => Promise<void>;
}

const DEBOUNCE_MS = 400;

// Só a tela de listagem de anos deve usar esse hook — ele busca
// automaticamente ao montar e sempre que os filtros mudam.
export const useYearsList = (): UseYearsListReturn => {
  const [years, setYears] = useState<Year[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(16);
  const [order, setOrderState] = useState<SortOrder>("desc");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const setOrder = useCallback((value: SortOrder) => {
    setOrderState(value);
    setPage(1);
  }, []);

  const getYears = useCallback(async () => {
    const params: Record<string, string | number> = { page, limit, order };

    if (search.trim()) {
      params.years = search.trim();
    }

    const { data } = await api.get<PaginatedYears>("/years", { params });
    return data;
  }, [page, limit, order, search]);

  useEffect(() => {
    const resetId = setTimeout(() => {
      setIsLoading(true);
      setError(null);
    }, 0);

    getYears()
      .then((result) => {
        setYears(result.data);
        setMeta(result.meta);
      })
      .catch(() => {
        setError("Não foi possível carregar os anos.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => clearTimeout(resetId);
  }, [getYears]);

  const refetchYears = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getYears();
      setYears(result.data);
      setMeta(result.meta);
    } catch {
      setError("Não foi possível carregar os anos.");
    } finally {
      setIsLoading(false);
    }
  }, [getYears]);

  return {
    years,
    meta,
    isLoading,
    error,
    page,
    limit,
    order,
    searchInput,
    setPage,
    setLimit,
    setOrder,
    setSearchInput,
    refetchYears,
  };
};
