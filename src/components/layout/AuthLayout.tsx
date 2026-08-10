interface AuthLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md flex flex-col gap-6">
        <img
          src="/images/png/logo-horizontal.png"
          alt="Planeja Fácil"
          className="w-3/6 h-auto mx-auto mb-2"
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-bold">{title}</h1>
          {description && (
            <p className="text-base text-muted-foreground">{description}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
