import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import OptimizedImage from '../components/OptimizedImage';
import { galleryItems, galleryCategories } from '../data/gallery';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? galleryItems : galleryItems.filter(item => item.category === activeCategory);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-2">Style Gallery</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Browse haircut and hairstyle inspiration. All images are reference/inspiration examples.</p>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {galleryCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeCategory === cat ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(item => (
            <Link key={item.id} to={`/gallery/${item.slug}`} className="group relative aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <OptimizedImage 
                src={item.image} 
                alt={item.imageAlt} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-xs text-white font-medium">{item.title}</p>
                <p className="text-xs text-neutral-300">{item.category}</p>
                {item.isInspiration && (
                  <p className="text-[9px] text-neutral-400 mt-1">Reference/inspiration</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-500 dark:text-neutral-400">No styles found in this category.</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Image notice:</strong> Gallery images are reference and inspiration examples sourced from licensed image libraries. They do not represent xBraan1's own portfolio unless specifically noted.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
