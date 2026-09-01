import { AppSidebar } from "../app-sidebar";
import { Progress } from "../ui/progress";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

interface DashboardLayoutProps {
  loading?: boolean;
  progress?: number;
  children: React.ReactNode;
}

export function DashboardLayout({
  loading,
  progress = 0,
  children,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="w-full flex flex-col gap-3 h-full bg-stone-50 pb-6">
          {loading ? (
            <Progress value={progress} />
          ) : (
            <div className="w-full flex flex-col gap-6">
              <SidebarTrigger />
              <div className="w-full max-w-400 mx-auto px-6">{children}</div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
