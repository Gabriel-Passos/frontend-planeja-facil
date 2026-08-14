import { api } from "@/src/lib/api";
import { useCallback, useEffect, useState } from "react";
import type { MonthCard } from "../types/monthCard.types";

interface UseMonthCardDetailReturn {
  card: MonthCard | null;
  isLoading: boolean;
  error: string | null;
  refetchCard: () => Promise<void>;
}

// A página de planejamento de um mês específico (ex: ao clicar em
// "Maio"). Recebe yearId + cardId da rota.
export const useMonthCardDetail = (
  yearId: string | undefined,
  cardId: string | undefined,
): UseMonthCardDetailReturn => {
  const [card, setCard] = useState<MonthCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCard = useCallback(async () => {
    const { data } = await api.get<MonthCard>(
      `/years/${yearId}/month-cards/${cardId}`,
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

    getCard()
      .then((result) => {
        setCard(result);
      })
      .catch(() => {
        setError("Não foi possível carregar o planejamento do mês.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => clearTimeout(resetId);
  }, [getCard, yearId, cardId]);

  const refetchCard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCard();
      setCard(result);
    } catch {
      setError("Não foi possível carregar o planejamento do mês.");
    } finally {
      setIsLoading(false);
    }
  }, [getCard]);

  return { card, isLoading, error, refetchCard };
};
