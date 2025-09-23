import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white/70 backdrop-blur-md shadow-lg",
    glass: "bg-white/50 backdrop-blur-lg shadow-xl",
    solid: "bg-white shadow-lg",
    gradient: "bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md shadow-xl"
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 transition-all duration-200",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;