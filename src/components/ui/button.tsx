import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "default" | "icon";
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "default",
  size = "default",
  ...props
}) => {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-foreground hover:bg-secondary/80",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-border bg-transparent hover:bg-accent",
  };
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
  };
  const classes = [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
  return <button className={classes} {...props} />;
};

export default Button;


