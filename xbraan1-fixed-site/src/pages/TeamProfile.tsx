import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Breadcrumbs from '../components/Breadcrumbs';
import OptimizedImage from '../components/OptimizedImage';
import { getTeamMemberBySlug } from '../data/team';
import { services } from '../data/services';
import { siteConfig } from '../config/site';
import NotFound from './NotFound';

export default function TeamProfile() {
  const { slug } = useParams();
  if (!siteConfig.features.team) return <NotFound />;
  const member = getTeamMemberBySlug(slug || '');

  if (!member) {
    return (
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-4">Team Member Not Found</h1>
          <Link to="/team" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">← Back to Team</Link>
        </div>
      </PageTransition>
    );
  }

  const memberServices = services.filter(s => member.services.includes(s.slug));

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Meet the Team', href: '/team' }, { label: member.name }]} />

        <div className="grid lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
              <OptimizedImage src={member.image} alt={member.imageAlt} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-700">
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Team photo placeholder. Awaiting real team photograph from the business.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">{member.role}</span>
            <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mt-1 mb-2">{member.name}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{member.experience} experience</p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">{member.bio}</p>

            <div className="mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">Specialities</h2>
              <div className="flex flex-wrap gap-2">
                {member.speciality.map(s => (
                  <span key={s} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-full">{s}</span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Services</h2>
              <div className="space-y-2">
                {memberServices.map(service => (
                  <Link key={service.id} to={`/services/${service.slug}`} className="flex items-center justify-between p-3 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
                    <span className="text-sm text-neutral-900 dark:text-white">{service.name}</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{service.priceFrom !== null ? `From $${service.priceFrom}` : 'POA'}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/booking" className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
              Book with {member.name.split(' ')[0]} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
