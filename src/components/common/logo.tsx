import { BadgeDollarSign } from "lucide-react";

interface LogoProps {
  variant: "extended" | "default" | "icon";
}

export function Logo({ variant }: LogoProps) {
  switch (variant) {
    case "extended": {
      return (
        <div className="flex items-center gap-3">
          <div className="bg-teal-800 p-2 rounded-lg">
            <BadgeDollarSign className="text-amber-300" size={24} />
          </div>

          <h1 className="font-fraunces text-xl font-semibold">
            Planeja <span className="text-teal-800">Fácil</span>
          </h1>
        </div>
      );
    }
    case "icon": {
      return (
        <div className="bg-teal-800 p-2 rounded-lg w-fit">
          <BadgeDollarSign className="text-amber-300" size={24} />
        </div>
      );
    }
    default: {
      return (
        <div className="flex items-center gap-3">
          <div className="bg-teal-800 p-2 rounded-lg">
            <BadgeDollarSign className="text-amber-300" size={24} />
          </div>

          <div className="flex flex-col">
            <h1 className="font-fraunces text-xl font-semibold">Planeja</h1>
            <h1 className="font-fraunces text-xl font-semibold text-teal-800 -mt-2">
              Fácil
            </h1>
          </div>
        </div>
      );
    }
  }
}
