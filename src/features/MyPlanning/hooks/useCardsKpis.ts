import { api } from "@/src/lib/api";
import { useCallback, useEffect, useState } from "react";
import type { CardKpi } from "../types/monthCard.types";

interface UseCardKpisReturn {
  kpis: CardKpi[];
  isLoading: boolean;
  error: string | null;
  refetchKpis: () => Promise<void>;
}

// Uso pontual: uma tela que só precisa da faixa de KPIs (total de
// receitas/despesas/saldo), sem carregar as listas completas de
// lançamentos. Se a tela já usa useMonthCardDetail, prefira os totais
// que já vêm nele (totalIncome/totalExpense/balance) em vez de chamar
// esse hook em paralelo — evita uma segunda chamada de API redundante.
export const useCardKpis = (
  yearId: string | undefined,
  cardId: string | undefined,
): UseCardKpisReturn => {
  const [kpis, setKpis] = useState<CardKpi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getKpis = useCallback(async () => {
    const { data } = await api.get<CardKpi[]>(
      `/years/${yearId}/month-cards/${cardId}/kpis`,
    );
    return data;
  }, [yearId, cardId]);

  useEffect(() => {
    if (!yearId || !cardId) {
      return;
    }

    const resetId = setTimeout(() => {
      setIsLoading(true);
      setError(null);
    }, 0);

    getKpis()
      .then((result) => {
        setKpis(result);
      })
      .catch(() => {
        setError("Não foi possível carregar os KPIs.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => clearTimeout(resetId);
  }, [getKpis, yearId, cardId]);

  const refetchKpis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getKpis();
      setKpis(result);
    } catch {
      setError("Não foi possível carregar os KPIs.");
    } finally {
      setIsLoading(false);
    }
  }, [getKpis]);

  return { kpis, isLoading, error, refetchKpis };
};
