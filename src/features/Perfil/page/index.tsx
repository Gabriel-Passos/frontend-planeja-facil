import { EmailVerificationBanner } from "@/src/components/email-verification-banner";
import { DashboardLayout } from "@/src/components/layout/dashboard-layout";

export function Profile() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Perfil</h1>
        <EmailVerificationBanner />
      </div>
    </DashboardLayout>
  );
}
