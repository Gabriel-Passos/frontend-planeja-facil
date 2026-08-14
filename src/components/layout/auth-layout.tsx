import { Link } from "react-router-dom";
import { Logo } from "../common/logo";

interface AuthLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  link?: {
    title?: string;
    href: string;
    buttonText: string;
  };
}

export function AuthLayout({
  title,
  description,
  children,
  link,
}: AuthLayoutProps) {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
      <div className="mx-auto">
        <Logo variant="default" />
      </div>

      <div className="w-full max-w-md p-8 bg-white border rounded-xl shadow-card flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold font-fraunces text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground font-inter">
              {description}
            </p>
          )}
        </div>

        {children}
      </div>

      {link && (
        <div>
          <p className="text-sm text-center text-muted-foreground font-inter">
            {link.title}{" "}
            <Link
              to={link.href}
              className="text-teal-800 hover:underline font-medium"
            >
              {link.buttonText}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
