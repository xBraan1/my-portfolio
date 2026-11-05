import { useEffect, useRef, useState, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  /** Above-the-fold image: load eagerly with high priority. */
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  fallbackSrc = '/placeholder.svg',
  alt,
  priority = false,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // An image that finished loading before React attached its handlers would otherwise stay invisible.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="animate-pulse w-8 h-8 border-2 border-neutral-300 dark:border-neutral-600 border-t-neutral-600 dark:border-t-neutral-300 rounded-full" />
        </div>
      )}
      <img
        ref={ref}
        src={error ? fallbackSrc : src}
        alt={alt}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...props}
      />
    </div>
  );
}
