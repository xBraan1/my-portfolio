import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { Honeypot, FormAlert, TextAreaField, TextField } from '../components/forms/Field';
import Turnstile from '../components/forms/Turnstile';
import { FieldErrors, LIMITS, validateContact } from '../../shared/forms';
import { submitForm } from '../lib/api';
import { formattedAddress, siteConfig } from '../config/site';

const FIELD_ORDER = ['name', 'email', 'phone', 'message'] as const;

export default function Contact() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '', website: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState('');
  const { contact } = siteConfig;
  const address = formattedAddress();

  const set = (key: keyof typeof values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const focusFirst = (errs: FieldErrors) => {
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setFormError('');
    const check = validateContact(values);
    if (!check.ok) {
      setErrors(check.errors);
      setFormError('Please check the highlighted fields.');
      focusFirst(check.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const result = await submitForm('contact', { ...check.value, website: values.website, startedAt: startedAt.current, turnstileToken: token });
    setSubmitting(false);
    if (result.ok) {
      navigate('/contact/thank-you', { state: { reference: result.reference } });
      return;
    }
    if (result.fieldErrors) {
      setErrors(result.fieldErrors);
      focusFirst(result.fieldErrors);
    }
    setFormError(result.message);
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-6">Contact Us</h1>
        <p className="text-neutral-700 dark:text-neutral-300 mb-8">Send us a message and we will reply by email.</p>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-serif font-semibold text-neutral-900 dark:text-white mb-4">Get in touch</h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6">
              Questions about a service, a style or an appointment? Use the form. To request a particular date and time, use{' '}
              <Link to="/booking" className="underline underline-offset-2">the appointment request form</Link> instead.
            </p>
            {(contact.email || contact.telephone || address) && (
              <ul className="space-y-2 text-neutral-800 dark:text-neutral-200">
                {contact.telephone && (
                  <li>
                    Phone: <a className="underline underline-offset-2" href={`tel:${contact.telephone.replace(/\s+/g, '')}`}>{contact.telephone}</a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    Email: <a className="underline underline-offset-2" href={`mailto:${contact.email}`}>{contact.email}</a>
                  </li>
                )}
                {address && <li>Address: {address}</li>}
              </ul>
            )}
          </div>

          <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Contact form">
            {formError && <FormAlert>{formError}</FormAlert>}
            <TextField id="contact-name" name="name" label="Name" autoComplete="name" required maxLength={LIMITS.name} value={values.name} onChange={set('name')} error={errors.name} />
            <TextField id="contact-email" name="email" type="email" label="Email" autoComplete="email" inputMode="email" required maxLength={LIMITS.email} value={values.email} onChange={set('email')} error={errors.email} />
            <TextField id="contact-phone" name="phone" type="tel" label="Phone" optional autoComplete="tel" inputMode="tel" maxLength={LIMITS.phone} value={values.phone} onChange={set('phone')} error={errors.phone} />
            <TextAreaField id="contact-message" name="message" label="Message" rows={5} required maxLength={LIMITS.message} value={values.message} onChange={set('message')} error={errors.message} />
            <Honeypot value={values.website} onChange={(v) => setValues((s) => ({ ...s, website: v }))} />
            <Turnstile siteKey={siteConfig.turnstileSiteKey} onToken={setToken} />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              We use these details only to reply to you. See our <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-wait transition-colors"
            >
              {submitting ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
