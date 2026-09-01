import { DashboardLayout } from "@/src/components/layout/dashboard-layout";
import { Button } from "@/src/components/ui/button";
import { Pen, Plus, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { Field } from "@/src/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useProgressiveLoading } from "@/src/hooks/use-progressive-loading";

import { toast } from "@/src/components/ui/toast";
import { getErrorMessage } from "@/src/lib/utils/getErrorMessage";
import { Checkbox } from "@/src/components/ui/checkbox";
import { YearCard } from "@/src/components/common/year-card";
import { LayoutHeader } from "@/src/components/common/layout-header";
import { useYearsList } from "../hooks/useYearList";
import { useYearMutations } from "../hooks/useYearMutations";
import type { Year } from "../types/year.types";
import { formatBulkResultMessage } from "../utils/format-bulk-result-message";
import { DeleteDialog } from "@/src/components/common/delete-dialog";
import { YearDialog } from "../components/year-dialog";

const LIMIT_OPTIONS = [8, 16, 24, 32];

export function MyPlanning() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState<Year>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const {
    years,
    meta,
    isLoading,
    error,
    page,
    limit,
    order,
    searchInput,
    setPage,
    setLimit,
    setOrder,
    setSearchInput,
    refetchYears,
  } = useYearsList();

  const { removeYear, removeManyYears } = useYearMutations();

  const progress = useProgressiveLoading(isLoading);

  const hasActiveFilters = searchInput.trim().length > 0;
  const isFirstTimeEmpty =
    !isLoading &&
    !error &&
    years.length === 0 &&
    !hasActiveFilters &&
    page === 1;
  const isFilteredEmpty =
    !isLoading && !error && years.length === 0 && !isFirstTimeEmpty;

  const allVisibleSelected =
    years.length > 0 && years.every((year) => selectedIds.has(year.id));

  function handleOpenDialog() {
    setOpenDialog(!openDialog);
  }

  function handleOpenDeleteDialog() {
    setOpenDeleteDialog(!openDeleteDialog);
  }

  function handleOpenBulkDeleteDialog() {
    setOpenBulkDeleteDialog(!openBulkDeleteDialog);
  }

  // Trocar página/busca/ordenação limpa a seleção — evita manter
  // "selecionados" itens que não estão mais visíveis na tela.
  function handleSearchChange(value: string) {
    setSearchInput(value);
    setSelectedIds(new Set());
  }

  function handleOrderChange(value: "asc" | "desc") {
    setOrder(value);
    setSelectedIds(new Set());
  }

  function handleLimitChange(value: number) {
    setLimit(value);
    setSelectedIds(new Set());
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    setSelectedIds(new Set());
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
        years.forEach((year) => next.delete(year.id));
      } else {
        years.forEach((year) => next.add(year.id));
      }
      return next;
    });
  }

  async function handleRemoveYear() {
    if (!selectedYear?.id) return;
    try {
      await removeYear(selectedYear.id);
      toast.add({
        title: "Sucesso",
        description: `O ano ${selectedYear.year} foi removido.`,
        type: "success",
      });
      handleOpenDeleteDialog();
      await refetchYears();
    } catch (error) {
      toast.add({
        title: "Erro",
        description: getErrorMessage(
          error,
          "Não foi possível remover o ano. Tente novamente.",
        ),
        type: "error",
      });
    }
  }

  async function handleBulkRemove() {
    try {
      const result = await removeManyYears(Array.from(selectedIds));
      toast.add({
        title:
          result.failed.length === 0 ? "Sucesso" : "Concluído com ressalvas",
        description: formatBulkResultMessage(result, "removido(s)"),
        type: result.failed.length === 0 ? "success" : "error",
      });
      setSelectedIds(new Set());
      handleOpenBulkDeleteDialog();
      await refetchYears();
    } catch (error) {
      toast.add({
        title: "Erro",
        description: getErrorMessage(
          error,
          "Não foi possível remover os anos selecionados.",
        ),
        type: "error",
      });
    }
  }

  return (
    <DashboardLayout loading={isLoading} progress={progress}>
      <div className="flex flex-col gap-6">
        <LayoutHeader
          title="Meu planejamento"
          description="Organize suas finanças em anos."
          buttons={[
            {
              text: "Adicionar ano",
              icon: Plus,
              onClick: () => {
                setSelectedYear(undefined);
                handleOpenDialog();
              },
            },
          ]}
        />

        <Separator orientation="horizontal" />

        {isFirstTimeEmpty ? (
          <div className="bg-white mt-64 flex flex-col gap-8 items-center border rounded w-fit mx-auto px-6 py-4">
            <div className="flex flex-col gap-4 text-center">
              <h6 className="text-lg font-medium text-foreground">
                Comece a planejar seu futuro
              </h6>
              <p className="w-full text-base text-muted-foreground text-center">
                Planeje o seu futuro com antecedência. Adicione os anos que
                deseja <br />
                acompanhar e visualize como suas receitas, despesas e
                investimentos podem evoluir ao longo do tempo.
              </p>
            </div>

            <Button
              type="button"
              className="w-fit text-white"
              onClick={() => {
                setSelectedYear(undefined);
                handleOpenDialog();
              }}
            >
              <Plus /> Adicionar ano
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-lg font-medium font-inter">Anos</p>

              <div className="flex items-center gap-3">
                <div className="w-70">
                  <Field>
                    <Input
                      placeholder="Buscar ano (ex: 2025 ou 2020,2022,2025)"
                      type="text"
                      value={searchInput}
                      onChange={(event) =>
                        handleSearchChange(event.target.value)
                      }
                      className="bg-white"
                    />
                  </Field>
                </div>

                <Select
                  value={order}
                  onValueChange={(value) =>
                    handleOrderChange(value as "asc" | "desc")
                  }
                >
                  <SelectTrigger className="w-44 bg-white">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="desc">Mais recente</SelectItem>
                      <SelectItem value="asc">Mais antigo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  value={String(limit)}
                  onValueChange={(value) => handleLimitChange(Number(value))}
                >
                  <SelectTrigger className="w-32 bg-white">
                    <SelectValue placeholder="Por página" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {LIMIT_OPTIONS.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                          {option} por página
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-destructive">
                {error}
              </p>
            )}

            {isFilteredEmpty && (
              <p className="text-muted-foreground text-center py-12">
                Nenhum ano encontrado
                {hasActiveFilters ? " para essa busca" : ""}.
              </p>
            )}

            {!isFilteredEmpty && !error && years.length > 0 && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={toggleSelectAllVisible}
                    className="bg-white rounded"
                  />
                  Selecionar todos nesta página
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
                      variant="destructive"
                      onClick={handleOpenBulkDeleteDialog}
                    >
                      <Trash2 className="mr-1" size={16} /> Remover selecionados
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!isFilteredEmpty && !error && (
              <div className="grid grid-cols-4 gap-4">
                {years.map((year) => (
                  <YearCard
                    key={year.id}
                    year={year}
                    menu={{
                      onClick: () => setSelectedYear(year),
                    }}
                    checkbox={{
                      checked: selectedIds.has(year.id),
                      onCheckedChange: () => toggleSelected(year.id),
                    }}
                    dialog={{
                      items: [
                        {
                          name: "Editar",
                          icon: Pen,
                          onClick: handleOpenDialog,
                        },
                        {
                          name: "Convidar",
                          icon: UserPlus,
                          onClick: () => {},
                        },
                        {
                          name: "Remover",
                          icon: Trash2,
                          variant: "destructive",
                          onClick: handleOpenDeleteDialog,
                        },
                      ],
                    }}
                  />
                ))}
              </div>
            )}

            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Página {meta.page} de {meta.totalPages} ({meta.total} no
                  total)
                </p>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={page >= meta.totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <YearDialog
        open={openDialog}
        onOpenChange={handleOpenDialog}
        yearToUpdate={selectedYear}
        existingYears={years}
        onSuccess={refetchYears}
      />

      <DeleteDialog
        title="Atenção"
        description="O ano selecionado será movido para a lixeira. Você poderá restaurá-lo ou excluí-lo permanentemente depois."
        itemToDelete={`Ano ${selectedYear?.year}`}
        onSubmit={handleRemoveYear}
        open={openDeleteDialog}
        onOpenChange={handleOpenDeleteDialog}
      />

      <DeleteDialog
        title="Atenção"
        description={`Os ${selectedIds.size} anos selecionados serão movidos para a lixeira. Você poderá restaurá-los ou excluí-los permanentemente depois.`}
        itemToDelete={`${selectedIds.size} ano(s) selecionado(s)`}
        onSubmit={handleBulkRemove}
        open={openBulkDeleteDialog}
        onOpenChange={handleOpenBulkDeleteDialog}
      />
    </DashboardLayout>
  );
}
