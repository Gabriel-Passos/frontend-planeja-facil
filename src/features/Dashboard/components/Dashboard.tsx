import { DashboardLayout } from "@/src/components/layout/dashboard-layout";
import type { KpiInterface } from "../types/kpi.types";
import { Kpi } from "@/src/components/common/kpi";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Percent,
  PiggyBank,
} from "lucide-react";
import { Separator } from "@/src/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useState } from "react";
import { years } from "../../MyPlanning/utils/createYearsRange";
import { LayoutHeader } from "@/src/components/common/layout-header";

export function Dashboard() {
  const currentYear = new Date().getFullYear();

  const [selectYear, setSelectYear] = useState<number | null>(currentYear);

  const fakeData: KpiInterface[] = [
    {
      id: "0",
      title: "Saldo atual",
      icon: PiggyBank,
      value: 9400,
      variant: "INCOME",
      type: "CURRENCY",
    },
    {
      id: "1",
      title: "Receitas",
      icon: BanknoteArrowUp,
      value: 38500,
      variant: "DEFAULT",
      type: "CURRENCY",
    },
    {
      id: "2",
      title: "Despesas",
      icon: BanknoteArrowDown,
      value: 26400,
      variant: "OUTCOME",
      type: "CURRENCY",
    },
    {
      id: "3",
      title: "Economia",
      icon: Percent,
      value: 31,
      variant: "DEFAULT",
      type: "PERCENT",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <LayoutHeader
          title="Dashboard"
          description="Visão geral das suas finanças."
        />

        <Separator orientation="horizontal" />

        <div className="flex items-center justify-between">
          <p className="text-lg font-medium font-inter">Informações gerais</p>

          <div className="flex items-center gap-2">
            <p className="font-inter text-sm text-muted-foreground">
              Selecione o ano:
            </p>
            <Select
              value={selectYear}
              onValueChange={(value) => setSelectYear(value)}
            >
              <SelectTrigger className="w-44 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {fakeData.map((data) => (
            <Kpi
              key={data.id}
              title={data.title}
              icon={data.icon}
              value={data.value}
              type={data.type}
              variant={data.variant}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
