import { Suspense, useEffect, useRef, useState, MouseEvent } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Scissors, Sun, Moon } from 'lucide-react';
import RouteEffects from './RouteEffects';
import RouteSeo from './RouteSeo';
import BackToTop from './BackToTop';
import ReadingProgress from './ReadingProgress';
import SearchModal from './SearchModal';
import ErrorBoundary from './ErrorBoundary';
import { useTheme } from '../context/ThemeContext';
import { siteConfig } from '../config/site';

const primaryNav = [
  { to: '/', label: 'Home', end: true },
  { to: '/salon', label: 'Salon' },
  { to: '/barber', label: 'Barber' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  ...(siteConfig.features.team ? [{ to: '/team', label: 'Team' }] : []),
  { to: '/about', label: 'About' },
];

const desktopLink = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors underline-offset-8 ${
    isActive
      ? 'text-neutral-900 dark:text-white underline decoration-2'
      : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
  }`;

const mobileLink = ({ isActive }: { isActive: boolean }) =>
  `block py-3 ${isActive ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-700 dark:text-neutral-300'}`;

const footerLink = 'hover:text-white transition-colors';

function PageFallback() {
  return (
    <div role="status" className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-600 border-t-neutral-700 dark:border-t-neutral-200 rounded-full animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { contact } = siteConfig;

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const skipToMain = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    main?.focus();
    main?.scrollIntoView();
  };

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={18} className="text-amber-500" aria-hidden="true" /> : <Moon size={18} className="text-neutral-600" aria-hidden="true" />}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-neutral-950 transition-colors duration-300">
      <a
        href="#main-content"
        onClick={skipToMain}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-neutral-900 focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>
      <RouteSeo />
      <RouteEffects />
      <ReadingProgress />

      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2" aria-label="xBraan1 home">
              <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-sm flex items-center justify-center transition-colors" aria-hidden="true">
                <Scissors size={16} className="text-white dark:text-neutral-900" />
              </div>
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">xBraan1</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <nav aria-label="Main" className="flex items-center gap-6">
                {primaryNav.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.end} className={desktopLink}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <SearchModal />
              {themeButton}
              <Link
                to="/booking"
                className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Book Now
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <SearchModal />
              {themeButton}
              <button
                ref={menuButton}
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="p-2 text-neutral-700 dark:text-neutral-300"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <nav aria-label="Mobile" className="px-4 py-3">
              {primaryNav.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={mobileLink}>
                  {item.label}
                </NavLink>
              ))}
              <Link to="/booking" className="mt-2 block py-3 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-center rounded-md">
                Book Now
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <div
        role="region"
        aria-label="Quick booking"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-4 pt-3 safe-area-bottom"
      >
        <Link
          to="/booking"
          className="block w-full text-center px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md"
        >
          Book an Appointment
        </Link>
      </div>

      <footer className="on-dark bg-neutral-900 dark:bg-black text-neutral-300 py-12 pb-24 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center" aria-hidden="true">
                  <Scissors size={14} className="text-neutral-900" />
                </div>
                <span className="text-base font-semibold text-white">xBraan1</span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">Salon and barbershop: cuts, colour, braids, styling and grooming.</p>
              {(contact.telephone || contact.email) && (
                <ul className="mt-4 space-y-1 text-sm">
                  {contact.telephone && (
                    <li>
                      <a className={footerLink} href={`tel:${contact.telephone.replace(/\s+/g, '')}`}>{contact.telephone}</a>
                    </li>
                  )}
                  {contact.email && (
                    <li>
                      <a className={footerLink} href={`mailto:${contact.email}`}>{contact.email}</a>
                    </li>
                  )}
                </ul>
              )}
            </div>
            <nav aria-label="Services">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h2>
              <ul className="space-y-2 text-sm">
                <li><Link to="/salon" className={footerLink}>Women&rsquo;s Salon</Link></li>
                <li><Link to="/barber" className={footerLink}>Men&rsquo;s Barbering</Link></li>
                <li><Link to="/services" className={footerLink}>All Services</Link></li>
                <li><Link to="/pricing" className={footerLink}>Prices</Link></li>
                <li><Link to="/gallery" className={footerLink}>Style Gallery</Link></li>
              </ul>
            </nav>
            <nav aria-label="Company">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h2>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className={footerLink}>About</Link></li>
                {siteConfig.features.team && <li><Link to="/team" className={footerLink}>Meet the Team</Link></li>}
                <li><Link to="/case-studies" className={footerLink}>Transformations</Link></li>
                {siteConfig.features.promotions && <li><Link to="/promotions" className={footerLink}>Offers</Link></li>}
                <li><Link to="/contact" className={footerLink}>Contact</Link></li>
              </ul>
            </nav>
            <nav aria-label="Information">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Information</h2>
              <ul className="space-y-2 text-sm">
                <li><Link to="/location" className={footerLink}>Location &amp; Hours</Link></li>
                <li><Link to="/booking" className={footerLink}>Request an Appointment</Link></li>
                <li><Link to="/faq" className={footerLink}>FAQ</Link></li>
                <li><Link to="/preparation" className={footerLink}>Preparation &amp; Aftercare</Link></li>
                <li><Link to="/policies" className={footerLink}>Cancellation Policy</Link></li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-neutral-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400">&copy; {new Date().getFullYear()} xBraan1. All rights reserved.</p>
            <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400">
              <Link to="/privacy" className={footerLink}>Privacy Policy</Link>
              <Link to="/terms" className={footerLink}>Terms of Service</Link>
              <Link to="/cookies" className={footerLink}>Cookies &amp; Local Storage</Link>
              <Link to="/accessibility" className={footerLink}>Accessibility</Link>
            </nav>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
