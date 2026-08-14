import { api } from "@/src/lib/api";
import { useCallback } from "react";
import type { BulkOperationResult, Year } from "../types/year.types";

interface UseYearMutationsReturn {
  addYear: (year: number) => Promise<void>;
  updateYear: (id: string, year: number) => Promise<void>;
  removeYear: (id: string) => Promise<void>;
  removeManyYears: (ids: string[]) => Promise<BulkOperationResult>;
}

// Sem estado próprio — só funções que chamam a API. Pode ser usado em
// qualquer componente (dialog, listagem, etc.) sem disparar fetch nenhum.
export const useYearMutations = (): UseYearMutationsReturn => {
  const addYear = useCallback(async (year: number) => {
    await api.post<Year>("/years", { year });
  }, []);

  const updateYear = useCallback(async (id: string, year: number) => {
    await api.patch<Year>(`/years/${id}`, { year });
  }, []);

  const removeYear = useCallback(async (id: string) => {
    await api.delete(`/years/${id}`);
  }, []);

  const removeManyYears = useCallback(async (ids: string[]) => {
    const { data } = await api.post<BulkOperationResult>("/years/bulk/remove", {
      yearIds: ids,
    });
    return data;
  }, []);

  return { addYear, updateYear, removeYear, removeManyYears };
};
