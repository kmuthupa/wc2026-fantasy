import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--accent-subtle)] text-[var(--text-primary)]',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-orange-50 text-orange-700',
  muted: 'bg-[var(--surface-muted)] text-[var(--text-secondary)]',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
