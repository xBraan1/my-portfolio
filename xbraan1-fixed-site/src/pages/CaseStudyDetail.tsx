import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Breadcrumbs from '../components/Breadcrumbs';
import OptimizedImage from '../components/OptimizedImage';
import { getCaseStudyBySlug } from '../data/caseStudies';
import { getTeamMemberBySlug } from '../data/team';
import { siteConfig } from '../config/site';

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const cs = getCaseStudyBySlug(slug || '');

  if (!cs) {
    return (
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-4">Case Study Not Found</h1>
          <Link to="/case-studies" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">← Back to Transformations</Link>
        </div>
      </PageTransition>
    );
  }

  const stylist = siteConfig.features.team ? getTeamMemberBySlug(cs.stylistId) : undefined;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Transformations', href: '/case-studies' }, { label: cs.title }]} />

        {cs.isSample && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6">
            <p className="text-xs text-amber-800 dark:text-amber-300">{cs.sampleNote}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mt-4">
          <div>
            <div className="rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
              <OptimizedImage src={cs.afterImage} alt={cs.afterImageAlt} className="w-full h-80 object-cover" />
              <p className="p-2 text-xs text-neutral-600 dark:text-neutral-400 text-center">After</p>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">{cs.subtitle}</span>
            <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-neutral-900 dark:text-white mt-1 mb-6">{cs.title}</h1>

            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Client Goal</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{cs.goal}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Hair Type / Considerations</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{cs.hairType}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Services Performed</h2>
                <div className="flex flex-wrap gap-1">
                  {cs.services.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Process</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{cs.process}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Aftercare</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{cs.aftercare}</p>
              </div>
              {stylist && (
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Stylist</h2>
                  <Link to={`/team/${stylist.slug}`} className="text-sm text-neutral-900 dark:text-white font-medium hover:underline">{stylist.name}</Link>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">{stylist.role}</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <Link to="/booking" className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                Book a Similar Service <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
