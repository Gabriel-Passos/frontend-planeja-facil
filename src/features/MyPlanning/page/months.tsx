import { DashboardLayout } from "@/src/components/layout/dashboard-layout";
import { Separator } from "@/src/components/ui/separator";
import { useAuth } from "@/src/contexts/AuthContex";
import { useNavigate, useParams } from "react-router-dom";
import { useYearDetail } from "../hooks/useYearDetail";
import { useMonthsStatus } from "../hooks/useMonthsStatus";
import { LayoutHeader } from "@/src/components/common/layout-header";
import { MonthCard } from "../components/month-card";
import { getMonthName } from "../utils/month-names";
import { AppRoutes } from "@/src/constants/app-routes";
import { Pen, UserPlus } from "lucide-react";

export function Months() {
  const navigate = useNavigate();

  const { yearId } = useParams<{ yearId: string }>();
  const { user } = useAuth();

  const {
    year,
    isLoading: isLoadingYear,
    error: yearError,
  } = useYearDetail(yearId);
  const {
    months,
    isLoading: isLoadingMonths,
    error: monthsError,
  } = useMonthsStatus(yearId);

  const isLoading = isLoadingYear || isLoadingMonths;
  const error = yearError ?? monthsError;

  // Papel do usuário logado NESSE ano específico
  const currentMembership = year?.members.find((m) => m.userId === user?.id);
  const isAdmin = currentMembership?.role === "ADMIN";

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <LayoutHeader
          title={`Ano ${year?.year}`}
          description="Organize suas finanças por meses."
          settings={
            isAdmin
              ? [
                  { text: "Editar", icon: Pen, onClick: () => {} },
                  {
                    text: "Convidar",
                    icon: UserPlus,
                    onClick: () => {},
                  },
                ]
              : undefined
          }
        />

        <Separator orientation="horizontal" />

        <div className="flex flex-col gap-6">
          <p className="text-lg font-medium font-inter">Meses</p>

          <div className="grid grid-cols-4 gap-4">
            {months.map((m) => (
              <MonthCard
                key={m.month}
                month={getMonthName(m.month)}
                status={m.status}
                onClick={() =>
                  navigate(
                    `${AppRoutes.MY_PLANNING}/${yearId}/month-cards/${m.id}`,
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
