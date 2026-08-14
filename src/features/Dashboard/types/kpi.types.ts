import type { LucideProps } from "lucide-react";

const KpiType = {
  CURRENCY: "CURRENCY",
  PERCENT: "PERCENT",
} as const;

export type KpiType = (typeof KpiType)[keyof typeof KpiType];

const KpiVariant = {
  DEFAULT: "DEFAULT",
  INCOME: "INCOME",
  OUTCOME: "OUTCOME",
} as const;

export type KpiVariant = (typeof KpiVariant)[keyof typeof KpiVariant];

export interface KpiInterface {
  id: string;
  title: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  variant?: KpiVariant;
  value: string | number;
  type: KpiType;
}
