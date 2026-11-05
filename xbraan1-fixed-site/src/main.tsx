import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/playfair-display/wght-italic.css';
import './index.css';
import App from './App.tsx';
import { ThemeProvider, applyTheme, readInitialTheme } from './context/ThemeContext';

// Apply the saved theme before first paint of the React tree (storage access is guarded).
applyTheme(readInitialTheme());

// Earlier versions registered a caching service worker. Remove it (and its caches) for returning visitors.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => registrations.forEach((r) => r.unregister()))
    .catch(() => undefined);
  if ('caches' in window) {
    caches
      .keys()
      .then((keys) => keys.filter((k) => k.startsWith('xbraan1-')).forEach((k) => caches.delete(k)))
      .catch(() => undefined);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
