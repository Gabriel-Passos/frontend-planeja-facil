import { Button } from "@/src/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthLayout } from "@/src/components/layout/auth-layout";
import { CustomInput } from "@/src/components/common/custom-input";
import { Mail } from "lucide-react";
import { AppRoutes } from "@/src/constants/app-routes";

export function ForgotPasswordForm() {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("E-mail inválido").required("Informe o e-mail"),
    }),
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      // Handle forgot password logic here
      console.log("Forgot password request for:", values.email);
    },
  });

  return (
    <AuthLayout
      title="Esqueceu sua senha?"
      description="Informe seu e-mail e enviaremos instruções para redefinir sua senha."
      link={{
        title: "Lembrou sua senha?",
        buttonText: "Faça o login",
        href: AppRoutes.LOGIN,
      }}
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <CustomInput
            icon={Mail}
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="email"
            placeholder="example@email.com"
            label="E-mail"
            hasError={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email ? formik.errors.email : ""}
            required
          />
        </div>

        <Button type="submit" size="xl" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
