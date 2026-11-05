/** localStorage can throw (blocked cookies, sandboxed iframes, some in-app browsers). Never let that crash the app. */
export function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: preference simply isn't remembered */
  }
}
