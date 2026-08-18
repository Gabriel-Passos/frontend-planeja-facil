import { CircleDot, Layers, Repeat, type LucideIcon } from "lucide-react";
import type { BadgeColor } from "@/src/components/ui/badge";
import type { RecurrenceType } from "../types/monthCard.types";

interface RecurrenceInfo {
  label: string;
  icon: LucideIcon;
  color: BadgeColor;
}

interface RecurrenceEntry {
  recurrenceType: RecurrenceType;
  installmentNumber: number | null;
  totalInstallments: number | null;
}

export function getRecurrenceInfo(entry: RecurrenceEntry): RecurrenceInfo {
  if (entry.recurrenceType === "RECURRING") {
    return { label: "Recorrente", icon: Repeat, color: "teal" };
  }

  if (entry.recurrenceType === "INSTALLMENT") {
    return {
      label: `Parcela ${entry.installmentNumber}/${entry.totalInstallments}`,
      icon: Layers,
      color: "amber",
    };
  }

  return { label: "Único", icon: CircleDot, color: "gray" };
}
