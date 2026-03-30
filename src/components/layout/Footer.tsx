'use client';

import Link from 'next/link';
import { Heart, Github, Twitter, Instagram, Mail, ExternalLink } from 'lucide-react';
import { useApp } from '@/lib/context';

export function Footer() {
  const { lang } = useApp();

  return (
    <footer className="hidden lg:block bg-togo-darker/80 border-t border-white/[0.04] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-togo-green via-togo-yellow to-togo-red flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-togo-green/20">
                TG
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">TogoIndia</span>
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
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
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
