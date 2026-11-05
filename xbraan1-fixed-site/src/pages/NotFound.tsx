import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p aria-hidden="true" className="text-6xl font-serif font-bold text-neutral-500 dark:text-neutral-500 mb-4">404</p>
        <h1 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-3">Page Not Found</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200">
            Go Home
          </Link>
          <Link to="/services" className="px-5 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-medium rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800">
            Browse Services
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
