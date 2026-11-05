import { Link } from 'react-router-dom';
import { Clock, MapPin, Mail, Phone, Navigation, Car, Accessibility as AccessIcon } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Breadcrumbs from '../components/Breadcrumbs';
import { formattedAddress, siteConfig, weekdays } from '../config/site';

const card = 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6';
const heading = 'text-lg font-serif font-semibold text-neutral-900 dark:text-white';

export default function Location() {
  const { contact, location, openingHours } = siteConfig;
  const address = formattedAddress();
  const nothingYet = !address && !contact.telephone && !contact.email && !openingHours;
  const mapUrl = location.mapEmbedUrl?.startsWith('https://www.google.com/maps/embed') ? location.mapEmbedUrl : null;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Location & Hours' }]} />
        <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-2">Location &amp; Opening Hours</h1>
        <p className="text-neutral-700 dark:text-neutral-300 mb-8">Find us, plan your visit and check when we are open.</p>

        {nothingYet && (
          <div className={`${card} mb-8`}>
            <p className="text-neutral-800 dark:text-neutral-200">
              Our address and opening hours are not listed here yet. Please{' '}
              <Link to="/contact" className="underline underline-offset-2">send us a message</Link> to check before you visit, or{' '}
              <Link to="/booking" className="underline underline-offset-2">request an appointment</Link>.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {address && (
              <section className={card} aria-labelledby="loc-address">
                <h2 id="loc-address" className={`${heading} flex items-center gap-2 mb-3`}>
                  <MapPin size={18} aria-hidden="true" /> Address
                </h2>
                <p className="text-neutral-800 dark:text-neutral-200 mb-3">{address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-2 text-neutral-900 dark:text-white"
                >
                  <Navigation size={14} aria-hidden="true" /> Get directions (opens Google Maps)
                </a>
              </section>
            )}

            {(contact.telephone || contact.email) && (
              <section className={card} aria-labelledby="loc-contact">
                <h2 id="loc-contact" className={`${heading} mb-3`}>Contact</h2>
                <ul className="space-y-2 text-neutral-800 dark:text-neutral-200">
                  {contact.telephone && (
                    <li className="flex items-center gap-2">
                      <Phone size={16} aria-hidden="true" />
                      <a className="underline underline-offset-2" href={`tel:${contact.telephone.replace(/\s+/g, '')}`}>{contact.telephone}</a>
                    </li>
                  )}
                  {contact.email && (
                    <li className="flex items-center gap-2">
                      <Mail size={16} aria-hidden="true" />
                      <a className="underline underline-offset-2" href={`mailto:${contact.email}`}>{contact.email}</a>
                    </li>
                  )}
                </ul>
              </section>
            )}

            {location.directions && (
              <section className={card} aria-labelledby="loc-find">
                <h2 id="loc-find" className={`${heading} mb-3`}>How to find us</h2>
                <p className="text-neutral-800 dark:text-neutral-200">{location.directions}</p>
              </section>
            )}

            {(location.parking || location.accessibility) && (
              <div className="grid sm:grid-cols-2 gap-6">
                {location.parking && (
                  <section className={card} aria-labelledby="loc-parking">
                    <h2 id="loc-parking" className={`${heading} flex items-center gap-2 mb-2`}><Car size={16} aria-hidden="true" /> Parking</h2>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200">{location.parking}</p>
                  </section>
                )}
                {location.accessibility && (
                  <section className={card} aria-labelledby="loc-access">
                    <h2 id="loc-access" className={`${heading} flex items-center gap-2 mb-2`}><AccessIcon size={16} aria-hidden="true" /> Accessibility</h2>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200">{location.accessibility}</p>
                  </section>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {openingHours && (
              <section className={card} aria-labelledby="loc-hours">
                <h2 id="loc-hours" className={`${heading} flex items-center gap-2 mb-3`}><Clock size={18} aria-hidden="true" /> Opening hours</h2>
                <dl className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {weekdays.map((day) => (
                    <div key={day} className="flex justify-between py-2 text-sm">
                      <dt className="capitalize text-neutral-800 dark:text-neutral-200">{day}</dt>
                      <dd className="text-neutral-800 dark:text-neutral-200">{openingHours[day]}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {mapUrl && (
              <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800">
                <iframe
                  title="Map showing the xBraan1 location"
                  src={mapUrl}
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            Request an appointment
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
