import { useParams, Link } from 'react-router-dom';
import { Clock, PoundSterling, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Breadcrumbs from '../components/Breadcrumbs';
import OptimizedImage from '../components/OptimizedImage';
import { getServiceBySlug, services } from '../data/services';
import { formatPriceFrom } from '../lib/format';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug || '');

  if (!service) {
    return (
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-4">Service Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">The service you're looking for doesn't exist or has been moved.</p>
          <Link to="/services" className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md">
            Browse All Services
          </Link>
        </div>
      </PageTransition>
    );
  }

  const relatedServicesList = services.filter(s => service.relatedServices.includes(s.slug));
  const categoryLabel = service.category === 'salon' ? "Women's Salon" : service.category === 'barber' ? "Men's Barbering" : 'Salon & Barbershop';
  const categoryHref = service.category === 'salon' ? '/salon' : service.category === 'barber' ? '/barber' : '/services';

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: categoryLabel, href: categoryHref },
          { label: service.subcategory },
          { label: service.name },
        ]} />

        <div className="grid lg:grid-cols-5 gap-8 mt-4">
          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="rounded-lg overflow-hidden mb-6 bg-neutral-100 dark:bg-neutral-800">
              <OptimizedImage src={service.image} alt={service.imageAlt} className="w-full h-64 lg:h-80 object-cover" />
            </div>

            <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-3">{service.name}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">{service.longDescription}</p>

            {/* Key details */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-700">
                <PoundSterling size={18} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Price</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatPriceFrom(service.priceFrom)}
                  </p>
                  {service.priceNote && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{service.priceNote}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-700">
                <Clock size={18} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{service.duration}</p>
                </div>
              </div>
            </div>

            {service.requiresConsultation && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-6">
                <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-300">Consultation Required</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">This service requires a consultation before booking to assess suitability and create a plan.</p>
                </div>
              </div>
            )}

            {/* Preparation */}
            {service.preparation.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-serif font-semibold text-neutral-900 dark:text-white mb-3">How to Prepare</h2>
                <ul className="space-y-2">
                  {service.preparation.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Aftercare */}
            {service.aftercare.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-serif font-semibold text-neutral-900 dark:text-white mb-3">Aftercare</h2>
                <ul className="space-y-2">
                  {service.aftercare.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {service.faqs.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-serif font-semibold text-neutral-900 dark:text-white mb-3">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {service.faqs.map((faq, i) => (
                    <details key={i} className="group border border-neutral-100 dark:border-neutral-800 rounded-lg">
                      <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg">
                        {faq.question}
                        <span className="text-neutral-400 group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <div className="px-4 pb-4 text-sm text-neutral-600 dark:text-neutral-400">{faq.answer}</div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Booking CTA */}
              <div className="bg-neutral-900 dark:bg-neutral-800 text-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Book This Service</h3>
                <p className="text-sm text-neutral-300 dark:text-neutral-400 mb-4">
                  {`${formatPriceFrom(service.priceFrom)} · ${service.duration}`}
                </p>
                <Link to={`/booking?service=${service.slug}`} className="block w-full text-center px-5 py-3 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors">
                  Book an Appointment
                </Link>
              </div>

              {/* Related services */}
              {relatedServicesList.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Related Services</h3>
                  <div className="space-y-2">
                    {relatedServicesList.map(rs => (
                      <Link key={rs.id} to={`/services/${rs.slug}`} className="flex items-center gap-3 p-3 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
                        <div className="w-10 h-10 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                          <OptimizedImage src={rs.image} alt={rs.imageAlt} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-900 dark:text-white">{rs.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{rs.priceFrom !== null ? `From $${rs.priceFrom}` : 'POA'}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Image attribution */}
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-700">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Image: {service.imageSource}. License: {service.imageLicense}. This is a reference/inspiration image, not an xBraan1 portfolio photograph.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
