import { Link } from 'react-router-dom';
import { ArrowRight, Scissors } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import OptimizedImage from '../components/OptimizedImage';
import { services } from '../data/services';
import { formatPriceFrom } from '../lib/format';

export default function MensBarbering() {
  const barberServices = services.filter(s => s.category === 'barber' || s.category === 'both');

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-50 via-stone-50 to-neutral-100 dark:from-slate-950/20 dark:via-neutral-900 dark:to-neutral-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 lg:p-12 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Scissors size={16} className="text-slate-700 dark:text-slate-400" />
              <span className="text-xs uppercase tracking-[0.15em] text-slate-700 dark:text-slate-400 font-medium">Men's Barbering</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-neutral-900 dark:text-white mb-4">Precision cuts, sharp fades and expert grooming</h1>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">From skin fades and line-ups to hot-towel shaves and beard sculpting — our barbers combine traditional technique with modern style.</p>
            <Link to="/booking" className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
              Book a Barber Appointment <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Services */}
        <div className="mb-12">
          <h2 className="text-xl font-serif font-semibold text-neutral-900 dark:text-white mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">Our Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {barberServices.map(service => (
              <Link key={service.id} to={`/services/${service.slug}`} className="group block p-5 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm transition-all">
                <div className="w-full h-32 rounded-md overflow-hidden mb-3 bg-neutral-100 dark:bg-neutral-800">
                  <OptimizedImage 
                    src={service.image} 
                    alt={service.imageAlt}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">{service.name}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-2">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    {formatPriceFrom(service.priceFrom)}
                  </span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">{service.duration}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
