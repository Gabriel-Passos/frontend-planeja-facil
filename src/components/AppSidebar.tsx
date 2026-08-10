import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/src/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { AppRoutes } from "../constants/app-routes";
import { Separator } from "./ui/separator";
import { ChartNoAxesCombined, Home, Trash2 } from "lucide-react";
import { NavUser } from "./NavUser";
import { useAuth } from "../contexts/AuthContex";

const sidebarItems = [
  {
    id: 0,
    title: "Home",
    path: AppRoutes.DASHBOARD,
    icon: Home,
  },
  {
    id: 1,
    title: "Meu Planejamento",
    path: AppRoutes.MY_PLANNING,
    icon: ChartNoAxesCombined,
  },
  {
    id: 2,
    title: "Lixeira",
    path: AppRoutes.TRASH,
    icon: Trash2,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="bg-neutral-50">
        <div className="flex items-center">
          <Link to={AppRoutes.DASHBOARD} className="w-2/3 mx-auto">
            <img
              src="/images/png/logo-horizontal.png"
              alt="Logo Planeja Fácil"
            />
          </Link>
        </div>
      </SidebarHeader>

      <Separator orientation="horizontal" />

      <SidebarContent className="py-6 gap-1 bg-neutral-50">
        {sidebarItems.map(({ icon: Icon, ...sidebarItem }) => (
          <Link
            key={sidebarItem.id}
            to={sidebarItem.path}
            className={`mx-2 rounded-md ${location.pathname === sidebarItem.path && "bg-neutral-100"}`}
          >
            <SidebarGroup
              className={`hover:bg-neutral-100 rounded-md flex flex-row gap-3 items-center cursor-pointer `}
            >
              <Icon size={20} />
              <p className={`text-base font-semibold`}>{sidebarItem.title}</p>
            </SidebarGroup>
          </Link>
        ))}
      </SidebarContent>

      <Separator orientation="horizontal" />

      <SidebarFooter className="bg-neutral-50">
        <NavUser user={{ email: user?.email || "", name: user?.name || "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
