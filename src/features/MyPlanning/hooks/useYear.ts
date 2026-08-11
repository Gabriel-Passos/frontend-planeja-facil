import { api } from "@/src/lib/api";
import { useCallback, useEffect, useState } from "react";

export type Year = {
  id: string;
  year: number;
  // outros campos do seu schema
};

export type SortOrder = "asc" | "desc";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedYears {
  data: Year[];
  meta: PaginationMeta;
}

type UseYearReturn = {
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
  addYear: (year: number) => Promise<void>;
  updateYear: (id: string, year: number) => Promise<void>;
  removeYear: (id: string) => Promise<void>;
  fetchDeletedYears: () => Promise<Year[]>;
  restoreYear: (id: string) => Promise<void>;
  permanentlyDeleteYear: (id: string) => Promise<void>;
};

const DEBOUNCE_MS = 400;

export const useYear = (): UseYearReturn => {
  const [years, setYears] = useState<Year[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [order, setOrderState] = useState<SortOrder>("desc");

  // searchInput: o que o usuário está digitando, atualiza a cada tecla.
  // search: valor "debounced" que de fato dispara a busca na API.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Debounce: só aplica a busca 400ms depois que o usuário parar de digitar,
  // e volta pra página 1 (só quando o valor debounced muda, não a cada tecla).
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Trocar a ordenação também volta pra primeira página.
  const setOrder = useCallback((value: SortOrder) => {
    setOrderState(value);
    setPage(1);
  }, []);

  // Função "pura": só busca, não mexe em estado. Reaproveitada tanto
  // pelo efeito de busca quanto pelo refetch manual (pós-mutação).
  const getYears = useCallback(async () => {
    const params: Record<string, string | number> = { page, limit, order };

    if (search.trim()) {
      params.years = search.trim();
    }

    const { data } = await api.get<PaginatedYears>("/years", { params });
    return data;
  }, [page, limit, order, search]);

  // Refaz a busca sempre que página, limite, ordenação ou busca mudarem.
  useEffect(() => {
    // setTimeout(fn, 0) em vez de chamar setState direto aqui — mesma
    // razão de sempre (react-hooks/set-state-in-effect): o setState só
    // pode acontecer dentro de um callback, nunca sincronamente no efeito.
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

  // Chamado depois de criar/editar/remover/restaurar — recarrega
  // respeitando os filtros/página atuais, sem resetar nada.
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

  const addYear = useCallback(async (year: number) => {
    await api.post<Year>("/years", { year });
  }, []);

  const updateYear = useCallback(async (id: string, year: number) => {
    await api.patch<Year>(`/years/${id}`, { year });
  }, []);

  const removeYear = useCallback(async (id: string) => {
    await api.delete(`/years/${id}`);
  }, []);

  const fetchDeletedYears = useCallback(async () => {
    const { data } = await api.get<Year[]>("/years/deleted");
    return data;
  }, []);

  const restoreYear = useCallback(async (id: string) => {
    await api.post(`/years/${id}/restore`);
  }, []);

  const permanentlyDeleteYear = useCallback(async (id: string) => {
    await api.delete(`/years/${id}/permanent`);
  }, []);

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
    addYear,
    updateYear,
    removeYear,
    fetchDeletedYears,
    restoreYear,
    permanentlyDeleteYear,
  };
};
