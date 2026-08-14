import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/contexts/AuthContex";
import { Link } from "react-router-dom";
import { AppRoutes } from "@/src/constants/app-routes";
import { AuthLayout } from "@/src/components/layout/auth-layout";
import { CustomInput } from "@/src/components/common/custom-input";
import { Lock, Mail } from "lucide-react";

const loginSchema = Yup.object({
  email: Yup.string().email("E-mail inválido").required("Informe o e-mail"),
  password: Yup.string().required("Informe a senha"),
});

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values.email, values.password);
        navigate(AppRoutes.DASHBOARD, { replace: true });
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      description="Entre para continuar organizando suas finanças."
      link={{
        title: "Não tem uma conta?",
        buttonText: "Cadastre-se",
        href: AppRoutes.REGISTER,
      }}
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
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

          <CustomInput
            icon={Lock}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="password"
            placeholder="**********"
            label="Senha"
            hasError={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password ? formik.errors.password : ""}
            required
          />
        </div>

        <div className="w-full text-end">
          <Link
            to="/forgot-password"
            className="text-sm text-teal-800 hover:underline font-inter"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" size="xl" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
