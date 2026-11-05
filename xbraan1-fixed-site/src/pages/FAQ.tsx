import PageTransition from '../components/PageTransition';

export default function FAQ() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-6">Frequently Asked Questions</h1>
        <div className="space-y-3">
          {[
            { q: 'How do I book an appointment?', a: 'You can book online through our booking page or by contacting us directly.' },
            { q: 'Do you walk-ins?', a: 'Walk-ins are welcome when availability allows, but booking in advance is recommended.' },
            { q: 'What is your cancellation policy?', a: 'We ask for at least 24 hours notice for cancellations.' },
          ].map((faq, i) => (
            <details key={i} className="group border border-neutral-100 dark:border-neutral-800 rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg">
                {faq.q}
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="px-4 pb-4 text-sm text-neutral-600 dark:text-neutral-400">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
