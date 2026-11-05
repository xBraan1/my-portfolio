import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // Disable browser's automatic scroll restoration
  // This prevents conflicts and gives us full control
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Handle anchor navigation (e.g., #about, #contact)
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        // Use requestAnimationFrame to ensure element is rendered
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
        return;
      }
    }

    // For all other navigation, scroll to top
    // Using requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    });
  }, [pathname, hash]);

  return null;
}
