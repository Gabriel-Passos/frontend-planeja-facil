import { AuthProvider } from "./AuthContex";

interface GlobalContextProps {
    children: React.ReactNode;
}

export function GlobalContextProvider ({ children }: GlobalContextProps) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}