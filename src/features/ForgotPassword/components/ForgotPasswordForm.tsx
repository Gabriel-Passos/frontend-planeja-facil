import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { InputErrorMessage } from "@/src/components/InputErrorMessage";
import { Field, FieldLabel } from "@/src/components/ui/field";
import { AuthLayout } from "@/src/components/layout/AuthLayout";

export function ForgotPasswordForm() {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("E-mail inválido").required("Informe o e-mail"),
    }),
    onSubmit: (values) => {
      // Handle forgot password logic here
      console.log("Forgot password request for:", values.email);
    },
  });
  return (
    <AuthLayout
      title="Esqueceu sua senha?"
      description="Não se preocupe. Informe o e-mail cadastrado e enviaremos um link para que você possa criar uma nova senha com segurança."
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Field>
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

        <Button type="submit" size="lg">
          Enviar
        </Button>

        <p className="text-sm text-center">
          Lembrou sua senha?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Faça login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
