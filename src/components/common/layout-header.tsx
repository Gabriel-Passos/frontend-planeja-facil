import { MoreVertical, type LucideProps } from "lucide-react";
import { Button } from "../ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";

interface LayoutHeaderProps {
  title: string;
  description?: string;
  buttons?: {
    text: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    variant?:
      | "link"
      | "default"
      | "outline"
      | "secondary"
      | "ghost"
      | "destructive"
      | null;
    onClick: () => void;
  }[];
  settings?: {
    text: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    variant?: "default" | "destructive";
    onClick: () => void;
  }[];
}

export function LayoutHeader({
  title,
  description,
  buttons,
  settings,
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

      {buttons?.length && (
        <div className="flex items-center gap-2">
          {buttons.map((button) => (
            <Button
              key={button.text}
              type="button"
              variant={button.variant}
              onClick={button.onClick}
            >
              <button.icon /> {button.text}
            </Button>
          ))}
        </div>
      )}

      {settings?.length && (
        <Menubar className="border-0">
          <MenubarMenu>
            <MenubarTrigger className="px-0 py-0.5 hover:bg-transparent">
              <MoreVertical
                className="text-muted-foreground hover:text-foreground"
                size={16}
              />
            </MenubarTrigger>

            <MenubarContent className="w-fit">
              <MenubarGroup>
                {settings.map((setting) => (
                  <MenubarItem
                    key={setting.text}
                    onClick={setting.onClick}
                    variant={setting.variant}
                  >
                    <setting.icon className="mr-1" /> {setting.text}
                  </MenubarItem>
                ))}
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}
    </div>
  );
}
