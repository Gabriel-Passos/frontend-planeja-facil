import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { useNavigate, useLocation } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const navigate = useNavigate();
  const location = useLocation();

  function getActiveRoute(route: string) {
    if (location.pathname.includes(route)) {
      return "bg-teal-800 text-white";
    }
    return "";
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu className="gap-2">
        {items.map((item) => (
          <Collapsible key={item.title} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger
                className={`w-full rounded-sm ${getActiveRoute(item.url)}`}
              >
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => navigate(item.url)}
                  size="default"
                  className="hover:bg-teal-50 rounded-xs"
                >
                  {item.icon && <item.icon />}
                  <span className="font-inter text-sm">{item.title}</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
