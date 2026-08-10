import type { AxiosError } from "axios";

interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Algo deu errado. Tente novamente.",
): string {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const message = axiosError.response?.data?.message;

    if (Array.isArray(message)) {
      return message[0] ?? fallback;
    }
    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
}
