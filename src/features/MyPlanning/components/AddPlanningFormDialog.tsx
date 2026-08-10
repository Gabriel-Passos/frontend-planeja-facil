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

interface AddPlanningFormDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

export function AddPlanningFormDialog({
  open,
  onOpenChange,
}: AddPlanningFormDialogProps) {
  const years = Array.from({ length: 101 }, (_, index) => {
    const year = 2000 + index;

    return {
      label: String(year),
      value: String(year),
    };
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicione o ano</DialogTitle>
          <DialogDescription>
            Aqui você deve informar o ano que deseja registrar seus ganhos e
            suas despesas.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Field>
            <FieldLabel>Ano</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <DialogFooter>
          <div>
            <Button type="button" variant="ghost" onClick={onOpenChange}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
