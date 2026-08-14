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

export interface Income {
  id: string;
  description: string;
  type: "SALARIO" | "RENDA_EXTRA" | "OUTROS";
  value: string; // Decimal do Prisma serializa como string em JSON
}

export interface Expense {
  id: string;
  name: string;
  category: string;
  value: string;
  installments: number;
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
