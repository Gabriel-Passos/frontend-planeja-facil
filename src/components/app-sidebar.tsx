import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/src/components/ui/sidebar";
import { AppRoutes } from "../constants/app-routes";
import { Separator } from "./ui/separator";
import { BadgeDollarSign, LayoutDashboard, Trash2, Wallet } from "lucide-react";
import { NavUser } from "./nav-user";
import { useAuth } from "../contexts/AuthContex";
import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: AppRoutes.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        title: "Meu Planejamento",
        url: AppRoutes.MY_PLANNING,
        icon: Wallet,
      },
      {
        title: "Lixeira",
        url: AppRoutes.TRASH,
        icon: Trash2,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-white">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <div className="bg-teal-800 p-2 rounded-lg w-fit">
              <BadgeDollarSign className="text-amber-300" size={24} />
            </div>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-fraunces text-xl font-semibold">
              Planeja <span className="text-teal-800">Fácil</span>
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <Separator orientation="horizontal" />

      <SidebarContent className="gap-1 bg-white">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <Separator orientation="horizontal" />

      <SidebarFooter className="bg-white">
        <NavUser user={{ email: user?.email || "", name: user?.name || "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
