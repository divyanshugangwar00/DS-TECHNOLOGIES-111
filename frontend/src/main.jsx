import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import './index.css';

// Disable offline / PWA: unregister any existing service workers and clear caches
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations?.().then((regs) => {
      regs.forEach((r) => r.unregister());
    }).catch(() => {});
    if (window.caches?.keys) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SiteContentProvider>
          <App />
        </SiteContentProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
