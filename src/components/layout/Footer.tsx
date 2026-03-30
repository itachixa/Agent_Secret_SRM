'use client';

import Link from 'next/link';
import { Heart, Github, Twitter, Instagram, Mail, ExternalLink } from 'lucide-react';
import { useApp } from '@/lib/context';

export function Footer() {
  const { lang } = useApp();

  return (
    <footer className="hidden lg:block bg-togo-darker/80 border-t border-white/[0.04] mt-auto relative overflow-hidden">
      {/* Kente border top */}
      <div className="h-[3px] kente-border" />

      {/* African pattern background */}
      <div className="absolute inset-0 tribal-chevron-bg opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex items-center gap-1.5">
                <img src="/img/Togo.png" alt="Togo" className="w-8 h-5 rounded-sm shadow-md" />
                <span className="text-togo-yellow text-xs">→</span>
                <img src="/img/India.svg" alt="Inde" className="w-8 h-5 rounded-sm shadow-md" />
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/img/SRM.png" alt="SRM" className="w-10 h-10 rounded-xl shadow-lg object-contain" />
              <div>
                <span className="font-display font-bold text-white text-lg tracking-tight block">TogoIndia</span>
                <span className="text-[10px] text-gray-500">SRM Community</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {lang === 'fr'
                ? 'La plateforme qui connecte les étudiants togolais en Inde. Ensemble, on est plus forts.'
                : 'The platform connecting Togolese students in India. Together we are stronger.'}
            </p>
            <div className="flex gap-2">
              {[
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Github, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="p-2.5 bg-white/[0.03] rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              {lang === 'fr' ? 'Navigation' : 'Navigation'}
            </h4>
            <div className="space-y-3">
              {[
                { href: '/feed', label: lang === 'fr' ? 'Fil d\'actualité' : 'Feed' },
                { href: '/search', label: lang === 'fr' ? 'Rechercher' : 'Search' },
                { href: '/forum', label: 'Forum' },
                { href: '/guide', label: lang === 'fr' ? 'Guide' : 'Guide' },
                { href: '/messages', label: lang === 'fr' ? 'Messages' : 'Messages' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              {lang === 'fr' ? 'Communauté' : 'Community'}
            </h4>
            <div className="space-y-3">
              {[
                { href: '/mentorship', label: lang === 'fr' ? 'Mentorat' : 'Mentorship' },
                { href: '/events', label: lang === 'fr' ? 'Événements' : 'Events' },
                { href: '/opportunities', label: lang === 'fr' ? 'Opportunités' : 'Opportunities' },
                { href: '/map', label: lang === 'fr' ? 'Carte' : 'Map' },
                { href: '/notifications', label: lang === 'fr' ? 'Notifications' : 'Notifications' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              {lang === 'fr' ? 'Contact' : 'Contact'}
            </h4>
            <p className="text-sm text-gray-400 mb-3">togoinde@gmail.com</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>{lang === 'fr' ? 'Fondé en 2022' : 'Founded in 2022'}</p>
              <p>{lang === 'fr' ? 'Communauté officielle' : 'Official community'}</p>
            </div>

            {/* Flags showcase */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <img src="/img/Togo.png" alt="Drapeau du Togo" className="w-10 h-[26px] rounded shadow-md" />
                <span className="text-[9px] text-gray-500">Togo</span>
              </div>
              <span className="text-togo-yellow text-sm">⟷</span>
              <div className="flex flex-col items-center gap-1">
                <img src="/img/India.svg" alt="Drapeau de l'Inde" className="w-10 h-[26px] rounded shadow-md" />
                <span className="text-[9px] text-gray-500">India</span>
              </div>
              <span className="text-togo-yellow text-sm">⟷</span>
              <div className="flex flex-col items-center gap-1">
                <img src="/img/SRM.png" alt="SRM Logo" className="w-10 h-10 rounded-lg shadow-md object-contain" />
                <span className="text-[9px] text-gray-500">SRM</span>
              </div>
            </div>
          </div>
        </div>

        {/* African divider */}
        <div className="african-divider my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TogoIndia. {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            {lang === 'fr' ? 'Fait avec' : 'Made with'} <Heart size={13} className="text-togo-red" /> {lang === 'fr' ? 'par  SALIFOU Aleheri Christian' : 'by the ALEHERI CHRISTIAN SALIFOU'}
          </p>
        </div>
      </div>
    </footer>
  );
}
