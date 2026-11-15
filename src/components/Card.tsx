import type { ReactNode } from 'react';

/** Reusable clay card. `tone` adds a coloured accent strip. */
export default function Card({ title, children, tone, as: Tag = 'section', className = '' }: {
  title?: ReactNode;
  children: ReactNode;
  tone?: 'accent' | 'success' | 'error' | 'warning';
  as?: 'section' | 'div' | 'article';
  className?: string;
}) {
  return (
    <Tag className={`app-clay-card app-clay-card--padded${tone ? ` app-clay-card--${tone}` : ''} ${className}`.trim()}>
      {title && <h2 className="govuk-heading-m">{title}</h2>}
      {children}
    </Tag>
  );
}
