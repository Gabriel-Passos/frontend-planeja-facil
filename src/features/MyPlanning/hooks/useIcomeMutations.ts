import { api } from "@/src/lib/api";
import { useCallback } from "react";
import type {
  Income,
  CreateIncomePayload,
  UpdateIncomePayload,
} from "../types/monthCard.types";
import type { BulkOperationResult } from "@/src/types/bulkOperation.types";

interface UseIncomeMutationsReturn {
  createIncome: (payload: CreateIncomePayload) => Promise<Income>;
  updateIncome: (
    incomeId: string,
    payload: UpdateIncomePayload,
  ) => Promise<Income>;
  removeIncome: (incomeId: string) => Promise<{ removedCount: number }>;
  removeManyIncomes: (ids: string[]) => Promise<BulkOperationResult>;
}

// Sem estado próprio — recebe yearId/cardId como parâmetro do hook
// (fixos pra aquele card) e só expõe funções que chamam a API. Depois
// de qualquer mutação, quem usa esse hook chama refetchCard() do
// useMonthCardDetail pra atualizar a tela.
export const useIncomeMutations = (
  yearId: string | undefined,
  cardId: string | undefined,
): UseIncomeMutationsReturn => {
  const basePath = `/years/${yearId}/month-cards/${cardId}/incomes`;

  const createIncome = useCallback(
    async (payload: CreateIncomePayload) => {
      const { data } = await api.post<Income>(basePath, payload);
      return data;
    },
    [basePath],
  );

  const updateIncome = useCallback(
    async (incomeId: string, payload: UpdateIncomePayload) => {
      const { data } = await api.patch<Income>(
        `${basePath}/${incomeId}`,
        payload,
      );
      return data;
    },
    [basePath],
  );

  const removeIncome = useCallback(
    async (incomeId: string) => {
      const { data } = await api.delete<{ removedCount: number }>(
        `${basePath}/${incomeId}`,
      );
      return data;
    },
    [basePath],
  );

  const removeManyIncomes = useCallback(
    async (ids: string[]) => {
      const { data } = await api.post<BulkOperationResult>(
        `${basePath}/bulk-remove`,
        { ids },
      );
      return data;
    },
    [basePath],
  );

  return { createIncome, updateIncome, removeIncome, removeManyIncomes };
};
