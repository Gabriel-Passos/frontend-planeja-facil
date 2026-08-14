interface ConfirmPasswordRulesProps {
  password: string;
}

export function ConfirmPasswordRules({ password }: ConfirmPasswordRulesProps) {
  const getPasswordRequirements = (password: string) => {
    return {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
  };

  const passwordRequirements = getPasswordRequirements(password);

  return (
    <ul className="text-sm font-inter">
      <li
        className={
          passwordRequirements.minLength
            ? "text-green-600"
            : "text-muted-foreground"
        }
      >
        {passwordRequirements.minLength ? "✓" : "•"} A senha deve ter no mínimo
        8 caracteres.
      </li>

      <li
        className={
          passwordRequirements.uppercase
            ? "text-green-600"
            : "text-muted-foreground"
        }
      >
        {passwordRequirements.uppercase ? "✓" : "•"} A senha deve conter pelo
        menos uma letra maiúscula.
      </li>

      <li
        className={
          passwordRequirements.lowercase
            ? "text-green-600"
            : "text-muted-foreground"
        }
      >
        {passwordRequirements.lowercase ? "✓" : "•"} A senha deve conter pelo
        menos uma letra minúscula.
      </li>

      <li
        className={
          passwordRequirements.number
            ? "text-green-600"
            : "text-muted-foreground"
        }
      >
        {passwordRequirements.number ? "✓" : "•"} A senha deve conter pelo menos
        um número.
      </li>
    </ul>
  );
}
