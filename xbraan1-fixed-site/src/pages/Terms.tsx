import { Link } from 'react-router-dom';
import LegalPage, { H2, P, UL } from '../components/LegalPage';
import { siteConfig } from '../config/site';

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" crumb="Terms of Service">
      <P>
        These terms apply when you use the {siteConfig.name} website, xbraan1.co.uk. By using the website you agree to them. They do not affect any rights you have by law as a consumer.
      </P>

      <H2>Appointment requests</H2>
      <UL>
        <li>The appointment form sends us a request. It is not a confirmed booking until we confirm it with you.</li>
        <li>No payment is taken through this website.</li>
        <li>Please read our <Link to="/policies" className="underline underline-offset-2">booking, cancellation and refund policy</Link>, which forms part of your appointment arrangement.</li>
      </UL>

      <H2>Prices and information</H2>
      <P>
        Prices shown are guide prices (&ldquo;from&rdquo; prices). The final price depends on hair length, density, condition and the work involved, and is confirmed at your consultation.
        We try to keep the website accurate, but services, prices and times can change.
      </P>

      <H2>Images</H2>
      <P>
        Photos in the style gallery and on service pages are reference and inspiration images. Unless a page says otherwise, they are not photographs of our clients&rsquo; hair or a guarantee of a particular result.
        Transformation stories are illustrative examples.
      </P>

      <H2>Using the website</H2>
      <UL>
        <li>Do not misuse the website, attempt to disrupt it, or submit false or abusive information.</li>
        <li>The website&rsquo;s text, design and code belong to us or our licensors. You may view it and print pages for your own use, but not copy or republish it without permission.</li>
        <li>Links to other websites are provided for convenience. We are not responsible for their content.</li>
      </UL>

      <H2>Our responsibility</H2>
      <P>
        Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud, or for anything else that cannot be limited by law.
        Apart from that, we are not responsible for losses that were not a reasonably foreseeable result of our breach.
      </P>

      <H2>Changes and contact</H2>
      <P>
        We may update these terms from time to time; the date at the top shows the latest version. Questions? Use our <Link to="/contact" className="underline underline-offset-2">contact form</Link>.
      </P>
    </LegalPage>
  );
}
