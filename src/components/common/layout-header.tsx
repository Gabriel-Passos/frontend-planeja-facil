import { type LucideProps } from "lucide-react";
import { Button } from "../ui/button";

interface LayoutHeaderProps {
  title: string;
  description?: string;
  button?: {
    text: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    onClick: () => void;
  };
}

export function LayoutHeader({
  title,
  description,
  button,
}: LayoutHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-fraunces font-semibold">{title}</h1>
        {description && (
          <h3 className="text-sm font-inter text-muted-foreground">
            {description}
          </h3>
        )}
      </div>

      {button && (
        <Button type="button" onClick={button.onClick} className="text-white">
          <button.icon /> {button.text}
        </Button>
      )}
    </div>
  );
}
