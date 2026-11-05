import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Breadcrumbs from '../components/Breadcrumbs';
import NotFound from './NotFound';
import { siteConfig } from '../config/site';
import { promotions } from '../data/promotions';
import { formatLongDate, todayIso } from '../lib/format';

export default function Promotions() {
  if (!siteConfig.features.promotions) return <NotFound />;
  const today = todayIso();
  const active = promotions.filter((p) => !p.validUntil || p.validUntil >= today);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Offers' }]} />
        <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-6">Offers</h1>
        {active.length === 0 ? (
          <p className="text-neutral-700 dark:text-neutral-300">There are no offers right now.</p>
        ) : (
          <ul className="space-y-4">
            {active.map((p) => (
              <li key={p.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <h2 className="flex items-center gap-2 text-xl font-serif font-semibold text-neutral-900 dark:text-white mb-2">
                  <Tag size={18} aria-hidden="true" /> {p.title}
                </h2>
                <p className="text-neutral-800 dark:text-neutral-200 mb-2">{p.description}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {p.terms}
                  {p.validUntil ? ` Valid until ${formatLongDate(p.validUntil)}.` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8">
          <Link to="/booking" className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200">
            Request an appointment
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
