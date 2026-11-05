import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { FormAlert, Honeypot, SelectField, TextAreaField, TextField } from '../components/forms/Field';
import Turnstile from '../components/forms/Turnstile';
import { services } from '../data/services';
import { FieldErrors, LIMITS, validateBooking } from '../../shared/forms';
import { submitForm } from '../lib/api';
import { formatPriceFrom, todayIso } from '../lib/format';
import { siteConfig } from '../config/site';

const FIELD_ORDER = ['name', 'email', 'phone', 'service', 'date', 'time', 'notes'] as const;
const CATEGORY_LABEL: Record<string, string> = { salon: 'Salon', barber: 'Barbering', both: 'All clients' };
const knownServices: ReadonlySet<string> = new Set(services.map((s) => s.slug));

export default function Booking() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const requested = params.get('service') ?? '';
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    service: knownServices.has(requested) ? requested : '',
    date: '',
    time: '',
    notes: '',
    website: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState('');

  const groups = useMemo(() => {
    const map = new Map<string, typeof services>();
    for (const s of services.filter((x) => x.available)) {
      const key = `${CATEGORY_LABEL[s.category] ?? s.category} — ${s.subcategory}`;
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return [...map.entries()];
  }, []);
  const selected = services.find((s) => s.slug === values.service);

  const set = (key: keyof typeof values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const focusFirst = (errs: FieldErrors) => {
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#booking-${first}`)?.focus();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setFormError('');
    const check = validateBooking(values, { knownServices });
    if (!check.ok) {
      setErrors(check.errors);
      setFormError('Please check the highlighted fields.');
      focusFirst(check.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const result = await submitForm('booking', { ...check.value, website: values.website, startedAt: startedAt.current, turnstileToken: token });
    setSubmitting(false);
    if (result.ok) {
      navigate('/booking/confirmation', {
        state: {
          reference: result.reference,
          name: check.value.name,
          email: check.value.email,
          service: selected?.name ?? check.value.service,
          date: check.value.date,
          time: check.value.time,
        },
      });
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-3">Request an Appointment</h1>
        <p className="text-neutral-700 dark:text-neutral-300 mb-2">
          Tell us what you would like and when. This is a request, not a confirmed booking: we will contact you to confirm a time.
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
          No payment is taken online. Fields marked optional can be left blank; all others are required. See our{' '}
          <Link to="/policies" className="underline underline-offset-2">booking and cancellation policy</Link>.
        </p>

        <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5" aria-label="Appointment request form">
          {formError && <FormAlert>{formError}</FormAlert>}

          <TextField id="booking-name" name="name" label="Full name" autoComplete="name" required maxLength={LIMITS.name} value={values.name} onChange={set('name')} error={errors.name} />
          <TextField id="booking-email" name="email" type="email" label="Email" autoComplete="email" inputMode="email" required maxLength={LIMITS.email} value={values.email} onChange={set('email')} error={errors.email} hint="We will use this to confirm your appointment." />
          <TextField id="booking-phone" name="phone" type="tel" label="Phone" optional autoComplete="tel" inputMode="tel" maxLength={LIMITS.phone} value={values.phone} onChange={set('phone')} error={errors.phone} />

          <SelectField id="booking-service" name="service" label="Service" required value={values.service} onChange={set('service')} error={errors.service}
            hint={selected ? `${formatPriceFrom(selected.priceFrom)} · about ${selected.duration}${selected.priceNote ? ` · ${selected.priceNote}` : ''}` : undefined}>
            <option value="">Choose a service</option>
            {groups.map(([label, items]) => (
              <optgroup key={label} label={label}>
                {items.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </optgroup>
            ))}
          </SelectField>

          <div className="grid sm:grid-cols-2 gap-5">
            <TextField id="booking-date" name="date" type="date" label="Preferred date" required min={todayIso()} value={values.date} onChange={set('date')} error={errors.date} />
            <TextField id="booking-time" name="time" type="time" label="Preferred time" required step={900} value={values.time} onChange={set('time')} error={errors.time} hint="We will confirm the exact time with you." />
          </div>

          <TextAreaField id="booking-notes" name="notes" label="Anything we should know?" optional rows={4} maxLength={LIMITS.notes} value={values.notes} onChange={set('notes')} error={errors.notes}
            hint="For example hair type, reference photos you will bring, or allergies and sensitivities so we can plan a patch test." />

          <Honeypot value={values.website} onChange={(v) => setValues((s) => ({ ...s, website: v }))} />
          <Turnstile siteKey={siteConfig.turnstileSiteKey} onToken={setToken} />

          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            We use these details only to deal with your request. See our <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-wait transition-colors"
          >
            {submitting ? 'Sending…' : 'Send appointment request'}
          </button>
        </form>
      </div>
    </PageTransition>
  );
}
