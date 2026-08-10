import { EmailVerificationBanner } from "@/src/components/EmailVerificationBanner";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";

export function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <EmailVerificationBanner />
      </div>
    </DashboardLayout>
  );
}
