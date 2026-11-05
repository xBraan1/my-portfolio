import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { siteConfig } from '../config/site';

export default function About() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-neutral-900 dark:text-white mb-6">About xBraan1</h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
              xBraan1 is a full-service salon and barbershop built on a simple belief: everyone deserves expert grooming in a welcoming, professional environment.
            </p>

            <h2 className="text-xl font-serif font-semibold text-neutral-900 dark:text-white mt-8 mb-3">Our Approach</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              We combine technical precision with genuine care for each client. Whether you're here for a quick line-up or a full colour transformation, we take the time to understand what you want and deliver results that work for your hair, your lifestyle and your personal style.
            </p>

            <h2 className="text-xl font-serif font-semibold text-neutral-900 dark:text-white mt-8 mb-3">What We Believe</h2>
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400 mb-4">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                <span><strong>Everyone is welcome.</strong> Our salon and barbershop serve all genders, hair types and textures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                <span><strong>Honesty about what we can and can't do.</strong> We'll tell you if a style isn't right for your hair.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                <span><strong>Transparency in pricing.</strong> Starting prices are clearly displayed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
                <span><strong>Hair health comes first.</strong> We won't perform a chemical service if your hair isn't in a condition to handle it.</span>
              </li>
            </ul>

            <h2 className="text-xl font-serif font-semibold text-neutral-900 dark:text-white mt-8 mb-3">Visit Us</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
              Our location, opening hours and contact details can be found on our <Link to="/location" className="underline text-neutral-900 dark:text-white">location page</Link>. We recommend requesting your appointment in advance to give us the best chance of offering your preferred time.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {siteConfig.features.team && (
<Link to="/team" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
Meet the Team <ArrowRight size={14} aria-hidden="true" />
</Link>
)}
            <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-medium rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              Book an Appointment
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
