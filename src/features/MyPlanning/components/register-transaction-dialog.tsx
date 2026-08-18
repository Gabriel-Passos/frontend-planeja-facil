import { CustomInput } from "@/src/components/common/custom-input";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Check, CircleAlert, CircleDot, Layers, Repeat } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getMonthName } from "../utils/month-names";
import { formatNumberToCurrency } from "@/src/utils/number-format";
import type {
  CreateExpensePayload,
  CreateIncomePayload,
  Expense,
  Income,
  RecurrenceType,
  UpdateExpensePayload,
  UpdateIncomePayload,
} from "../types/monthCard.types";
import { getRecurrenceInfo } from "../utils/get-recurrence-info";

const EXPENSE_CATEGORIES = [
  { value: "MORADIA", label: "Moradia" },
  { value: "ALIMENTACAO", label: "Alimentação" },
  { value: "TRANSPORTE", label: "Transporte" },
  { value: "SAUDE", label: "Saúde" },
  { value: "EDUCACAO", label: "Educação" },
  { value: "LAZER", label: "Lazer" },
  { value: "VESTUARIO", label: "Vestuário" },
  { value: "DIVIDAS", label: "Dívidas" },
  { value: "INVESTIMENTOS", label: "Investimentos" },
  { value: "COMPRAS", label: "Compras" },
  { value: "ASSINATURAS", label: "Assinaturas" },
  { value: "PETS", label: "Pets" },
  { value: "PRESENTES", label: "Presentes" },
  { value: "IMPOSTOS", label: "Impostos" },
  { value: "SEGUROS", label: "Seguros" },
  { value: "VIAGEM", label: "Viagem" },
  { value: "CUIDADOS_PESSOAIS", label: "Cuidados pessoais" },
  { value: "MANUTENCAO", label: "Manutenção" },
  { value: "DOACOES", label: "Doações" },
  { value: "OUTROS", label: "Outros" },
] as const;

const INCOME_TYPES = [
  { value: "SALARIO", label: "Salário" },
  { value: "RENDA_EXTRA", label: "Renda extra" },
  { value: "OUTROS", label: "Outros" },
] as const;

interface RegisterTransactionDialogProps {
  open: boolean;
  onOpenChange: () => void;
  transactionType: "income" | "outcome" | null;
  cardMonth: number;
  cardYear: number;
  editingIncome?: Income | null;
  editingExpense?: Expense | null;
  onSaveIncome: (payload: CreateIncomePayload) => Promise<void>;
  onSaveExpense: (payload: CreateExpensePayload) => Promise<void>;
  onUpdateIncome: (id: string, payload: UpdateIncomePayload) => Promise<void>;
  onUpdateExpense: (id: string, payload: UpdateExpensePayload) => Promise<void>;
}

function getInstallmentEndLabel(
  startMonth: number,
  startYear: number,
  totalInstallments: number,
) {
  const zeroBasedEnd = startMonth - 1 + (totalInstallments - 1);
  const endMonth = (zeroBasedEnd % 12) + 1;
  const endYear = startYear + Math.floor(zeroBasedEnd / 12);
  return `${getMonthName(endMonth)}/${endYear}`;
}

function getMonthDateBounds(month: number, year: number) {
  const min = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const max = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { min, max };
}

const outcomeSchema = Yup.object({
  name: Yup.string().required("Informe a descrição"),
  value: Yup.number().when("recurrenceType", {
    is: (val: RecurrenceType) => val !== "INSTALLMENT",
    then: (schema) =>
      schema
        .positive("O valor precisa ser maior que zero")
        .required("Informe o valor"),
  }),
  category: Yup.string().required("Informe a categoria"),
  date: Yup.string().required("Informe a data"),
  recurrenceType: Yup.mixed<RecurrenceType>().oneOf([
    "NONE",
    "RECURRING",
    "INSTALLMENT",
  ]),
  qtdInstallments: Yup.number().when("recurrenceType", {
    is: "INSTALLMENT",
    then: (schema) =>
      schema
        .required("Informe o número de parcelas")
        .min(2, "Parcelamento precisa de pelo menos 2 parcelas"),
  }),
  installmentValue: Yup.number().when("recurrenceType", {
    is: "INSTALLMENT",
    then: (schema) =>
      schema
        .positive("O valor da parcela precisa ser maior que zero")
        .required("Informe o valor da parcela"),
  }),
});

