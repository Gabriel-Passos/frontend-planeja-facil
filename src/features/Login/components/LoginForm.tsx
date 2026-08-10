import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useAuth } from "@/src/contexts/AuthContex";
import { Link } from "react-router-dom";
import { AppRoutes } from "@/src/constants/app-routes";
import { Field, FieldLabel } from "@/src/components/ui/field";
import { AuthLayout } from "@/src/components/layout/AuthLayout";

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
      title="Bem-vindo de volta!"
      description="Acesse sua conta para acompanhar seus ganhos, controlar suas despesas e manter suas finanças sempre organizadas."
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Field>
              <FieldLabel>E-mail</FieldLabel>
              <Input
                placeholder="exemplo@email.com"
                type="email"
                className={`${formik.touched.email && formik.errors.email ? "border-red-500" : ""}`}
                {...formik.getFieldProps("email")}
              />
            </Field>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Field>
              <FieldLabel>Senha</FieldLabel>
              <Input
                placeholder="Ex: 12345678"
                type="password"
                className={`${formik.touched.password && formik.errors.password ? "border-red-500" : ""}`}
                {...formik.getFieldProps("password")}
              />
            </Field>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500">{formik.errors.password}</p>
            )}
          </div>
        </div>

        <Link
          to="/forgot-password"
          className="w-fit text-sm text-blue-500 hover:underline"
        >
          Esqueceu a senha?
        </Link>

        <Button type="submit" size="lg" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-sm text-center">
          Não tem uma conta?{" "}
          <Link
            to={AppRoutes.REGISTER}
            className="text-blue-500 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
