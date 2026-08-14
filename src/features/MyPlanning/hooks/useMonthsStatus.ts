import { api } from "@/src/lib/api";
import { useCallback, useEffect, useState } from "react";
import type { YearMonthsStatus } from "../types/monthCard.types";

interface UseMonthsStatusReturn {
  months: YearMonthsStatus["months"];
  isLoading: boolean;
  error: string | null;
  refetchMonthsStatus: () => Promise<void>;
}

// Usado na tela de grid do ano (os 12 quadradinhos de mês). Pede o
// status já calculado pelo backend em vez de derivar aqui — a regra de
// EMPTY/PARTIAL/COMPLETED é fonte única de verdade no servidor.
export const useMonthsStatus = (
  yearId: string | undefined,
): UseMonthsStatusReturn => {
  const [months, setMonths] = useState<YearMonthsStatus["months"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMonthsStatus = useCallback(async () => {
    const { data } = await api.get<YearMonthsStatus>(
      `/years/${yearId}/month-cards/status`,
    );
    return data;
  }, [yearId]);

  useEffect(() => {
    if (!yearId) {
      return;
    }

    const resetId = setTimeout(() => {
      setIsLoading(true);
      setError(null);
    }, 0);

    getMonthsStatus()
      .then((result) => {
        setMonths(result.months);
      })
      .catch(() => {
        setError("Não foi possível carregar o status dos meses.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => clearTimeout(resetId);
  }, [getMonthsStatus, yearId]);

  const refetchMonthsStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMonthsStatus();
      setMonths(result.months);
    } catch {
      setError("Não foi possível carregar o status dos meses.");
    } finally {
      setIsLoading(false);
    }
  }, [getMonthsStatus]);

  return { months, isLoading, error, refetchMonthsStatus };
};