const incomeSchema = Yup.object({
  description: Yup.string().required("Informe o nome"),
  value: Yup.number()
    .positive("O valor precisa ser maior que zero")
    .required("Informe o valor"),
  type: Yup.string().required("Informe o tipo"),
  date: Yup.string().required("Informe a data"),
});

export function RegisterTransactionDialog({
  open,
  onOpenChange,
  transactionType,
  cardMonth,
  cardYear,
  editingIncome,
  editingExpense,
  onSaveIncome,
  onSaveExpense,
  onUpdateIncome,
  onUpdateExpense,
}: RegisterTransactionDialogProps) {
  const { min: minDate, max: maxDate } = getMonthDateBounds(
    cardMonth,
    cardYear,
  );
  const defaultDate = minDate;

  const isEditingExpense = Boolean(editingExpense);
  const isEditingIncome = Boolean(editingIncome);

  const outcomeFormik = useFormik({
    initialValues: {
      name: editingExpense?.name ?? "",
      value: editingExpense ? Number(editingExpense.value) : 0,
      category: editingExpense?.category ?? "",
      date: editingExpense?.date.slice(0, 10) ?? defaultDate,
      recurrenceType:
        editingExpense?.recurrenceType ?? ("NONE" as RecurrenceType),
      qtdInstallments: editingExpense?.totalInstallments ?? 2,
      installmentValue: editingExpense ? Number(editingExpense.value) : 0,
    },
    validationSchema: outcomeSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (editingExpense) {
          // Edição não mexe em recorrência/parcelamento — só o conteúdo.
          // Sincronizar as outras parcelas do grupo ainda não é suportado.
          const payload: UpdateExpensePayload = {
            name: values.name,
            value: values.value,
            category: values.category,
            date: values.date,
          };
          await onUpdateExpense(editingExpense.id, payload);
        } else {
          const payload: CreateExpensePayload = {
            name: values.name,
            value:
              values.recurrenceType === "INSTALLMENT"
                ? undefined
                : values.value,
            category: values.category,
            date: values.date,
            recurrent: values.recurrenceType === "RECURRING",
            inInstallments: values.recurrenceType === "INSTALLMENT",
            qtdInstallments:
              values.recurrenceType === "INSTALLMENT"
                ? values.qtdInstallments
                : undefined,
            installmentValue:
              values.recurrenceType === "INSTALLMENT"
                ? values.installmentValue
                : undefined,
          };
          await onSaveExpense(payload);
        }
        resetForm();
        onOpenChange();
      } finally {
        setSubmitting(false);
      }
    },
  });

  const incomeFormik = useFormik({
    initialValues: {
      description: editingIncome?.description ?? "",
      value: editingIncome ? Number(editingIncome.value) : 0,
      type: editingIncome?.type ?? "",
      date: editingIncome?.date.slice(0, 10) ?? defaultDate,
    },
    validationSchema: incomeSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (editingIncome) {
          const payload: UpdateIncomePayload = {
            description: values.description,
            value: values.value,
            type: values.type as UpdateIncomePayload["type"],
            date: values.date,
          };
          await onUpdateIncome(editingIncome.id, payload);
        } else {
          const payload: CreateIncomePayload = {
            description: values.description,
            value: values.value,
            type: values.type as CreateIncomePayload["type"],
            date: values.date,
          };
          await onSaveIncome(payload);
        }
        resetForm();
        onOpenChange();
      } finally {
        setSubmitting(false);
      }
    },
  });

  const recurrenceButtons = [
    {
      id: 0,
      text: "Único",
      icon: CircleDot,
      onClick: () => outcomeFormik.setFieldValue("recurrenceType", "NONE"),
      active: outcomeFormik.values.recurrenceType === "NONE",
    },
    {
      id: 1,
      text: "Recorrente",
      icon: Repeat,
      onClick: () => outcomeFormik.setFieldValue("recurrenceType", "RECURRING"),
      active: outcomeFormik.values.recurrenceType === "RECURRING",
    },
    {
      id: 2,
      text: "Parcelado",
      icon: Layers,
      onClick: () =>
        outcomeFormik.setFieldValue("recurrenceType", "INSTALLMENT"),
      active: outcomeFormik.values.recurrenceType === "INSTALLMENT",
    },
  ];

  const isOutcome = transactionType === "outcome";
  const activeFormik = isOutcome ? outcomeFormik : incomeFormik;
  const isEditing = isOutcome ? isEditingExpense : isEditingIncome;

  function renderDialogContent() {
    if (isOutcome) {
      return (
        <>
          <CustomInput
            type="text"
            placeholder="Ex: Notebook"
            label="Descrição"
            {...outcomeFormik.getFieldProps("name")}
          />
          {outcomeFormik.touched.name && outcomeFormik.errors.name && (
            <p className="text-xs text-destructive">
              {outcomeFormik.errors.name}
            </p>
          )}

          <div className="flex items-center gap-2">
            {outcomeFormik.values.recurrenceType !== "INSTALLMENT" && (
              <CustomInput
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                label="Valor"
                {...outcomeFormik.getFieldProps("value")}
              />
            )}
            <CustomInput
              type="date"
              label="Data"
              min={minDate}
              max={maxDate}
              {...outcomeFormik.getFieldProps("date")}
            />
          </div>
          {outcomeFormik.values.recurrenceType !== "INSTALLMENT" &&
            outcomeFormik.touched.value &&
            outcomeFormik.errors.value && (
              <p className="text-xs text-destructive">
                {outcomeFormik.errors.value}
              </p>
            )}
          {outcomeFormik.touched.date && outcomeFormik.errors.date && (
            <p className="text-xs text-destructive">
              {outcomeFormik.errors.date}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Categoria</p>
            <Select
              value={outcomeFormik.values.category}
              onValueChange={(value) =>
                outcomeFormik.setFieldValue("category", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-foreground font-inter font-medium">
              Tipo de lançamento
            </p>

            {isEditingExpense ? (
              // O tipo (único/recorrente/parcelado) não pode mudar aqui —
              // mas os campos abaixo (nome/categoria/valor) SIM propagam
              // pra todas as parcelas/ocorrências do grupo ao salvar.
              (() => {
                const info = getRecurrenceInfo({
                  recurrenceType: outcomeFormik.values.recurrenceType,
                  installmentNumber: editingExpense?.installmentNumber ?? null,
                  totalInstallments: editingExpense?.totalInstallments ?? null,
                });
                return (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge color={info.color}>
                        <info.icon />
                        {info.label}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Não é possível alterar o tipo de lançamento ao editar.
                      </p>
                    </div>
                    {editingExpense?.groupId && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-300 rounded-lg px-3 py-2">
                        Nome, categoria e valor serão aplicados a{" "}
                        <span className="font-bold">
                          todas as{" "}
                          {editingExpense.totalInstallments ?? "outras"}{" "}
                          ocorrências
                        </span>{" "}
                        deste grupo, não só a essa.
                      </p>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="flex flex-col gap-2">
                {recurrenceButtons.map(
                  ({ id, text, icon: Icon, onClick, active }) => (
                    <Button
                      key={id}
                      type="button"
                      variant="outline"
                      onClick={onClick}
                      className={`h-16 flex flex-col gap-1 items-center w-full hover:border-green-700 hover:bg-green-50 hover:text-green-700 ${active ? "border-green-700 bg-green-50 text-green-700" : ""}`}
                    >
                      <Icon />
                      <p>{text}</p>
                    </Button>
                  ),
                )}
              </div>
            )}
          </div>
        </>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <CustomInput
          type="text"
          placeholder="Ex: Salário"
          label="Nome"
          {...incomeFormik.getFieldProps("description")}
        />
        {incomeFormik.touched.description &&
          incomeFormik.errors.description && (
            <p className="text-xs text-destructive">
              {incomeFormik.errors.description}
            </p>
          )}

        <div className="flex items-center gap-2">
          <CustomInput
            type="number"
            min={0}
            step={0.01}
            placeholder="0,00"
            label="Valor"
            {...incomeFormik.getFieldProps("value")}
          />
          <CustomInput
            type="date"
            label="Data"
            min={minDate}
            max={maxDate}
            {...incomeFormik.getFieldProps("date")}
          />
        </div>
        {incomeFormik.touched.value && incomeFormik.errors.value && (
          <p className="text-xs text-destructive">
            {incomeFormik.errors.value}
          </p>
        )}
        {incomeFormik.touched.date && incomeFormik.errors.date && (
          <p className="text-xs text-destructive">{incomeFormik.errors.date}</p>
        )}

        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Tipo</p>
          <Select
            value={incomeFormik.values.type}
            onValueChange={(value) => incomeFormik.setFieldValue("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {INCOME_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {editingIncome?.groupId && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-300 rounded-lg px-3 py-2">
            Nome, tipo e valor serão aplicados a{" "}
            <span className="font-bold">
              todas as {editingIncome.totalInstallments ?? "outras"} ocorrências
            </span>{" "}
            deste grupo, não só a essa.
          </p>
        )}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar" : "Adicionar"}{" "}
            {transactionType === "income" ? "Entrada" : "Despesa"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={activeFormik.handleSubmit}
          className="w-full flex flex-col gap-4"
        >
          {renderDialogContent()}

          {isOutcome &&
            !isEditingExpense &&
            outcomeFormik.values.recurrenceType === "RECURRING" && (
              <div className="flex flex-col gap-2 border border-border bg-stone-50 px-3 py-2 rounded-lg">
                <CircleAlert className="text-muted-foreground" size={18} />
                <p className="font-inter text-xs text-muted-foreground text-justify">
                  Esse lançamento será replicado automaticamente todo mês, sem
                  data de término. Você pode encerrar a recorrência quando
                  quiser.
                </p>
              </div>
            )}

          {isOutcome &&
            !isEditingExpense &&
            outcomeFormik.values.recurrenceType === "INSTALLMENT" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <CustomInput
                    type="number"
                    min={0.01}
                    step={0.01}
                    placeholder="0,00"
                    label="Valor da parcela"
                    {...outcomeFormik.getFieldProps("installmentValue")}
                  />
                  <CustomInput
                    type="number"
                    min={2}
                    label="Número de parcelas"
                    {...outcomeFormik.getFieldProps("qtdInstallments")}
                  />
                </div>
                {outcomeFormik.touched.installmentValue &&
                  outcomeFormik.errors.installmentValue && (
                    <p className="text-xs text-destructive">
                      {outcomeFormik.errors.installmentValue}
                    </p>
                  )}
                {outcomeFormik.touched.qtdInstallments &&
                  outcomeFormik.errors.qtdInstallments && (
                    <p className="text-xs text-destructive">
                      {outcomeFormik.errors.qtdInstallments}
                    </p>
                  )}

                <div className="flex flex-col gap-2 bg-amber-50 border border-amber-400 rounded-lg text-amber-800 px-3 py-2">
                  <CircleAlert className="text-amber-600" size={18} />
                  <p className="font-inter text-xs text-justify">
                    Essa despesa será registrada em{" "}
                    <span className="font-bold">
                      {outcomeFormik.values.qtdInstallments} parcelas
                    </span>{" "}
                    de{" "}
                    <span className="font-bold">
                      {formatNumberToCurrency(
                        outcomeFormik.values.installmentValue,
                      )}
                    </span>{" "}
                    (total de{" "}
                    <span className="font-bold">
                      {formatNumberToCurrency(
                        outcomeFormik.values.installmentValue *
                          outcomeFormik.values.qtdInstallments,
                      )}
                    </span>
                    ), de{" "}
                    <span className="font-bold">
                      {getMonthName(cardMonth)}/{cardYear}
                    </span>{" "}
                    até{" "}
                    <span className="font-bold">
                      {getInstallmentEndLabel(
                        cardMonth,
                        cardYear,
                        outcomeFormik.values.qtdInstallments,
                      )}
                    </span>
                    . Se o parcelamento passar pro ano seguinte, criamos o
                    planejamento daquele ano automaticamente.
                  </p>
                </div>
              </div>
            )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onOpenChange}>
              Cancelar
            </Button>
            <Button type="submit" disabled={activeFormik.isSubmitting}>
              <Check /> {activeFormik.isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
