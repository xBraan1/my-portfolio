import { Link, Navigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function ContactThankYou() {
  const state = useLocation().state as { reference?: string } | null;
  if (!state?.reference) return <Navigate to="/contact" replace />;

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
          <Check className="w-8 h-8 text-green-700 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-3">Message sent</h1>
        <p className="text-neutral-700 dark:text-neutral-300 mb-2">Thank you for getting in touch. We will reply by email.</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Your reference: <span className="font-mono font-medium text-neutral-900 dark:text-white">{state.reference}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200">Back to home</Link>
          <Link to="/services" className="px-5 py-3 border border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-white text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">Browse services</Link>
        </div>
      </div>
    </PageTransition>
  );
}
