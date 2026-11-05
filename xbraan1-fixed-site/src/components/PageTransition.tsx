import { ReactNode } from 'react';

/** CSS-only page entrance (respects prefers-reduced-motion; see .page-enter in index.css). */
export default function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
