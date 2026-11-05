import { Link } from 'react-router-dom';
import LegalPage, { H2, P, UL } from '../components/LegalPage';

export default function Cookies() {
  return (
    <LegalPage title="Cookies & Local Storage" crumb="Cookies & Local Storage">
      <P>
        This website does not set any cookies. It does not use analytics, advertising or tracking technologies, so there is no cookie banner. If that ever changes, we will ask for your permission first.
      </P>

      <H2>What is stored on your device</H2>
      <UL>
        <li>
          <strong><code>xbraan1-theme</code> (local storage).</strong> Remembers whether you chose the light or dark display. It stays in your browser, is never sent to us, and is used only to show the site the way you prefer.
          You can clear it in your browser settings at any time.
        </li>
      </UL>

      <H2>Content from other companies</H2>
      <UL>
        <li>Photos are loaded from Unsplash. Your browser contacts Unsplash to fetch them, which shares your IP address with Unsplash.</li>
        <li>If the Location page shows a map, it is provided by Google Maps and may use cookies of its own when it loads. We only load it on that page.</li>
        <li>Fonts are served from this website, not from a third party.</li>
      </UL>

      <H2>Old versions of this website</H2>
      <P>
        Earlier versions stored a cached copy of pages in your browser (a &ldquo;service worker&rdquo;). That has been removed, and the website clears it automatically the next time you visit.
      </P>

      <P>
        More about how we handle personal data is in our <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
      </P>
    </LegalPage>
  );
}
