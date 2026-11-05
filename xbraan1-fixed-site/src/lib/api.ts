import { ApiResponse, FieldErrors } from '../../shared/forms';

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors; retryable: boolean };

/** POST a form to the Worker. "ok" is only ever true after the server confirms it stored the request. */
export async function submitForm(kind: 'contact' | 'booking', payload: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch(`/api/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => null)) as ApiResponse | null;
    if (res.ok && data && data.ok) return { ok: true, reference: data.reference };
    if (data && !data.ok) {
      return { ok: false, message: data.message, fieldErrors: data.fieldErrors, retryable: data.error !== 'validation' };
    }
    return { ok: false, message: 'We could not send that just now. Please try again in a moment.', retryable: true };
  } catch {
    return { ok: false, message: 'We could not reach the server. Check your connection and try again.', retryable: true };
  }
}
