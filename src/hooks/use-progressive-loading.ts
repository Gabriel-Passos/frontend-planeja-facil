import { useEffect, useState } from "react";

const MAX_SIMULATED_PROGRESS = 90;
const INCREMENT_INTERVAL_MS = 200;

export function useProgressiveLoading(isLoading: boolean): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        setProgress((prev) => (prev > 0 ? 100 : prev));
      }, 0);

      return () => clearTimeout(timeoutId);
    }

    const resetId = setTimeout(() => setProgress(0), 0);

    const intervalId = setInterval(() => {
      setProgress((prev) => {
        const remaining = MAX_SIMULATED_PROGRESS - prev;
        const step = Math.max(remaining * 0.15, 1);
        return Math.min(prev + step, MAX_SIMULATED_PROGRESS);
      });
    }, INCREMENT_INTERVAL_MS);

    return () => {
      clearTimeout(resetId);
      clearInterval(intervalId);
    };
  }, [isLoading]);

  return progress;
}
