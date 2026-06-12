import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="py-16 px-6 text-center">
      <p className="text-lg font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-sm mx-auto">{description}</p>
      {action && (
        <Button className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
