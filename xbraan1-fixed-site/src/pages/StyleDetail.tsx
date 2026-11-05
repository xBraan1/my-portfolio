import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Breadcrumbs from '../components/Breadcrumbs';
import OptimizedImage from '../components/OptimizedImage';
import { getGalleryItemBySlug, galleryItems } from '../data/gallery';

export default function StyleDetail() {
  const { slug } = useParams();
  const item = getGalleryItemBySlug(slug || '');

  if (!item) {
    return (
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-4">Style Not Found</h1>
          <Link to="/gallery" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">← Back to Gallery</Link>
        </div>
      </PageTransition>
    );
  }

  const relatedItems = galleryItems.filter(g => g.category === item.category && g.id !== item.id).slice(0, 4);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Style Gallery', href: '/gallery' }, { label: item.title }]} />

        <div className="grid lg:grid-cols-2 gap-8 mt-4">
          <div className="rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <OptimizedImage src={item.image} alt={item.imageAlt} className="w-full h-80 lg:h-full object-cover" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">{item.category}</span>
            <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-neutral-900 dark:text-white mt-1 mb-4">{item.title}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">{item.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {item.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded-full">{tag}</span>
              ))}
            </div>

            {item.isInspiration && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-6">
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <strong>Reference image:</strong> This is an inspiration/reference style. Our team can create similar looks — book a consultation to discuss.
                </p>
              </div>
            )}

            <Link to="/booking" className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
              Book a Similar Style <ArrowRight size={14} />
            </Link>

            <div className="mt-6 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-700">
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Source: {item.imageSource}. License: {item.imageLicense}.
              </p>
            </div>
          </div>
        </div>

        {/* Related styles */}
        {relatedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-serif font-semibold text-neutral-900 dark:text-white mb-4">More in {item.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedItems.map(ri => (
                <Link key={ri.id} to={`/gallery/${ri.slug}`} className="group relative aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <OptimizedImage 
                    src={ri.image} 
                    alt={ri.imageAlt} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-xs text-white font-medium">{ri.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
