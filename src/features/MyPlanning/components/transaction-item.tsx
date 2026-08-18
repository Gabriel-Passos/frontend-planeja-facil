import { Badge, type BadgeColor } from "@/src/components/ui/badge";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/src/components/ui/menubar";
import { formatNumberToCurrency } from "@/src/utils/number-format";
import { MoreVertical, Pen, Trash2 } from "lucide-react";
import type { RecurrenceType } from "../types/monthCard.types";
import { getRecurrenceInfo } from "../utils/get-recurrence-info";

interface TransactionItemProps {
  type: "income" | "outcome";
  title: string;
  value: number;
  date: string; // ISO
  badgeLabel: string;
  badgeColor: BadgeColor;
  recurrenceType: RecurrenceType;
  installmentNumber: number | null;
  totalInstallments: number | null;
  groupTotalValue: number | null;
  onEdit?: () => void;
  onRemove?: () => void;
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "UTC",
  });
}

export function TransactionItem({
  type,
  title,
  value,
  date,
  badgeLabel,
  badgeColor,
  recurrenceType,
  installmentNumber,
  totalInstallments,
  groupTotalValue,
  onEdit,
  onRemove,
}: TransactionItemProps) {
  const menuItems = [
    { id: 0, text: "Editar", icon: Pen, onClick: onEdit },
    { id: 1, text: "Remover", icon: Trash2, onClick: onRemove },
  ];

  const recurrenceInfo = getRecurrenceInfo({
    recurrenceType,
    installmentNumber,
    totalInstallments,
  });

  function getTransactionType() {
    if (type === "income") {
      return "text-green-600";
    }
    return "text-destructive";
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-stone-50/35 hover:bg-stone-100/50">
      <div className="flex flex-col gap-0.5">
        <p className="font-inter font-medium">{title}</p>
        <div className="flex items-center gap-2">
          <Badge color={badgeColor}>{badgeLabel}</Badge>
          <p className="font-inter font-normal text-xs text-muted-foreground">
            {formatShortDate(date)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <Badge color={recurrenceInfo.color}>
          <recurrenceInfo.icon />
          {recurrenceInfo.label}
        </Badge>
        {typeof groupTotalValue === "number" && (
          <p className="text-xs text-muted-foreground">
            Total: {formatNumberToCurrency(groupTotalValue)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <p className={`font-ibm-plex-mono font-medium ${getTransactionType()}`}>
          {type === "income"
            ? `+${formatNumberToCurrency(value)}`
            : formatNumberToCurrency(value)}
        </p>

        <Menubar className="border-0">
          <MenubarMenu>
            <MenubarTrigger className="px-0 py-0.5 hover:bg-transparent">
              <MoreVertical
                className="text-muted-foreground hover:text-foreground"
                size={16}
              />
            </MenubarTrigger>

            <MenubarContent className="w-fit">
              <MenubarGroup>
                {menuItems.map((item) => (
                  <MenubarItem key={item.text} onClick={item.onClick}>
                    <item.icon className="mr-1" /> {item.text}
                  </MenubarItem>
                ))}
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
}
