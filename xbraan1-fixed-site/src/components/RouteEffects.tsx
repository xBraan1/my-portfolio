import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Per-navigation behaviour for a single-page app:
 *  - scroll to top on new pages, to the #anchor if there is one, and restore the position on Back/Forward
 *  - move focus to <main> and announce the new page title to screen readers
 */
export default function RouteEffects() {
  const { pathname, search, hash, key } = useLocation();
  const navType = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const currentKey = useRef(key);
  const firstRender = useRef(true);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const save = () => positions.current.set(currentKey.current, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, []);

  useEffect(() => {
    currentKey.current = key;
    const timers: number[] = [];

    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    const saved = navType === 'POP' ? positions.current.get(key) : undefined;

    let frame = 0;
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
    if (target) {
      target.scrollIntoView({ block: 'start' });
    } else {
      const top = saved ?? 0;
      const start = performance.now();
      // A restored page may not have its full height yet (lazy chunks, images), so keep trying for a moment,
      // but stop as soon as the visitor scrolls themselves.
      const step = () => {
        window.scrollTo({ top, left: 0, behavior: 'instant' as ScrollBehavior });
        if (!cancelled && top > 0 && Math.abs(window.scrollY - top) > 2 && performance.now() - start < 1500) {
          frame = window.requestAnimationFrame(step);
        }
      };
      step();
      window.addEventListener('wheel', cancel, { once: true, passive: true });
      window.addEventListener('touchstart', cancel, { once: true, passive: true });
    }

    if (firstRender.current) {
      firstRender.current = false;
    } else {
      const main = document.getElementById('main-content');
      if (main && !target) main.focus({ preventScroll: true });
      timers.push(window.setTimeout(() => setAnnouncement(document.title), 200));
    }
    return () => {
      cancel();
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname, search, hash, key, navType]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
}
