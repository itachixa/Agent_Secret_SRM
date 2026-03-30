'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Lang, translations } from '@/lib/i18n';
import { currentUser as defaultUser } from '@/data/users';

interface AppContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentUser: any;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('togoindia-lang') as Lang : null;
    if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
      setLang(savedLang);
    }
    setIsLoaded(true);
  }, []);

  const handleSetLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('togoindia-lang', newLang);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[lang][key] || key;
    },
    [lang]
  );

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang: handleSetLang,
        t,
        sidebarOpen,
        setSidebarOpen,
        currentUser: defaultUser,
        isLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
