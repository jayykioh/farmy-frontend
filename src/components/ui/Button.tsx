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
    
    // Base styles
    const baseStyles = 'group relative flex items-center justify-center gap-2 font-bold transition-all duration-300 active:scale-[0.98] outline-none';
    
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
      primary: 'bg-primary text-white shadow-[0_4px_12px_rgba(8,168,85,0.25)] hover:shadow-[0_8px_20px_rgba(8,168,85,0.35)] active:translate-y-0.5 active:shadow-[0_2px_8px_rgba(8,168,85,0.2)]',
      secondary: 'bg-white text-primary border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 shadow-sm active:translate-y-0.5',
      outline: 'bg-transparent text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:translate-y-0.5',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className}`}
        {...props}
      >
        {/* Subtle top gradient for primary buttons to give physical depth */}
        {variant === 'primary' ? (<div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-inherit pointer-events-none opacity-50"></div>) : null}
        {icon ? (<span className="shrink-0 flex items-center justify-center">
          {icon}
        </span>) : null}
        <span className="relative z-10 flex flex-row items-center justify-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
