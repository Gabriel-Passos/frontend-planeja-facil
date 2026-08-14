import { api } from "@/src/lib/api";
import { useCallback, useEffect, useState } from "react";
import type { YearDetail } from "../types/year.types";

interface UseYearDetailReturn {
  year: YearDetail | null;
  isLoading: boolean;
  error: string | null;
  refetchYear: () => Promise<void>;
}

// Um ano específico, não uma lista — usado na tela de detalhe do ano
// (onde os 12 meses aparecem). Recebe o yearId da rota.
export const useYearDetail = (
  yearId: string | undefined,
): UseYearDetailReturn => {
  const [year, setYear] = useState<YearDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getYear = useCallback(async () => {
    const { data } = await api.get<YearDetail>(`/years/${yearId}`);
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

    getYear()
      .then((result) => {
        setYear(result);
      })
      .catch(() => {
        setError("Não foi possível carregar o ano.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => clearTimeout(resetId);
  }, [getYear, yearId]);

  const refetchYear = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getYear();
      setYear(result);
    } catch {
      setError("Não foi possível carregar o ano.");
    } finally {
      setIsLoading(false);
    }
  }, [getYear]);

  return { year, isLoading, error, refetchYear };
};
