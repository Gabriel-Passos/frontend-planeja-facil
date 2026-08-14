import { Badge } from "@/src/components/ui/badge";
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

interface TransactionItemProps {
  type: "income" | "outcome";
  value: number;
}

export function TransactionItem({ type, value }: TransactionItemProps) {
  const fakeData = [
    {
      id: 0,
      text: "Editar",
      icon: Pen,
      onClick: () => {},
    },
    {
      id: 1,
      text: "Remover",
      icon: Trash2,
      onClick: () => {},
    },
  ];

  function getTransactionType() {
    if (type === "income") {
      return "text-green-600";
    }
    return "text-destructive";
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-stone-50/35 hover:bg-stone-100/50">
      <div className="flex flex-col gap-0.5">
        <p className="font-inter font-medium ">Salário CLT</p>
        <div className="flex items-center gap-2">
          <Badge color="pink">Salário</Badge>
          <p className="font-inter font-normal text-xs text-muted-foreground">
            14/08/26
          </p>
        </div>
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
                {fakeData.map((data) => (
                  <MenubarItem key={data.text} onClick={data.onClick}>
                    <data.icon className="mr-1" /> {data.text}
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
