import { Link } from 'react-router-dom';
import LegalPage, { H2, P, UL } from '../components/LegalPage';
import { siteConfig } from '../config/site';

export default function Privacy() {
  const operator = siteConfig.legalName ?? siteConfig.name;
  return (
    <LegalPage title="Privacy Policy" crumb="Privacy Policy">
      <P>
        This policy explains what personal data the website xbraan1.co.uk collects, why, and what your rights are. The website is run by {operator} (&ldquo;we&rdquo;, &ldquo;us&rdquo;),
        and we are the controller of the personal data described here. To ask us anything about your data, use our{' '}
        <Link to="/contact" className="underline underline-offset-2">contact form</Link>
        {siteConfig.contact.email ? <> or email <a className="underline underline-offset-2" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></> : null}.
      </P>

      <H2>What we collect and why</H2>
      <UL>
        <li>
          <strong>Appointment requests.</strong> Your name, email address, phone number (optional), the service you choose, your preferred date and time, and any notes you add.
          We use these to respond to your request and arrange your appointment. Our legal basis is taking steps at your request before an appointment is agreed (UK GDPR Article 6(1)(b)).
        </li>
        <li>
          <strong>Health information you choose to give us.</strong> Notes may include things like allergies or sensitivities. This is health information. Only include what you are happy
          for us to use to plan your appointment safely; by including it you give us your explicit consent to use it for that purpose (Article 9(2)(a)), and you can withdraw that consent at any time.
        </li>
        <li>
          <strong>Messages.</strong> Your name, email address, phone number (optional) and message, used to reply to you. Our legal basis is our legitimate interest in answering enquiries (Article 6(1)(f)).
        </li>
        <li>
          <strong>Abuse prevention.</strong> When you send a form we store a one-way (hashed) version of your IP address and the first part of your browser&rsquo;s description (its &ldquo;user agent&rdquo;),
          so that we can limit spam and abuse. We cannot turn the hash back into your IP address. Our legal basis is our legitimate interest in keeping the website secure and usable (Article 6(1)(f)).
        </li>
        <li>
          <strong>Your light or dark setting</strong> is saved in your own browser only and never sent to us. See the <Link to="/cookies" className="underline underline-offset-2">cookies and local storage page</Link>.
        </li>
      </UL>
      <P>We do not use analytics, advertising or tracking cookies, and we do not sell your data.</P>

      <H2>Who we share it with</H2>
      <UL>
        <li>
          <strong>Cloudflare, Inc.</strong> hosts the website and stores form submissions in its database service on our behalf, and provides security protection. We ask Cloudflare to keep our database in its Western Europe region.
          Cloudflare may process data in other countries and relies on recognised legal safeguards for such transfers.
        </li>
        <li>
          <strong>Image and map providers.</strong> Photos on this website are loaded from Unsplash (images.unsplash.com). When a page with these photos loads, Unsplash receives your IP address and browser details, as it would
          when any website loads an image from it. If a map is shown on the Location page, Google receives similar information when the map loads.
        </li>
      </UL>

      <H2>How long we keep it</H2>
      <P>Appointment requests and messages are deleted automatically after 12 months.</P>

      <H2>Your rights</H2>
      <P>
        You can ask us for a copy of your personal data, to correct it, to erase it, to restrict or object to how we use it, and (where it applies) to receive it in a portable format. You can also withdraw consent at any time.
        Contact us using the details above. If you are unhappy with how we handle your data you can complain to the Information Commissioner&rsquo;s Office at{' '}
        <a className="underline underline-offset-2" href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.
      </P>

      <H2>Children</H2>
      <P>If you are requesting an appointment for a child, please do so as their parent or guardian. We do not knowingly collect data from children through this website.</P>

      <H2>Changes</H2>
      <P>We will update this page if what we do with personal data changes, and change the date at the top.</P>
    </LegalPage>
  );
}
