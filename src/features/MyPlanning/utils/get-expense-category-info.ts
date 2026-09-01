import type { BadgeColor } from "@/src/components/ui/badge";

interface CategoryInfo {
  label: string;
  color: BadgeColor;
}

const EXPENSE_CATEGORY_INFO: Record<string, CategoryInfo> = {
  MORADIA: { label: "Moradia", color: "blue" },
  ALIMENTACAO: { label: "Alimentação", color: "orange" },
  TRANSPORTE: { label: "Transporte", color: "cyan" },
  SAUDE: { label: "Saúde", color: "rose" },
  EDUCACAO: { label: "Educação", color: "indigo" },
  LAZER: { label: "Lazer", color: "violet" },
  VESTUARIO: { label: "Vestuário", color: "fuchsia" },
  DIVIDAS: { label: "Dívidas", color: "red" },
  INVESTIMENTOS: { label: "Investimentos", color: "emerald" },
  COMPRAS: { label: "Compras", color: "pink" },
  ASSINATURAS: { label: "Assinaturas", color: "purple" },
  PETS: { label: "Pets", color: "amber" },
  PRESENTES: { label: "Presentes", color: "lime" },
  IMPOSTOS: { label: "Impostos", color: "gray" },
  SEGUROS: { label: "Seguros", color: "sky" },
  VIAGEM: { label: "Viagem", color: "teal" },
  CUIDADOS_PESSOAIS: { label: "Cuidados pessoais", color: "fuchsia" },
  MANUTENCAO: { label: "Manutenção", color: "yellow" },
  DOACOES: { label: "Doações", color: "green" },
  OUTROS: { label: "Outros", color: "gray" },
};

export function getExpenseCategoryInfo(category: string): CategoryInfo {
  return EXPENSE_CATEGORY_INFO[category] ?? { label: category, color: "gray" };
}
