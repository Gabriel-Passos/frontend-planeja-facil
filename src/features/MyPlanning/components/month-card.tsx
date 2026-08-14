import { CalendarDays, ChevronRight } from "lucide-react";
import type { MonthStatus } from "../types/monthCard.types";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

interface MonthCardProps {
  month: string;
  status: MonthStatus;
  onClick: () => void;
}

export function MonthCard({ month, status, onClick }: MonthCardProps) {
  function renderStatus() {
    switch (status) {
      case "COMPLETED": {
        return <Badge color="green">Preenchido</Badge>;
      }
      case "PARTIAL": {
        return <Badge color="amber">Parcial</Badge>;
      }
      default: {
        return <Badge color="gray">Não preenchido</Badge>;
      }
    }
  }

  function renderStatusDot() {
    const baseStyle = "w-2 h-2 rounded-2xl";
    switch (status) {
      case "COMPLETED": {
        return <div className={`${baseStyle} bg-green-600`} />;
      }
      case "PARTIAL": {
        return <div className={`${baseStyle} bg-amber-400`} />;
      }
      default: {
        return <div className={`${baseStyle} bg-neutral-300`} />;
      }
    }
  }

  return (
    <div className="flex flex-col p-4 border rounded-xl gap-6 bg-white w-full shadow-card">
      <div className="flex items-center justify-between">
        <CalendarDays className="text-muted-foreground" />
        {renderStatusDot()}
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <p className="text-xl font-fraunces font-medium">{month}</p>
          {renderStatus()}
        </div>

        <Button
          type="button"
          variant="link"
          onClick={onClick}
          className="text-teal-800 w-fit p-0 font-inter text-sm font-normal"
        >
          Ver planejamento
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
