import { api } from "@/src/lib/api";
import { useCallback, useState } from "react";
import type { BulkOperationResult, Year } from "../types/year.types";

interface UseDeletedYearsReturn {
  deletedYears: Year[];
  isLoadingDeletedYears: boolean;
  deletedYearsError: string | null;
  fetchDeletedYears: () => Promise<void>;
  restoreYear: (id: string) => Promise<void>;
  permanentlyDeleteYear: (id: string) => Promise<void>;
  restoreManyYears: (ids: string[]) => Promise<BulkOperationResult>;
  permanentlyDeleteManyYears: (ids: string[]) => Promise<BulkOperationResult>;
}

// Nada aqui roda automaticamente — quem usa (a tela de lixeira) decide
// quando chamar fetchDeletedYears, tipicamente no próprio useEffect dela.
export const useDeletedYears = (): UseDeletedYearsReturn => {
  const [deletedYears, setDeletedYears] = useState<Year[]>([]);
  const [isLoadingDeletedYears, setIsLoadingDeletedYears] = useState(false);
  const [deletedYearsError, setDeletedYearsError] = useState<string | null>(
    null,
  );

  const fetchDeletedYears = useCallback(async () => {
    setIsLoadingDeletedYears(true);
    setDeletedYearsError(null);
    try {
      const { data } = await api.get<Year[]>("/years/deleted");
      setDeletedYears(data);
    } catch {
      setDeletedYearsError("Não foi possível carregar os anos excluídos.");
    } finally {
      setIsLoadingDeletedYears(false);
    }
  }, []);

  const restoreYear = useCallback(async (id: string) => {
    await api.post(`/years/${id}/restore`);
    // Some da lista de excluídos assim que restaurado, sem precisar
    // de um refetch completo.
    setDeletedYears((prev) => prev.filter((year) => year.id !== id));
  }, []);

  const permanentlyDeleteYear = useCallback(async (id: string) => {
    await api.delete(`/years/${id}/permanent`);
    setDeletedYears((prev) => prev.filter((year) => year.id !== id));
  }, []);

  const restoreManyYears = useCallback(async (ids: string[]) => {
    const { data } = await api.post<BulkOperationResult>(
      "/years/bulk/restore",
      { yearIds: ids },
    );
    // Só remove da lista local os que tiveram sucesso de verdade —
    // os que falharam continuam visíveis na lixeira.
    const succeededSet = new Set(data.succeeded);
    setDeletedYears((prev) =>
      prev.filter((year) => !succeededSet.has(year.id)),
    );
    return data;
  }, []);

  const permanentlyDeleteManyYears = useCallback(async (ids: string[]) => {
    const { data } = await api.post<BulkOperationResult>(
      "/years/bulk/permanent-delete",
      { yearIds: ids },
    );
    const succeededSet = new Set(data.succeeded);
    setDeletedYears((prev) =>
      prev.filter((year) => !succeededSet.has(year.id)),
    );
    return data;
  }, []);

  return {
    deletedYears,
    isLoadingDeletedYears,
    deletedYearsError,
    fetchDeletedYears,
    restoreYear,
    permanentlyDeleteYear,
    restoreManyYears,
    permanentlyDeleteManyYears,
  };
};
