'use client';

import { useApp } from '@/lib/context';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { lang, setLang } = useApp();

  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] transition-all text-sm font-medium text-gray-300 hover:text-white"
    >
      <Globe size={14} />
      <span>{lang === 'fr' ? 'EN' : 'FR'}</span>
    </button>
  );
}
