import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Field, FieldLabel } from "@/src/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { years as yearOptions } from "../../utils/createYearsRange";
import { useYear, type Year } from "../../hooks/useYear";
import { toast } from "@/src/components/ui/toast";
import { getErrorMessage } from "@/src/lib/utils/getErrorMessage";

interface YearDialogProps {
  open: boolean;
  onOpenChange: () => void;
  yearToUpdate?: Year;
  existingYears: Year[];
  onSuccess?: () => void;
}

const yearSchema = Yup.object({
  year: Yup.number().required("Informe o ano"),
});

export function YearDialog({
  open,
  onOpenChange,
  yearToUpdate,
  existingYears,
  onSuccess,
}: YearDialogProps) {
  const { addYear, updateYear } = useYear();

  // Anos que o usuário já tem cadastrados, exceto o próprio ano sendo
  // editado (senão o valor atual apareceria desabilitado no modo edição).
  const takenYears = new Set(
    existingYears
      .filter((year) => year.id !== yearToUpdate?.id)
      .map((year) => year.year),
  );

  const formik = useFormik({
    initialValues: { year: yearToUpdate ? yearToUpdate.year : 0 },
    validationSchema: yearSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (yearToUpdate?.id) {
          await updateYear(yearToUpdate.id, values.year);
        } else {
          await addYear(values.year);
        }

        toast.add({
          title: "Sucesso",
          description: `O ano ${values.year} foi ${
            yearToUpdate?.id ? "editado" : "criado"
          } com sucesso.`,
          type: "success",
        });

        onSuccess?.();
        onOpenChange();
      } catch (error) {
        toast.add({
          title: "Erro",
          description: getErrorMessage(
            error,
            "Não foi possível salvar o ano. Tente novamente.",
          ),
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {yearToUpdate?.id ? "Edite o ano" : "Adicione o ano"}
          </DialogTitle>
          <DialogDescription>
            {yearToUpdate?.id
              ? "Informe outro ano para editar."
              : "Aqui você deve informar o ano que deseja registrar seus ganhos e suas despesas."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <Field>
              <FieldLabel>Ano</FieldLabel>
              <Select
                value={
                  formik.values.year ? String(formik.values.year) : undefined
                }
                onValueChange={(value) =>
                  formik.setFieldValue("year", Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {yearOptions.map((year) => {
                      const isTaken = takenYears.has(Number(year.value));

                      return (
                        <SelectItem
                          key={year.value}
                          value={year.value}
                          disabled={isTaken}
                        >
                          {year.label}
                          {isTaken ? " (já cadastrado)" : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.year && formik.errors.year && (
                <p>{formik.errors.year}</p>
              )}
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onOpenChange}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                formik.values.year === 0 ||
                formik.isSubmitting ||
                yearToUpdate?.year === formik.values.year
              }
            >
              {formik.isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
