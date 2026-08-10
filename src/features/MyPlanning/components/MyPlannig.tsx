import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { AddPlanningFormDialog } from "./AddPlanningFormDialog";
import { useState } from "react";

export function MyPlanning() {
  const [openAddDialog, setOpenAddDialog] = useState(false);

  function handleOpenAddDialog() {
    setOpenAddDialog(!openAddDialog);
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Meu planejamento</h1>

          <Button type="button" onClick={handleOpenAddDialog}>
            <Plus /> Adicionar ano
          </Button>
        </div>

        <div className="mt-64 flex flex-col gap-8 items-center border rounded w-fit mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 text-center">
            <h6 className="text-lg font-medium text-foreground">
              Comece a planejar seu futuro
            </h6>
            <p className="w-full text-base text-muted-foreground text-center">
              Planeje o seu futuro com antecedência. Adicione os anos que deseja{" "}
              <br />
              acompanhar e visualize como suas receitas, despesas e
              investimentos podem evoluir ao longo do tempo.
            </p>
          </div>

          <Button type="button" onClick={handleOpenAddDialog} className="w-fit">
            <Plus /> Adicionar ano
          </Button>
        </div>
      </div>

      <AddPlanningFormDialog
        open={openAddDialog}
        onOpenChange={handleOpenAddDialog}
      />
    </DashboardLayout>
  );
}
