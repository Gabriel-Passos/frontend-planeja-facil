import { api } from "@/src/lib/api";
import { useCallback } from "react";
import type {
  Expense,
  CreateExpensePayload,
  UpdateExpensePayload,
} from "../types/monthCard.types";
import type { BulkOperationResult } from "@/src/types/bulkOperation.types";

interface UseExpenseMutationsReturn {
  createExpense: (payload: CreateExpensePayload) => Promise<Expense>;
  updateExpense: (
    expenseId: string,
    payload: UpdateExpensePayload,
  ) => Promise<Expense>;
  removeExpense: (expenseId: string) => Promise<{ removedCount: number }>;
  removeManyExpenses: (ids: string[]) => Promise<BulkOperationResult>;
}

export const useExpenseMutations = (
  yearId: string | undefined,
  cardId: string | undefined,
): UseExpenseMutationsReturn => {
  const basePath = `/years/${yearId}/month-cards/${cardId}/expenses`;

  const createExpense = useCallback(
    async (payload: CreateExpensePayload) => {
      const { data } = await api.post<Expense>(basePath, payload);
      return data;
    },
    [basePath],
  );

  const updateExpense = useCallback(
    async (expenseId: string, payload: UpdateExpensePayload) => {
      const { data } = await api.patch<Expense>(
        `${basePath}/${expenseId}`,
        payload,
      );
      return data;
    },
    [basePath],
  );

  const removeExpense = useCallback(
    async (expenseId: string) => {
      const { data } = await api.delete<{ removedCount: number }>(
        `${basePath}/${expenseId}`,
      );
      return data;
    },
    [basePath],
  );

  const removeManyExpenses = useCallback(
    async (ids: string[]) => {
      const { data } = await api.post<BulkOperationResult>(
        `${basePath}/bulk-remove`,
        { ids },
      );
      return data;
    },
    [basePath],
  );

  return { createExpense, updateExpense, removeExpense, removeManyExpenses };
};
