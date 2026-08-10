import { DashboardLayout } from "@/src/components/layout/DashboardLayout";

export function Trash() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Lixeira</h1>

        <p className="w-full border rounded px-4 py-2 border-amber-500 bg-amber-50">
          Os itens listados aqui serão removidos permanentemente após 24 horas,
          caso queira recuperar algum faça isso o quanto antes.
        </p>
      </div>
    </DashboardLayout>
  );
}
