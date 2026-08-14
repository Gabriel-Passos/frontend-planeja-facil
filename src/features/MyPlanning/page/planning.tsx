import { Kpi } from "@/src/components/common/kpi";
import { LayoutHeader } from "@/src/components/common/layout-header";
import { DashboardLayout } from "@/src/components/layout/dashboard-layout";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  PiggyBank,
  Plus,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getMonthName } from "../utils/month-names";
import { TransactionItem } from "../components/transaction-item";

export function Planning() {
  const { cardId } = useParams<{ cardId: string }>();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <LayoutHeader
          title={`${getMonthName(1)} de 2026`}
          description="Planejamento financeiro do mês."
        />

        <Separator orientation="horizontal" />

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <Kpi
              title="Entradas"
              type="CURRENCY"
              value={12000}
              icon={BanknoteArrowUp}
            />
            <Kpi
              title="Despenas"
              type="CURRENCY"
              value={6000}
              icon={BanknoteArrowDown}
            />
            <Kpi
              title="Saldo"
              type="CURRENCY"
              value={6000}
              variant="INCOME"
              icon={PiggyBank}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Tabs defaultValue="income" className="w-full gap-4">
              <TabsList className="w-full">
                <TabsTrigger value="income">
                  <BanknoteArrowUp />
                  Entradas
                </TabsTrigger>
                <TabsTrigger value="outcome">
                  <BanknoteArrowDown />
                  Despesas
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="income"
                className="border rounded-xl p-6 bg-white flex flex-col gap-4"
              >
                <div className="flex justify-center">
                  <Button type="button" variant="ghost">
                    <Plus />
                    Adicionar entrada
                  </Button>
                </div>

                <Separator orientation="horizontal" />

                <div className="flex flex-col gap-2">
                  <TransactionItem type="income" value={6000} />
                  <TransactionItem type="income" value={6000} />
                </div>
              </TabsContent>

              <TabsContent
                value="outcome"
                className="border rounded-xl p-6 bg-white flex flex-col gap-4"
              >
                <div className="flex justify-center">
                  <Button type="button" variant="ghost">
                    <Plus />
                    Adicionar despesa
                  </Button>
                </div>

                <Separator orientation="horizontal" />

                <div className="flex flex-col gap-2">
                  <TransactionItem type="outcome" value={-6000} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
