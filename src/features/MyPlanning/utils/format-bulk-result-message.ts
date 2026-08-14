import type { BulkOperationResult } from "../types/year.types";

export function formatBulkResultMessage(
  result: BulkOperationResult,
  verbPastParticiple: string,
): string {
  const parts: string[] = [];

  if (result.succeeded.length > 0) {
    parts.push(
      `${result.succeeded.length} ano(s) ${verbPastParticiple} com sucesso.`,
    );
  }

  if (result.failed.length > 0) {
    parts.push(
      `${result.failed.length} não pôde(ram) ser processado(s): ${result.failed
        .map((f) => f.reason)
        .join(" ")}`,
    );
  }

  return parts.join(" ");
}
