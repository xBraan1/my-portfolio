import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Breadcrumbs from '../components/Breadcrumbs';
import { caseStudies } from '../data/caseStudies';
import { getTeamMemberBySlug } from '../data/team';
import { siteConfig } from '../config/site';

export default function CaseStudies() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Transformations' }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-2">Case Studies & Transformations</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Detailed looks at real services, processes and results from xBraan1.</p>
        </div>

        {/* Sample notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
          <p className="text-xs text-amber-800 dark:text-amber-300">
            <strong>Note:</strong> These are sample case study layouts. Real case studies with verified before/after images will be added when available.
          </p>
        </div>

        <div className="space-y-12">
          {caseStudies.map(cs => {
            const stylist = siteConfig.features.team ? getTeamMemberBySlug(cs.stylistId) : undefined;
            return (
              <article key={cs.id} className="border border-neutral-100 dark:border-neutral-800 rounded-lg overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="aspect-video lg:aspect-auto bg-neutral-100 dark:bg-neutral-800">
                    <img src={cs.afterImage} alt={cs.afterImageAlt} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-6 lg:p-8">
                    <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">{cs.subtitle}</span>
                    <h2 className="text-xl font-serif font-semibold text-neutral-900 dark:text-white mt-1 mb-3">
                      <Link to={`/case-studies/${cs.slug}`} className="hover:text-neutral-600 dark:hover:text-neutral-300">{cs.title}</Link>
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">{cs.goal}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {cs.services.slice(0, 3).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded">{s}</span>
                      ))}
                    </div>
                    {stylist && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">By <Link to={`/team/${stylist.slug}`} className="font-medium text-neutral-700 dark:text-neutral-300 hover:underline">{stylist.name}</Link></p>
                    )}
                    <Link to={`/case-studies/${cs.slug}`} className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 inline-flex items-center gap-1">
                      Read full case study →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
