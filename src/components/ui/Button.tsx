import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      children, 
      variant = 'primary', 
      size = 'md', 
      icon,
      fullWidth = false,
      className = '', 
      ...props 
    }, 
    ref
  ) => {
    
    const baseStyles = 'group relative isolate flex cursor-pointer items-center justify-center gap-2 overflow-hidden font-extrabold tracking-[-0.01em] outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-main active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55';
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Size variants
    const sizeStyles = {
      sm: 'py-1.5 px-4 text-sm rounded-[16px]',
      md: 'py-2.5 px-5 text-base rounded-[20px]',
      lg: 'py-3.5 px-6 text-lg rounded-[24px]',
    };

    // Color/Visual variants
    const variantStyles = {
      primary: 'bg-primary-container text-white shadow-[0_12px_30px_rgba(0,109,53,0.24)] hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_16px_34px_rgba(8,168,85,0.28)] active:translate-y-0 active:shadow-[0_8px_18px_rgba(0,109,53,0.18)]',
      secondary: 'border border-primary/20 bg-white text-primary shadow-[0_10px_24px_rgba(20,30,23,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:shadow-[0_14px_30px_rgba(20,30,23,0.09)] active:translate-y-0',
      outline: 'border border-slate-200/90 bg-white/85 text-slate-700 shadow-[0_8px_22px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white hover:text-slate-950 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] active:translate-y-0',
      ghost: 'bg-transparent text-slate-600 hover:bg-white/70 hover:text-slate-900 active:bg-white',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className}`}
        {...props}
      >
        {icon ? (<span className="shrink-0 flex items-center justify-center">
          {icon}
        </span>) : null}
        <span className="relative z-10 flex flex-row items-center justify-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
