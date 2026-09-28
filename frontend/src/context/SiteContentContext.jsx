import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loadSiteContent, saveSiteContent, resetSiteContent } from '../utils/siteContent';

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(() => loadSiteContent());

  const refresh = useCallback(() => setContent(loadSiteContent()), []);

  useEffect(() => {
    const onUpd = () => refresh();
    window.addEventListener('ds-site-content-updated', onUpd);
    window.addEventListener('storage', (e) => {
      if (e.key === 'ds_website_cms_v1') refresh();
    });
    return () => window.removeEventListener('ds-site-content-updated', onUpd);
  }, [refresh]);

  const update = useCallback((partialOrFull) => {
    const current = loadSiteContent();
    const next =
      typeof partialOrFull === 'function'
        ? partialOrFull(current)
        : { ...current, ...partialOrFull };
    const saved = saveSiteContent(next);
    setContent(saved);
    return saved;
  }, []);

  const reset = useCallback(() => {
    const d = resetSiteContent();
    setContent(d);
    return d;
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, update, reset, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    return {
      content: loadSiteContent(),
      update: saveSiteContent,
      reset: resetSiteContent,
      refresh: () => {},
    };
  }
  return ctx;
}
