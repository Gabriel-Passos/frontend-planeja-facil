import { DashboardLayout } from "@/src/components/layout/dashboard-layout";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export function Months() {
  const { yearId } = useParams<{ yearId: string }>();

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            <ChevronLeft />
          </Button>
          <h1 className="text-2xl font-semibold">Meses</h1>
        </div>

        <Separator orientation="horizontal" />

        <p className="text-xl font-medium">Ano: {yearId}</p>
      </div>
    </DashboardLayout>
  );
}
