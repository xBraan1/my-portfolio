import { Link, Navigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { formatLongDate, formatTime } from '../lib/format';

interface ConfirmationState {
  reference: string;
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
}

function isConfirmation(v: unknown): v is ConfirmationState {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return ['reference', 'name', 'email', 'service', 'date', 'time'].every((k) => typeof o[k] === 'string' && (o[k] as string).length > 0);
}

export default function BookingConfirmation() {
  const state = useLocation().state;
  if (!isConfirmation(state)) return <Navigate to="/booking" replace />;

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
            <Check className="w-8 h-8 text-green-700 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-3">Appointment request sent</h1>
          <p className="text-neutral-700 dark:text-neutral-300">
            Thank you, {state.name}. This is a request, not a confirmed booking. We will contact you at <strong>{state.email}</strong> to confirm.
          </p>
        </div>

        <dl className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-800 mb-8">
          {[
            ['Reference', state.reference],
            ['Service', state.service],
            ['Preferred date', formatLongDate(state.date)],
            ['Preferred time', formatTime(state.time)],
          ].map(([term, value]) => (
            <div key={term} className="flex justify-between gap-4 p-4 text-sm">
              <dt className="text-neutral-600 dark:text-neutral-400">{term}</dt>
              <dd className="font-medium text-neutral-900 dark:text-white text-right">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md text-center hover:bg-neutral-800 dark:hover:bg-neutral-200">Back to home</Link>
          <Link to="/preparation" className="px-5 py-3 border border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm font-medium rounded-md text-center hover:bg-neutral-100 dark:hover:bg-neutral-800">How to prepare</Link>
        </div>
      </div>
    </PageTransition>
  );
}
