import { useEffect, useState } from "react";
import { DashboardLayout } from "@/src/components/layout/dashboard-layout";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { useDeletedYears } from "../../MyPlanning/hooks/useDeletedYears";
import { useProgressiveLoading } from "@/src/hooks/use-progressive-loading";
import { toast } from "@/src/components/ui/toast";
import { getErrorMessage } from "@/src/lib/utils/getErrorMessage";
import { DeleteDialog } from "../../../components/common/delete-dialog";
import type { Year } from "../../MyPlanning/types/year.types";
import { formatBulkResultMessage } from "../../MyPlanning/utils/format-bulk-result-message";
import { Checkbox } from "@/src/components/ui/checkbox";
import { YearCard } from "@/src/components/common/year-card";
import { LayoutHeader } from "@/src/components/common/layout-header";

export function Trash() {
  const {
    deletedYears,
    isLoadingDeletedYears,
    deletedYearsError,
    fetchDeletedYears,
    restoreYear,
    permanentlyDeleteYear,
    restoreManyYears,
    permanentlyDeleteManyYears,
  } = useDeletedYears();

  const [openPermanentDeleteDialog, setOpenPermanentDeleteDialog] =
    useState(false);
  const [openBulkPermanentDeleteDialog, setOpenBulkPermanentDeleteDialog] =
    useState(false);
  const [selectedYear, setSelectedYear] = useState<Year>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const progress = useProgressiveLoading(isLoadingDeletedYears);

  const allVisibleSelected =
    deletedYears.length > 0 &&
    deletedYears.every((year) => selectedIds.has(year.id));

  useEffect(() => {
    fetchDeletedYears();
  }, [fetchDeletedYears]);

  function handleOpenPermanentDeleteDialog() {
    setOpenPermanentDeleteDialog(!openPermanentDeleteDialog);
  }

  function handleOpenBulkPermanentDeleteDialog() {
    setOpenBulkPermanentDeleteDialog(!openBulkPermanentDeleteDialog);
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAllVisible() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        deletedYears.forEach((year) => next.delete(year.id));
      } else {
        deletedYears.forEach((year) => next.add(year.id));
      }
      return next;
    });
  }

  async function handleRestore(year: Year) {
    try {
      await restoreYear(year.id);
      toast.add({
        title: "Sucesso",
        description: `O ano ${year.year} foi restaurado.`,
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Erro",
        description: getErrorMessage(
          error,
          "Não foi possível restaurar o ano. Tente novamente.",
        ),
        type: "error",
      });
    }
  }

  async function handleBulkRestore() {
    try {
      const result = await restoreManyYears(Array.from(selectedIds));
      toast.add({
        title:
          result.failed.length === 0 ? "Sucesso" : "Concluído com ressalvas",
        description: formatBulkResultMessage(result, "restaurado(s)"),
        type: result.failed.length === 0 ? "success" : "error",
      });
      setSelectedIds(new Set());
    } catch (error) {
      toast.add({
        title: "Erro",
        description: getErrorMessage(
          error,
          "Não foi possível restaurar os anos selecionados.",
        ),
        type: "error",
      });
    }
  }

  async function handlePermanentlyDelete() {
    if (!selectedYear?.id) return;
    try {
      await permanentlyDeleteYear(selectedYear.id);
      toast.add({
        title: "Sucesso",
        description: `O ano ${selectedYear.year} foi apagado definitivamente.`,
        type: "success",
      });
      handleOpenPermanentDeleteDialog();
    } catch (error) {
      toast.add({
        title: "Erro",
        description: getErrorMessage(
          error,
          "Não foi possível apagar o ano. Tente novamente.",
        ),
        type: "error",
      });
    }
  }

  async function handleBulkPermanentlyDelete() {
    try {
      const result = await permanentlyDeleteManyYears(Array.from(selectedIds));
      toast.add({
        title:
          result.failed.length === 0 ? "Sucesso" : "Concluído com ressalvas",
        description: formatBulkResultMessage(result, "apagado(s)"),
        type: result.failed.length === 0 ? "success" : "error",
      });
      setSelectedIds(new Set());
      handleOpenBulkPermanentDeleteDialog();
    } catch (error) {
      toast.add({
        title: "Erro",
        description: getErrorMessage(
          error,
          "Não foi possível apagar os anos selecionados.",
        ),
        type: "error",
      });
    }
  }

  return (
    <DashboardLayout loading={isLoadingDeletedYears} progress={progress}>
      <div className="flex flex-col gap-6">
        <LayoutHeader
          title="Lixeira"
          description="Restaure os anos ou os remova permanentemente."
        />

        <Separator orientation="horizontal" />

        <div className="flex flex-col gap-6">
          <p className="text-lg font-medium font-inter">Anos</p>

          {deletedYearsError && (
            <p role="alert" className="text-destructive">
              {deletedYearsError}
            </p>
          )}

          {!isLoadingDeletedYears &&
            !deletedYearsError &&
            deletedYears.length === 0 && (
              <p className="text-muted-foreground">Nenhum ano na lixeira.</p>
            )}

          {!deletedYearsError && deletedYears.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={toggleSelectAllVisible}
                    className="bg-white rounded"
                  />
                  Selecionar todos
                </label>

                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      {selectedIds.size} selecionado(s)
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSelectedIds(new Set())}
                    >
                      Limpar seleção
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void handleBulkRestore()}
                    >
                      <RotateCcw className="mr-1" size={16} /> Restaurar
                      selecionados
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleOpenBulkPermanentDeleteDialog}
                    >
                      <Trash2 className="mr-1" size={16} /> Apagar selecionados
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4">
                {deletedYears.map((deletedYear) => (
                  <YearCard
                    key={deletedYear.id}
                    year={deletedYear}
                    checkbox={{
                      checked: selectedIds.has(deletedYear.id),
                      onCheckedChange: () => toggleSelected(deletedYear.id),
                    }}
                    dialog={{
                      items: [
                        {
                          name: "Restaurar",
                          icon: RotateCcw,
                          onClick: () => void handleRestore(deletedYear),
                        },
                        {
                          name: "Remover permanentemente",
                          icon: Trash2,
                          variant: "destructive",
                          onClick: () => {
                            setSelectedYear(deletedYear);
                            handleOpenPermanentDeleteDialog();
                          },
                        },
                      ],
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <DeleteDialog
        title="Apagar definitivamente"
        description="Essa ação não pode ser desfeita. O ano e todos os cards, rendas e despesas relacionados a ele serão apagados para sempre."
        itemToDelete={`Ano ${selectedYear?.year}`}
        onSubmit={handlePermanentlyDelete}
        open={openPermanentDeleteDialog}
        onOpenChange={handleOpenPermanentDeleteDialog}
      />

      <DeleteDialog
        title="Apagar definitivamente"
        description={`Essa ação não pode ser desfeita. Os ${selectedIds.size} anos selecionados, e todos os cards, rendas e despesas relacionados a eles, serão apagados para sempre.`}
        itemToDelete={`${selectedIds.size} ano(s) selecionado(s)`}
        onSubmit={handleBulkPermanentlyDelete}
        open={openBulkPermanentDeleteDialog}
        onOpenChange={handleOpenBulkPermanentDeleteDialog}
      />
    </DashboardLayout>
  );
}
