import { ChevronRight, MoreVertical, type LucideProps } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import type { Year } from "@/src/features/MyPlanning/types/year.types";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "@/src/constants/app-routes";

interface YearCardProps {
  year: Year;
  menu?: {
    onClick: () => void;
  };
  checkbox: {
    onCheckedChange: () => void;
    checked: boolean;
  };
  dialog: {
    items: {
      name: string;
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
      variant?: "default" | "destructive";
      onClick: () => void;
    }[];
  };
}

export function YearCard({ year, menu, checkbox, dialog }: YearCardProps) {
  const navigate = useNavigate();

  function goToYearPage() {
    return navigate(`${AppRoutes.MY_PLANNING}/${year.id}/month-cards`);
  }

  return (
    <div className="flex flex-col p-4 border rounded-xl gap-6 bg-white w-full">
      <div className="flex items-center justify-between">
        <div onClick={(event) => event.stopPropagation()}>
          <Checkbox
            checked={checkbox.checked}
            onCheckedChange={checkbox.onCheckedChange}
            className="bg-white rounded"
          />
        </div>

        <Menubar className="border-0">
          <MenubarMenu>
            <MenubarTrigger
              className="px-0 py-0.5 hover:bg-transparent"
              onClick={menu?.onClick}
            >
              <MoreVertical
                className="text-muted-foreground hover:text-foreground"
                size={16}
              />
            </MenubarTrigger>

            <MenubarContent className="w-fit">
              <h6 className="text-base px-1.5 text-muted-foreground">
                Ano {year.year}
              </h6>

              <MenubarSeparator />

              <MenubarGroup>
                {dialog.items.map(({ icon: Icon, name, variant, onClick }) => (
                  <MenubarItem key={name} onClick={onClick} variant={variant}>
                    <Icon className="mr-1" /> {name}
                  </MenubarItem>
                ))}
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-col">
          <p className="font-inter text-xs text-muted-foreground uppercase">
            Ano
          </p>
          <p className="font-fraunces text-3xl text-foreground font-medium">
            {year.year}
          </p>
        </div>

        <Button
          type="button"
          variant="link"
          onClick={goToYearPage}
          className="text-teal-800 w-fit p-0 font-inter text-sm font-normal"
        >
          Ver planejamento
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
