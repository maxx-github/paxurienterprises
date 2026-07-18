// src/components/ui/button.tsx
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const baseStyles = "inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary",
      secondary: "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary",
      dark: "bg-dark text-white hover:bg-gray-800 focus:ring-dark",
      ghost: "text-primary hover:bg-grey focus:ring-primary",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
export { Button };