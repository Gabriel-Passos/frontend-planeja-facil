import type { BadgeColor } from "@/src/components/ui/badge";
import type { Income } from "../types/monthCard.types";

interface TypeInfo {
  label: string;
  color: BadgeColor;
}

const INCOME_TYPE_INFO: Record<Income["type"], TypeInfo> = {
  SALARIO: { label: "Salário", color: "pink" },
  RENDA_EXTRA: { label: "Renda extra", color: "emerald" },
  OUTROS: { label: "Outros", color: "gray" },
};

export function getIncomeTypeInfo(type: Income["type"]): TypeInfo {
  return INCOME_TYPE_INFO[type] ?? { label: type, color: "gray" };
}
