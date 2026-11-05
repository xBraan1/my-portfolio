import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

const control =
  'w-full px-3 py-2.5 rounded-md text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border ' +
  'placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent';
const okBorder = 'border-neutral-500';
const badBorder = 'border-red-600 dark:border-red-400';

interface Shared {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
}

function describedBy(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ');
  return ids || undefined;
}

function Shell({ id, label, optional, hint, error, children }: Shared & { children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
        {label}
        {optional && <span className="font-normal text-neutral-600 dark:text-neutral-400"> (optional)</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ id, label, optional, hint, error, className = '', ...rest }: Shared & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>) {
  return (
    <Shell id={id} label={label} optional={optional} hint={hint} error={error}>
      <input
        id={id}
        aria-required={!optional || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} ${error ? badBorder : okBorder} ${className}`}
        {...rest}
      />
    </Shell>
  );
}

export function TextAreaField({ id, label, optional, hint, error, className = '', ...rest }: Shared & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>) {
  return (
    <Shell id={id} label={label} optional={optional} hint={hint} error={error}>
      <textarea
        id={id}
        aria-required={!optional || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} resize-y ${error ? badBorder : okBorder} ${className}`}
        {...rest}
      />
    </Shell>
  );
}

export function SelectField({ id, label, optional, hint, error, className = '', children, ...rest }: Shared & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'>) {
  return (
    <Shell id={id} label={label} optional={optional} hint={hint} error={error}>
      <select
        id={id}
        aria-required={!optional || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} ${error ? badBorder : okBorder} ${className}`}
        {...rest}
      >
        {children}
      </select>
    </Shell>
  );
}

/** Off-screen trap for bots. Humans never see or tab to it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Leave this field empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="rounded-md border border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-800 dark:text-red-300">
      {children}
    </div>
  );
}
