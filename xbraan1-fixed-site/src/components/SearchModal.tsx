import { useEffect, useMemo, useRef, useState, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { services } from '../data/services';
import { formatPriceFrom } from '../lib/format';

const MAX_RESULTS = 30;

interface SearchButtonProps {
  className?: string;
}

/** Search button + accessible dialog. Opens with the button or Ctrl/Cmd+K; works on touch and keyboard. */
export default function SearchModal({ className = '' }: SearchButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();

  const close = () => {
    setIsOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Close when the page changes (a result was chosen).
  useEffect(() => {
    setIsOpen(false);
    setQuery('');
  }, [pathname]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return services
      .filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.subcategory.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS);
  }, [query]);

  const links = () => Array.from(dialogRef.current?.querySelectorAll<HTMLAnchorElement>('a[data-result]') ?? []);

  const onDialogKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const items = links();
      if (!items.length) return;
      e.preventDefault();
      const active = items.indexOf(document.activeElement as HTMLAnchorElement);
      if (e.key === 'ArrowDown') {
        (items[active + 1] ?? items[0]).focus();
      } else if (active <= 0) {
        inputRef.current?.focus();
      } else {
        items[active - 1].focus();
      }
      return;
    }
    if (e.key === 'Enter' && document.activeElement === inputRef.current) {
      const first = links()[0];
      if (first) {
        e.preventDefault();
        first.click();
      }
      return;
    }
    if (e.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('input, button, a[href]');
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${className}`}
        aria-label="Search services"
        aria-haspopup="dialog"
      >
        <Search size={18} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-16 sm:pt-20 px-4">
          <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden="true" />
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- the dialog handles Escape, arrow keys and Tab (focus trap) */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search services"
            onKeyDown={onDialogKeyDown}
            className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-lg shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-neutral-200 dark:border-neutral-800">
              <Search size={20} className="text-neutral-500" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services"
                aria-label="Search services"
                autoComplete="off"
                className="flex-1 bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={close}
                className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                aria-label="Close search"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div aria-live="polite" className="sr-only">
              {query.trim() ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : ''}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() === '' ? (
                <p className="p-8 text-center text-sm text-neutral-600 dark:text-neutral-400">Type to search all services.</p>
              ) : results.length === 0 ? (
                <p className="p-8 text-center text-sm text-neutral-600 dark:text-neutral-400">No services found for “{query}”.</p>
              ) : (
                <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {results.map((service) => (
                    <li key={service.id}>
                      <Link
                        data-result
                        to={`/services/${service.slug}`}
                        className="flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus-visible:bg-neutral-100 dark:focus-visible:bg-neutral-800 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                          <img src={service.image} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-neutral-900 dark:text-white truncate">{service.name}</span>
                          <span className="block text-xs text-neutral-600 dark:text-neutral-400 truncate">{service.description}</span>
                          <span className="block mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                            {service.subcategory} · <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatPriceFrom(service.priceFrom)}</span>
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-600 dark:text-neutral-400 hidden sm:block">
              Use the up and down arrow keys to move through results, Enter to open, Escape to close.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
