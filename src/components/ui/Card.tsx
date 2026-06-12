import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div
      className={`bg-white border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
