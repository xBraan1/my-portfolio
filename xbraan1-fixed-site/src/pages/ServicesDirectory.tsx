import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import OptimizedImage from '../components/OptimizedImage';
import { services } from '../data/services';
import { formatPriceCompact } from '../lib/format';

export default function ServicesDirectory() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-2">All Services</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Complete directory of xBraan1 salon and barbershop services.</p>
        </div>

        <div className="space-y-3">
          {services.map(service => (
            <Link key={service.id} to={`/services/${service.slug}`} className="flex items-center gap-4 p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm transition-all group">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                <OptimizedImage src={service.image} alt={service.imageAlt} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300">{service.name}</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{service.description}</p>
              </div>
              <div className="text-right flex-shrink-0 max-w-[8rem]">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {formatPriceCompact(service.priceFrom)}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{service.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
