import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { breadcrumbSchema } from '../seo/jsonld';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { pathname } = useLocation();
  const jsonLd = breadcrumbSchema(items.map((item) => ({ label: item.label, path: item.href ?? pathname })));

  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
      <ol className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 flex-wrap">
        <li>
          <Link to="/" className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <Home size={14} aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-neutral-500" aria-hidden="true" />
            {item.href ? (
              <Link to={item.href} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-900 dark:text-neutral-100 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
