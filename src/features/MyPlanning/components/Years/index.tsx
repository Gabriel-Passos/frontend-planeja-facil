import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Button } from "@/src/components/ui/button";
import { MoreVertical, Pen, Plus, Trash2, UserPlus } from "lucide-react";
import { YearDialog } from "./YearDialog";
import { useState } from "react";
import { useYear, type Year } from "../../hooks/useYear";
import { Link } from "react-router-dom";
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
import { AppRoutes } from "@/src/constants/app-routes";
import { useProgressiveLoading } from "@/src/hooks/use-progressive-loading";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/src/components/ui/menubar";
import { DeleteDialog } from "../../../../components/DeleteDialog";
import { toast } from "@/src/components/ui/toast";
import { getErrorMessage } from "@/src/lib/utils/getErrorMessage";

const LIMIT_OPTIONS = [6, 12, 24, 48];

export function Years() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState<Year>();

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
    removeYear,
  } = useYear();

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

  function handleOpenDialog() {
    setOpenDialog(!openDialog);
  }

  function handleOpenDeleteDialog() {
    setOpenDeleteDialog(!openDeleteDialog);
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

  return (
    <DashboardLayout loading={isLoading} progress={progress}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Meu planejamento</h1>

          <Button
            type="button"
            onClick={() => {
              setSelectedYear(undefined);
              handleOpenDialog();
            }}
          >
            <Plus /> Adicionar ano
          </Button>
        </div>

        <Separator orientation="horizontal" />

        {isFirstTimeEmpty ? (
          <div className="mt-64 flex flex-col gap-8 items-center border rounded w-fit mx-auto px-6 py-4">
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
              className="w-fit"
              onClick={() => {
                setSelectedYear(undefined);
                handleOpenDialog();
              }}
            >
              <Plus /> Adicionar ano
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-xl font-medium">Anos</p>

              <div className="flex items-center gap-3">
                <div className="w-70">
                  <Field>
                    <Input
                      placeholder="Buscar ano (ex: 2025 ou 2020,2022,2025)"
                      type="text"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      className="bg-white"
                    />
                  </Field>
                </div>

                <Select
                  value={order}
                  onValueChange={(value) => setOrder(value as "asc" | "desc")}
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
                  onValueChange={(value) => {
                    setLimit(Number(value));
                    setPage(1);
                  }}
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

            {!isFilteredEmpty && !error && (
              <div className="flex flex-wrap gap-4">
                {years.map((year) => (
                  <Link
                    to={`${AppRoutes.MY_PLANNING}/${year.id}/month-cards`}
                    key={year.id}
                  >
                    <div
                      key={year.id}
                      className="group relative w-31 h-35 flex flex-col justify-between p-3 border rounded border-blue-500 bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Menubar
                        className="absolute top-0 right-0 p-0 mx-3 my-2 hover:text-blue-700 group-hover:text-white border-0"
                        onClick={(event) => {
                          event.preventDefault();
                        }}
                      >
                        <MenubarMenu>
                          <MenubarTrigger
                            className="px-0 py-0.5 hover:bg-transparent"
                            onClick={() => setSelectedYear(year)}
                          >
                            <MoreVertical className="text-inherit" size={16} />
                          </MenubarTrigger>
                          <MenubarContent>
                            <h6 className="text-base px-1.5 text-muted-foreground">
                              Ano: {year.year}
                            </h6>
                            <MenubarSeparator />
                            <MenubarGroup>
                              <MenubarItem onClick={handleOpenDialog}>
                                <Pen className="mr-1" /> Editar
                              </MenubarItem>
                              <MenubarItem>
                                <UserPlus className="mr-1" /> Convidar
                              </MenubarItem>
                            </MenubarGroup>
                            <MenubarSeparator />
                            <MenubarItem
                              variant="destructive"
                              onClick={handleOpenDeleteDialog}
                            >
                              <Trash2 className="mr-1" /> Delete
                            </MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                      <p className="text-base text-inherit">Ano</p>
                      <p className="text-xl font-medium text-inherit">
                        {year.year}
                      </p>
                    </div>
                  </Link>
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
                    onClick={() => setPage(page - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage(page + 1)}
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
    </DashboardLayout>
  );
}
