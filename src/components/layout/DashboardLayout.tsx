import { AppSidebar } from "../AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider className="bg-neutral-50">
      <AppSidebar />
      <main className="w-full flex flex-col gap-6">
        <SidebarTrigger />
        <div className="px-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
