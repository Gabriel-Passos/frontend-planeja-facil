import { cn } from "@/src/lib/utils/cn";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-500 [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        success: "bg-green-100 text-green-500 [a]:hover:bg-green/80",
        warning: "bg-amber-100 text-amber-500 [a]:hover:bg-amber/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Paleta pra uso livre (ex: categorias). Cada entrada é uma string
// literal completa — nunca montada em runtime — pro Tailwind conseguir
// detectar e gerar essas classes durante o build.
//
// O tom do texto foi ajustado cor a cor, não copiado do mesmo número
// pra todas: cores naturalmente "claras" (amarelo, lima, âmbar, ciano)
// precisam de um tom de texto mais escuro que cores naturalmente
// "escuras" (azul, roxo, vermelho) pra manter contraste parecido em
// todas as opções, apesar dos fundos serem igualmente suaves (-100).
export const BADGE_COLORS = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "gray",
] as const;

export type BadgeColor = (typeof BADGE_COLORS)[number];

const badgeColorClasses: Record<BadgeColor, string> = {
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  amber: "bg-amber-100 text-amber-800",
  yellow: "bg-yellow-100 text-yellow-800",
  lime: "bg-lime-100 text-lime-800",
  green: "bg-green-100 text-green-700",
  emerald: "bg-emerald-100 text-emerald-700",
  teal: "bg-teal-100 text-teal-700",
  cyan: "bg-cyan-100 text-cyan-800",
  sky: "bg-sky-100 text-sky-700",
  blue: "bg-blue-100 text-blue-700",
  indigo: "bg-indigo-100 text-indigo-700",
  violet: "bg-violet-100 text-violet-700",
  purple: "bg-purple-100 text-purple-700",
  fuchsia: "bg-fuchsia-100 text-fuchsia-700",
  pink: "bg-pink-100 text-pink-700",
  rose: "bg-rose-100 text-rose-700",
  gray: "bg-gray-100 text-gray-700",
};

function Badge({
  className,
  variant = "default",
  color,
  render,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { color?: BadgeColor }) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        // Quando "color" é informado, ele sobrescreve o bg/text do
        // variant (o cn()/tailwind-merge resolve o conflito mantendo
        // a última classe do mesmo tipo — a cor customizada vence).
        className: cn(
          badgeVariants({ variant: color ? "default" : variant }),
          color && badgeColorClasses[color],
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
      color,
    },
  });
}

export { Badge, badgeVariants };
