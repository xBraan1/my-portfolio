import PageTransition from '../components/PageTransition';
import { siteConfig } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Policies() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Policies' }]} />
        <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-6">Booking, Cancellation & Refund Policies</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-serif font-semibold text-neutral-900 dark:text-white mb-3">Booking</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">You can send an appointment request online. A request is not a confirmed booking until you receive confirmation from our team.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-neutral-900 dark:text-white mb-3">Cancellations</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">We ask for at least {siteConfig.policies.cancellationWindowHours} hours&rsquo; notice if you need to cancel or reschedule.</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Repeated no-shows or late cancellations may result in a requirement for a deposit on future bookings.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-neutral-900 dark:text-white mb-3">Deposits</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Deposits are not currently required for standard bookings. For high-value or lengthy services, a deposit may be requested.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-neutral-900 dark:text-white mb-3">Refunds</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">If you are not satisfied with your service, please speak with your stylist or manager before leaving. Refund requests after leaving will be considered case-by-case.</p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
