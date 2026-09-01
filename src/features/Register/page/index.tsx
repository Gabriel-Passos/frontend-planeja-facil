import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/src/components/ui/button";
import { api } from "@/src/lib/api";
import { AppRoutes } from "@/src/constants/app-routes";
import { AuthLayout } from "@/src/components/layout/auth-layout";
import { CustomInput } from "@/src/components/common/custom-input";
import { Lock, Mail, User } from "lucide-react";
import { ConfirmPasswordRules } from "../components/confirm-password-rules";
import { Field } from "@/src/components/ui/field";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import { useState } from "react";

const registerSchema = Yup.object({
  name: Yup.string().min(2, "Nome muito curto").required("Informe seu nome"),
  email: Yup.string().email("E-mail inválido").required("Informe o e-mail"),
  password: Yup.string()
    .required("A senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número"),
  confirmPassword: Yup.string()
    .required("A confirmação da senha é obrigatória")
    .oneOf([Yup.ref("password")], "As senhas não coincidem"),
});

export function RegisterForm() {
  const navigate = useNavigate();

  const [checkedTerms, setCheckedTerms] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: registerSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formatedValeus = {
          name: values.name,
          email: values.email,
          password: values.password,
        };
        await api.post("/auth/register", formatedValeus);
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
      title="Crie sua conta"
      description="Comece a planejar suas finanças em minutos."
      link={{
        title: "Já tem uma conta?",
        buttonText: "Faça o login",
        href: AppRoutes.LOGIN,
      }}
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <CustomInput
            icon={User}
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="João Silva"
            label="E-mail"
            hasError={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name ? formik.errors.name : ""}
            required
          />

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

          <CustomInput
            icon={Lock}
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="password"
            placeholder="**********"
            label="Confirmar a senha"
            hasError={
              formik.touched.confirmPassword && !!formik.errors.confirmPassword
            }
            helperText={
              formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : ""
            }
            required
          />

          <ConfirmPasswordRules password={formik.values.password} />

          <Field orientation="horizontal" className="my-2">
            <Checkbox
              id="terms-checkbox"
              name="terms-checkbox"
              className="rounded"
              checked={checkedTerms}
              onCheckedChange={setCheckedTerms}
            />
            <Label htmlFor="terms-checkbox">Aceite os termos e condições</Label>
          </Field>
        </div>

        <Button
          type="submit"
          size="xl"
          disabled={!checkedTerms || formik.isSubmitting}
        >
          {formik.isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
