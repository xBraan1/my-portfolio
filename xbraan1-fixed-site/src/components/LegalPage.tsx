import { ReactNode } from 'react';
import PageTransition from './PageTransition';
import Breadcrumbs from './Breadcrumbs';

export const UPDATED = '1 November 2026';

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-serif font-semibold text-neutral-900 dark:text-white mt-8 mb-3">{children}</h2>;
}
export function P({ children }: { children: ReactNode }) {
  return <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed mb-3">{children}</p>;
}
export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2 text-neutral-800 dark:text-neutral-200 leading-relaxed mb-3">{children}</ul>;
}

export default function LegalPage({ title, crumb, children }: { title: string; crumb: string; children: ReactNode }) {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: crumb }]} />
        <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-2">{title}</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Last updated: {UPDATED}</p>
        {children}
      </div>
    </PageTransition>
  );
}
