import PageTransition from '../components/PageTransition';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Preparation() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Preparation & Aftercare' }]} />
        <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-6">Hair Preparation & Aftercare</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">Get the best results by following these preparation and aftercare guidelines.</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-serif font-semibold text-neutral-900 dark:text-white mb-3">Before Your Appointment</h2>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />Arrive with clean, detangled hair unless otherwise specified.</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />Bring reference photos of styles you like.</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />For colour services: do not wash hair for 24 hours before.</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />Be honest about all previous chemical treatments.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-neutral-900 dark:text-white mb-3">After Your Appointment</h2>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />Wait 24–48 hours before washing after a cut or colour.</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />Use sulfate-free, colour-safe products after chemical services.</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />Use heat protection whenever styling with hot tools.</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />Sleep on a silk or satin pillowcase to preserve styles.</li>
            </ul>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
