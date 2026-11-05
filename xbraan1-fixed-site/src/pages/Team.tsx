import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import OptimizedImage from '../components/OptimizedImage';
import { teamMembers } from '../data/team';
import { siteConfig } from '../config/site';
import NotFound from './NotFound';

export default function Team() {
  if (!siteConfig.features.team) return <NotFound />;
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-6">Meet the Team</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">Our team of experienced professionals.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Link key={member.id} to={`/team/${member.slug}`} className="group block border border-neutral-100 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden">
                <OptimizedImage 
                  src={member.image} 
                  alt={member.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-0.5">{member.name}</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{member.role}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{member.bio}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {member.speciality.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded">{s}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
