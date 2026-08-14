export function formatNumberToCurrency(value: number) {
  return Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(Number(value));
}
