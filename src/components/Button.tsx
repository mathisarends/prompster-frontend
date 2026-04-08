interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "lg" | "md" | "sm";
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "lg",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const base =
    "font-bold rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-white shadow-[0_0_20px_var(--color-primary-glow)] hover:shadow-[0_0_35px_var(--color-primary-glow)] hover:brightness-110",
    secondary:
      "border-2 border-primary text-primary bg-transparent hover:bg-primary/10 hover:shadow-[0_0_20px_var(--color-primary-glow)]",
    ghost: "text-text-muted bg-transparent hover:text-text hover:bg-white/5",
  };

  const sizes = {
    lg: "min-h-14 px-8 text-lg",
    md: "min-h-12 px-6 text-base",
    sm: "min-h-10 px-4 text-sm",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
