import { Link } from 'react-router-dom';
import LegalPage, { H2, P, UL } from '../components/LegalPage';

export default function Accessibility() {
  return (
    <LegalPage title="Accessibility Statement" crumb="Accessibility">
      <P>
        We want everyone to be able to use this website. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.
      </P>

      <H2>What we have checked</H2>
      <UL>
        <li>Pages were tested with an automated accessibility checker (axe-core) in light and dark display, on small and large screens, as of {'1 November 2026'}.</li>
        <li>We checked by hand that the main journeys work with a keyboard only: moving between pages, searching services and sending the contact and appointment forms.</li>
        <li>The website works at narrow widths and when text is enlarged, and it follows your device&rsquo;s reduced-motion setting.</li>
      </UL>
      <P>This is our own testing. The website has not yet been audited by an independent accessibility specialist, and it has not been tested with every screen reader.</P>

      <H2>Known limitations</H2>
      <UL>
        <li>Photos come from a stock-photo library and have short descriptions rather than detailed ones.</li>
        <li>If a map is shown on the Location page it is provided by Google and we do not control its accessibility.</li>
      </UL>

      <H2>Tell us about a problem</H2>
      <P>
        If something on this website is hard to use, or you need information in a different format, please use our{' '}
        <Link to="/contact" className="underline underline-offset-2">contact form</Link> and tell us what the problem is and which page it was on. We will do our best to help and to fix it.
      </P>
    </LegalPage>
  );
}
