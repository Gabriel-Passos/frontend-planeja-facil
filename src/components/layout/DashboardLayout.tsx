import { AppSidebar } from "../AppSidebar";
import { Progress } from "../ui/progress";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Toaster } from "../ui/toast";

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
    <SidebarProvider className="bg-neutral-50">
      <AppSidebar />
      <main className="w-full flex flex-col gap-3">
        {loading ? (
          <Progress value={progress} />
        ) : (
          <div className="w-full flex flex-col gap-6">
            <SidebarTrigger />
            <div className="w-full max-w-300 mx-auto px-6">
              {children}
              <Toaster />
            </div>
          </div>
        )}
      </main>
    </SidebarProvider>
  );
}
