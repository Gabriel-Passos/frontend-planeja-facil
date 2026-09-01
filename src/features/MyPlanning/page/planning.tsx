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
import { TransactionItem } from "../components/transaction-item";
import { useState } from "react";
import { RegisterTransactionDialog } from "../components/register-transaction-dialog";
import { useMonthCardDetail } from "../hooks/useMonthCardDetail";
import { useYearDetail } from "../../MyPlanning/hooks/useYearDetail";
import { useExpenseMutations } from "../hooks/useExpenseMutations";
import type {
  CreateExpensePayload,
  CreateIncomePayload,
  Expense,
  Income,
  UpdateExpensePayload,
  UpdateIncomePayload,
} from "../types/monthCard.types";
import { toast } from "@/src/components/ui/toast";
import { getErrorMessage } from "@/src/lib/utils/getErrorMessage";
import { useIncomeMutations } from "../hooks/useIcomeMutations";
import { getIncomeTypeInfo } from "../utils/get-income-type-info";
import { getExpenseCategoryInfo } from "../utils/get-expense-category-info";
import { DeleteDialog } from "@/src/components/common/delete-dialog";

type PendingRemoval =
  { kind: "income"; entry: Income } | { kind: "expense"; entry: Expense };

export function Planning() {
  const { yearId, cardId } = useParams<{ yearId: string; cardId: string }>();

  const {
    card,
    isLoading: isLoadingCard,
    error: cardError,
    refetchCard,
  } = useMonthCardDetail(yearId, cardId);
  const { year } = useYearDetail(yearId);

  const { createIncome, updateIncome, removeIncome } = useIncomeMutations(
    yearId,
    cardId,
  );
  const { createExpense, updateExpense, removeExpense } = useExpenseMutations(
    yearId,
    cardId,
  );

  const [transactionType, setTransactionType] = useState<
    "income" | "outcome" | null
  >(null);
  const [openRegisterDialog, setOpenRegisterDialog] = useState<boolean>(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(
    null,
  );

  function handleOpenCreateDialog(type: "income" | "outcome") {
    setTransactionType(type);
    setEditingIncome(null);
    setEditingExpense(null);
    setOpenRegisterDialog(true);
  }

  function handleOpenEditIncome(income: Income) {
    setTransactionType("income");
    setEditingIncome(income);
    setEditingExpense(null);
    setOpenRegisterDialog(true);
  }

  function handleOpenEditExpense(expense: Expense) {
    setTransactionType("outcome");
    setEditingExpense(expense);
    setEditingIncome(null);
    setOpenRegisterDialog(true);
  }

  function handleCloseRegisterDialog() {
    setOpenRegisterDialog(false);
    setEditingIncome(null);
    setEditingExpense(null);
  }

  async function handleSaveIncome(payload: CreateIncomePayload) {
    await createIncome(payload);
    await refetchCard();
  }

  async function handleSaveExpense(payload: CreateExpensePayload) {
    await createExpense(payload);
    await refetchCard();
  }

  async function handleUpdateIncome(id: string, payload: UpdateIncomePayload) {
    await updateIncome(id, payload);
    await refetchCard();
  }

  async function handleUpdateExpense(
    id: string,
    payload: UpdateExpensePayload,
  ) {
    await updateExpense(id, payload);
    await refetchCard();
  }

  // Abre a confirmação em vez de remover na hora — o texto muda se o
  // item pertence a um grupo (parcela/recorrência), avisando que TODAS
  // as ocorrências relacionadas serão removidas junto.
  function handleRequestRemoveIncome(income: Income) {
    setPendingRemoval({ kind: "income", entry: income });
    setOpenRemoveDialog(true);
  }

  function handleRequestRemoveExpense(expense: Expense) {
    setPendingRemoval({ kind: "expense", entry: expense });
    setOpenRemoveDialog(true);
  }

  function handleCloseRemoveDialog() {
    setOpenRemoveDialog(false);
    setPendingRemoval(null);
  }

  async function handleConfirmRemoval() {
    if (!pendingRemoval) return;

    try {
      const result =
        pendingRemoval.kind === "income"
          ? await removeIncome(pendingRemoval.entry.id)
          : await removeExpense(pendingRemoval.entry.id);

      toast.add({
        title: "Sucesso",
        description:
          result.removedCount > 1
            ? `${result.removedCount} parcelas/ocorrências relacionadas foram removidas.`
            : "Removido com sucesso.",
        type: "success",
      });

      await refetchCard();
      handleCloseRemoveDialog();
    } catch (error) {
      toast.add({
        title: "Erro",
        description: getErrorMessage(
          error,
          "Não foi possível remover. Tente novamente.",
        ),
        type: "error",
      });
    }
  }

  const isPendingRemovalGrouped = Boolean(pendingRemoval?.entry.groupId);
  const pendingRemovalLabel =
    pendingRemoval?.kind === "income"
      ? pendingRemoval.entry.description
      : (pendingRemoval?.entry as Expense | undefined)?.name;

  if (isLoadingCard) {
    return (
      <DashboardLayout loading>
        <p>Carregando...</p>
      </DashboardLayout>
    );
  }

  if (cardError || !card) {
    return (
      <DashboardLayout>
        <p role="alert">{cardError ?? "Card não encontrado."}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <LayoutHeader
          title={`${card.title} de ${year?.year ?? ""}`}
          description="Planejamento financeiro do mês."
        />

        <Separator orientation="horizontal" />

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <Kpi
              title="Entradas"
              type="CURRENCY"
              value={card.totalIncome}
              icon={BanknoteArrowUp}
            />
            <Kpi
              title="Despesas"
              type="CURRENCY"
              value={card.totalExpense}
              icon={BanknoteArrowDown}
            />
            <Kpi
              title="Saldo"
              type="CURRENCY"
              value={card.balance}
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
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleOpenCreateDialog("income")}
                  >
                    <Plus />
                    Adicionar entrada
                  </Button>
                </div>

                <Separator orientation="horizontal" />

                <div className="flex flex-col gap-2">
                  {card.incomes.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      Nenhuma entrada cadastrada neste mês.
                    </p>
                  ) : (
                    card.incomes.map((income) => {
                      const typeInfo = getIncomeTypeInfo(income.type);
                      return (
                        <TransactionItem
                          key={income.id}
                          type="income"
                          title={income.description}
                          value={Number(income.value)}
                          date={income.date}
                          badgeLabel={typeInfo.label}
                          badgeColor={typeInfo.color}
                          recurrenceType={income.recurrenceType}
                          installmentNumber={income.installmentNumber}
                          totalInstallments={income.totalInstallments}
                          groupTotalValue={income.groupTotalValue}
                          onEdit={() => handleOpenEditIncome(income)}
                          onRemove={() => handleRequestRemoveIncome(income)}
                        />
                      );
                    })
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="outcome"
                className="border rounded-xl p-6 bg-white flex flex-col gap-4"
              >
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleOpenCreateDialog("outcome")}
                  >
                    <Plus />
                    Adicionar despesa
                  </Button>
                </div>

                <Separator orientation="horizontal" />

                <div className="flex flex-col gap-2">
                  {card.expenses.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      Nenhuma despesa cadastrada neste mês.
                    </p>
                  ) : (
                    card.expenses.map((expense) => {
                      const categoryInfo = getExpenseCategoryInfo(
                        expense.category,
                      );
                      return (
                        <TransactionItem
                          key={expense.id}
                          type="outcome"
                          title={expense.name}
                          value={-Number(expense.value)}
                          date={expense.date}
                          badgeLabel={categoryInfo.label}
                          badgeColor={categoryInfo.color}
                          recurrenceType={expense.recurrenceType}
                          installmentNumber={expense.installmentNumber}
                          totalInstallments={expense.totalInstallments}
                          groupTotalValue={expense.groupTotalValue}
                          onEdit={() => handleOpenEditExpense(expense)}
                          onRemove={() => handleRequestRemoveExpense(expense)}
                        />
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <RegisterTransactionDialog
        open={openRegisterDialog}
        onOpenChange={handleCloseRegisterDialog}
        transactionType={transactionType}
        cardMonth={card.month}
        cardYear={year?.year ?? new Date().getFullYear()}
        editingIncome={editingIncome}
        editingExpense={editingExpense}
        onSaveIncome={handleSaveIncome}
        onSaveExpense={handleSaveExpense}
        onUpdateIncome={handleUpdateIncome}
        onUpdateExpense={handleUpdateExpense}
      />

      <DeleteDialog
        title="Atenção"
        description={
          isPendingRemovalGrouped
            ? "Esse lançamento faz parte de uma parcela/recorrência. Remover vai apagar TODAS as ocorrências relacionadas (passadas e futuras), não só essa."
            : "Essa ação não pode ser desfeita."
        }
        itemToDelete={pendingRemovalLabel ?? ""}
        onSubmit={handleConfirmRemoval}
        open={openRemoveDialog}
        onOpenChange={handleCloseRemoveDialog}
      />
    </DashboardLayout>
  );
}
