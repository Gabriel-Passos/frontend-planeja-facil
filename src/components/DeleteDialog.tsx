import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteDialogProps {
  title: string;
  description: string;
  itemToDelete?: string | number;
  open: boolean;
  onOpenChange: () => void;
  onSubmit: () => void;
}

export function DeleteDialog(props: DeleteDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>

        <div>
          <p className="text-base font-normal">
            O item a seguir será removido:{" "}
            <span className="font-semibold">{props?.itemToDelete}</span>
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={props.onOpenChange}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={props.onSubmit}>
            <Trash2 /> Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
