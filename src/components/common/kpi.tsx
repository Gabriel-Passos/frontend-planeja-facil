import type {
  KpiType,
  KpiVariant,
} from "@/src/features/Dashboard/types/kpi.types";
import { cn } from "@/src/lib/utils/cn";
import type { LucideProps } from "lucide-react";

interface KpiProps {
  title: string;
  value: number | string;
  type?: KpiType;
  variant?: KpiVariant;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export function Kpi({
  title,
  value,
  type,
  variant = "DEFAULT",
  icon: Icon,
}: KpiProps) {
  function randerValue() {
    switch (type) {
      case "CURRENCY": {
        const formatedValue = Intl.NumberFormat("pt-BR", {
          currency: "BRL",
          style: "currency",
        }).format(Number(value));
        return formatedValue;
      }
      case "PERCENT": {
        return `${value}%`;
      }
      default: {
        return value;
      }
    }
  }

  function kpiVariants() {
    const baseStyle = "text-xl font-ibm-plex-mono font-semibold";
    switch (variant) {
      case "INCOME": {
        return `${baseStyle} text-green-600`;
      }
      case "OUTCOME": {
        return `${baseStyle} text-destructive`;
      }
      default: {
        return `${baseStyle} text-foreground`;
      }
    }
  }

  return (
    <div className="p-6 border rounded-xl border-border bg-white flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <p className="font-inter text-muted-foreground">{title}</p>
        {Icon && <Icon className="text-muted-foreground" />}
      </div>

      <p className={cn(kpiVariants())}>{randerValue()}</p>
    </div>
  );
}
