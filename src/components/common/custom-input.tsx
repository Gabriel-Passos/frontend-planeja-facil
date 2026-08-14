import { type LucideProps } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Field, FieldDescription, FieldLabel } from "../ui/field";

interface CustomInputProps extends React.ComponentProps<"input"> {
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label?: string;
  description?: string;
  hasError?: boolean;
  helperText?: string;
  iconAlign?:
    | "inline-start"
    | "inline-end"
    | "block-start"
    | "block-end"
    | null
    | undefined;
}

export function CustomInput({
  icon: Icon,
  label,
  description,
  hasError,
  helperText,
  iconAlign,
  ...props
}: CustomInputProps) {
  return (
    <Field className="max-w-sm">
      {label && (
        <FieldLabel htmlFor={`custom-input-${label}`}>
          {label} {props.required && <span className="text-red-700">*</span>}
        </FieldLabel>
      )}
      <InputGroup
        className={`h-10 px-1 ${hasError && "border border-destructive"}`}
      >
        <InputGroupInput id={`custom-input-${label}`} {...props} />
        {Icon && (
          <InputGroupAddon align={iconAlign}>
            <Icon className="text-muted-foreground" />
          </InputGroupAddon>
        )}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {helperText && (
        <FieldDescription className="font-inter text-destructive">
          {helperText}
        </FieldDescription>
      )}
    </Field>
  );
}
