import type { ReactNode } from 'react';

/** Consistent page heading: optional eyebrow, title and one short line of context. */
export default function PageHead({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: ReactNode }) {
  return (
    <header className="app-page-head">
      {eyebrow && <span className="govuk-caption-m">{eyebrow}</span>}
      <h1 className="govuk-heading-xl">{title}</h1>
      {lead && <p>{lead}</p>}
    </header>
  );
}
