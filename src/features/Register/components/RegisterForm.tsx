import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { api } from "@/src/lib/api";
import { Link } from "react-router-dom";
import { AppRoutes } from "@/src/constants/app-routes";
import { Field, FieldLabel } from "@/src/components/ui/field";
import { InputErrorMessage } from "@/src/components/InputErrorMessage";
import { AuthLayout } from "@/src/components/layout/AuthLayout";

const registerSchema = Yup.object({
  name: Yup.string().min(2, "Nome muito curto").required("Informe seu nome"),
  email: Yup.string().email("E-mail inválido").required("Informe o e-mail"),
  password: Yup.string()
    .min(8, "A senha precisa de pelo menos 8 caracteres")
    .required("Informe uma senha"),
});

export function RegisterForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await api.post("/auth/register", values);
        navigate(AppRoutes.LOGIN, {
          state: { justRegistered: true },
          replace: true,
        });
      } catch (error) {
        console.error("Register error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout
      title="Comece a cuidar das suas finanças."
      description="Crie sua conta para registrar ganhos, acompanhar despesas e tomar decisões financeiras com mais clareza. O futuro financeiro que você deseja começa com os hábitos de hoje."
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Field className="gap-1">
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input
                placeholder="Ex: João Silva"
                type="text"
                variant={
                  formik.touched.name && formik.errors.name
                    ? "error"
                    : "default"
                }
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <InputErrorMessage message={formik.errors.name} />
              )}
            </Field>
          </div>

          <div className="flex flex-col gap-1">
            <Field className="gap-1">
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                placeholder="exemplo@email.com"
                type="email"
                variant={
                  formik.touched.email && formik.errors.email
                    ? "error"
                    : "default"
                }
                {...formik.getFieldProps("email")}
              />
            </Field>
            {formik.touched.email && formik.errors.email && (
              <InputErrorMessage message={formik.errors.email} />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Field className="gap-1">
              <FieldLabel htmlFor=""> Senha</FieldLabel>
              <Input
                placeholder="Ex: 12345678"
                type="password"
                variant={
                  formik.touched.email && formik.errors.email
                    ? "error"
                    : "default"
                }
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <InputErrorMessage message={formik.errors.password} />
              )}
            </Field>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>

        <p className="text-sm text-center">
          Já tem uma conta?{" "}
          <Link to={AppRoutes.LOGIN} className="text-blue-500 hover:underline">
            Faça login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
