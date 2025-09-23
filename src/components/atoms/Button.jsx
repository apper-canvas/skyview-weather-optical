import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children,
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100",
    secondary: "bg-white/80 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md disabled:opacity-50",
    ghost: "bg-transparent text-gray-600 hover:bg-white/50 hover:text-gray-800 disabled:opacity-50",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg",
    default: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
    xl: "px-8 py-4 text-lg rounded-2xl"
  };

  return (
    <button
      className={cn(
        "font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;