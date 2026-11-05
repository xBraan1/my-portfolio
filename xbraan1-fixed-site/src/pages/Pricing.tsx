import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { services } from '../data/services';
import Tooltip from '../components/Tooltip';
import { formatPriceFrom } from '../lib/format';

export default function Pricing() {
  const salonServices = services.filter(s => s.category === 'salon' || s.category === 'both');
  const barberServices = services.filter(s => s.category === 'barber' || s.category === 'both');

  const salonCategories = [...new Set(salonServices.map(s => s.subcategory))];
  const barberCategories = [...new Set(barberServices.map(s => s.subcategory))];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-2">Service Pricing</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Transparent starting prices for all services. Final pricing depends on hair length, density and complexity.</p>
        </div>

        {/* Salon pricing */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-6 pb-2 border-b border-rose-200 dark:border-rose-800">Women's Salon</h2>
          {salonCategories.map(cat => (
            <div key={cat} className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">{cat}</h3>
              <div className="border border-neutral-100 dark:border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                    <tr>
                      <th className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-2">Service</th>
                      <th className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-2 hidden sm:table-cell">Duration</th>
                      <th className="text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-2">
                        <Tooltip id="pricing-from" content="Prices shown are starting prices. Final price depends on hair length, density and complexity.">
                          Price
                        </Tooltip>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {salonServices.filter(s => s.subcategory === cat).map((service, i) => (
                      <tr key={service.id} className={i % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50/50 dark:bg-neutral-800/30'}>
                        <td className="px-4 py-3">
                          <Link to={`/services/${service.slug}`} className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300">
                            {service.name}
                          </Link>
                          {service.requiresConsultation && (
                            <span className="ml-2 text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">Consultation</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">{service.duration}</td>
                        <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white text-right">
                          {formatPriceFrom(service.priceFrom)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Barber pricing */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">Men's Barbering</h2>
          {barberCategories.map(cat => (
            <div key={cat} className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">{cat}</h3>
              <div className="border border-neutral-100 dark:border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                    <tr>
                      <th className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-2">Service</th>
                      <th className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-2 hidden sm:table-cell">Duration</th>
                      <th className="text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 px-4 py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {barberServices.filter(s => s.subcategory === cat).map((service, i) => (
                      <tr key={service.id} className={i % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50/50 dark:bg-neutral-800/30'}>
                        <td className="px-4 py-3">
                          <Link to={`/services/${service.slug}`} className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300">
                            {service.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">{service.duration}</td>
                        <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white text-right">
                          {formatPriceFrom(service.priceFrom)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">Pricing Notes</h3>
          <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <li>• All prices are starting prices. Final pricing depends on hair length, density, complexity and products used.</li>
            <li>• Services marked "Consultation" require a consultation before booking.</li>
            <li>• "POA" means "Price on Application" — contact us for a quote.</li>
            <li>• Package deals may be available — ask when booking.</li>
          </ul>
        </div>
      </div>
    </PageTransition>
  );
}
