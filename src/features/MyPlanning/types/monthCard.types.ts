export type MonthStatus = "EMPTY" | "PARTIAL" | "COMPLETED";

export interface MonthStatusEntry {
  id: string | null;
  month: number;
  status: MonthStatus;
}

export interface YearMonthsStatus {
  year: number;
  months: MonthStatusEntry[];
}

export type RecurrenceType = "NONE" | "INSTALLMENT" | "RECURRING";

export interface Income {
  id: string;
  description: string;
  type: "SALARIO" | "RENDA_EXTRA" | "OUTROS";
  value: string; // Decimal do Prisma serializa como string em JSON
  date: string;
  recurrenceType: RecurrenceType;
  groupId: string | null;
  installmentNumber: number | null;
  totalInstallments: number | null;
  groupTotalValue: number | null; // soma de todas as ocorrências do grupo
  createdAt: string;
}

export interface Expense {
  id: string;
  name: string;
  category: string;
  value: string;
  date: string;
  recurrenceType: RecurrenceType;
  groupId: string | null;
  installmentNumber: number | null;
  totalInstallments: number | null;
  groupTotalValue: number | null;
  createdAt: string;
}

// Payloads de request — o que a API espera receber, não o que ela devolve
interface RecurrenceInput {
  recurrent?: boolean;
  inInstallments?: boolean;
  qtdInstallments?: number;
  installmentValue?: number; // valor de CADA parcela, só quando inInstallments
}

export interface CreateIncomePayload extends RecurrenceInput {
  description: string;
  type?: Income["type"];
  value?: number; // opcional quando inInstallments (usa installmentValue)
  date: string;
}

export type UpdateIncomePayload = Partial<CreateIncomePayload>;

export interface CreateExpensePayload extends RecurrenceInput {
  name: string;
  category: string;
  value?: number;
  date: string;
}

export type UpdateExpensePayload = Partial<CreateExpensePayload>;

export interface CardKpi {
  title: string;
  value: number;
}

export interface MonthCard {
  id: string;
  title: string;
  description: string | null;
  month: number;
  yearId: string;
  incomes: Income[];
  expenses: Expense[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
