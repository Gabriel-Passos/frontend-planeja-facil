import { useAuth } from "@/src/contexts/AuthContex";
import { AlertCircle } from "lucide-react";

export function EmailVerificationBanner() {
  const { user } = useAuth();

  if (!user || user.isEmailVerified) {
    return null;
  }

  return (
    <div
      role="status"
      className="border rounded px-4 py-2 border-amber-500 bg-amber-50 flex flex-col gap-3 w-fit"
    >
      <AlertCircle size={20} className="text-amber-500" />
      <p className="text-base text-foreground font">
        Confirme seu e-mail pra garantir acesso completo à sua conta. Verifique
        sua caixa de entrada.
      </p>
    </div>
  );
}
