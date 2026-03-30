'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import {
  Home, Newspaper, Search, MapPin, Briefcase, MessageSquare,
  Users, Calendar, BookOpen, MessageCircle, Bell, User,
  Menu, X, ChevronDown, LogOut, Settings
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { currentUser as defaultUser } from '@/data/users';

const mainNavItems = [
  { href: '/', icon: Home, key: 'nav.home' },
  { href: '/feed', icon: Newspaper, key: 'nav.feed' },
  { href: '/search', icon: Search, key: 'nav.search' },
  { href: '/map', icon: MapPin, key: 'nav.map' },
  { href: '/opportunities', icon: Briefcase, key: 'nav.opportunities' },
  { href: '/forum', icon: MessageSquare, key: 'nav.forum' },
  { href: '/mentorship', icon: Users, key: 'nav.mentorship' },
  { href: '/events', icon: Calendar, key: 'nav.events' },
  { href: '/guide', icon: BookOpen, key: 'nav.guide' },
];

const bottomNavItems = [
  { href: '/', icon: Home, key: 'nav.home' },
  { href: '/feed', icon: Newspaper, key: 'nav.feed' },
  { href: '/search', icon: Search, key: 'nav.search' },
  { href: '/opportunities', icon: Briefcase, key: 'nav.opportunities' },
  { href: '/profile', icon: User, key: 'nav.profile' },
];

export function Navbar() {
  const { t, sidebarOpen, setSidebarOpen, lang } = useApp();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setProfileOpen(false);
  }, [pathname, setSidebarOpen]);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 flex-col">
        <div className="h-[3px] kente-border-thin" />
        <div className="h-16 bg-togo-dark/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center">
              <img src="/img/Togo.png" alt="Togo" className="w-7 h-[18px] rounded-sm shadow-md flag-wave" />
              <div className="mx-1.5 text-togo-yellow text-xs font-bold opacity-60">→</div>
              <img src="/img/SRM.png" alt="SRM" className="w-7 h-7 rounded-lg shadow-md object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-white text-lg tracking-tight leading-none">TogoIndia</span>
              <span className="text-[9px] text-gray-500 leading-none mt-0.5">SRM Community</span>
            </div>
          </Link>

          <div className="flex items-center gap-0.5">
            {mainNavItems.map(({ href, icon: Icon, key }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <Icon size={16} />
                  <span className="hidden xl:inline">{t(key)}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link
              href="/messages"
              className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                pathname === '/messages' ? 'text-togo-green bg-togo-green/15' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <MessageCircle size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-togo-red rounded-full border-2 border-togo-dark animate-pulse" />
            </Link>
            <Link
              href="/notifications"
              className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                pathname === '/notifications' ? 'text-togo-green bg-togo-green/15' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-togo-yellow rounded-full border-2 border-togo-dark" />
            </Link>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[0.04] transition-colors ml-1"
              >
                <img
                  src={defaultUser.avatar}
                  alt={defaultUser.name}
                  className="w-8 h-8 rounded-full ring-2 ring-togo-green/40"
                />
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-togo-dark/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                  <div className="p-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <img src={defaultUser.avatar} alt={defaultUser.name} className="w-10 h-10 rounded-full ring-2 ring-togo-green/30" />
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{defaultUser.name}</p>
                        <p className="text-xs text-gray-400 truncate">{defaultUser.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/[0.04] rounded-xl transition-colors">
                      <User size={16} className="text-gray-500" /> {t('nav.profile')}
                    </Link>
                    <Link href="/notifications" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/[0.04] rounded-xl transition-colors">
                      <Bell size={16} className="text-gray-500" /> {t('nav.notifications')}
                    </Link>
                    <Link href="/profile/edit" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/[0.04] rounded-xl transition-colors">
                      <Settings size={16} className="text-gray-500" /> {lang === 'fr' ? 'Paramètres' : 'Settings'}
                    </Link>
                    <div className="border-t border-white/[0.06] mt-1 pt-1">
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-togo-red hover:bg-white/[0.04] rounded-xl transition-colors">
                        <LogOut size={16} /> {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-togo-dark/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative flex items-center">
              <img src="/img/Togo.png" alt="Togo" className="w-6 h-4 rounded-sm shadow-md" />
              <div className="mx-1 text-togo-yellow text-[10px] font-bold opacity-60">→</div>
              <img src="/img/SRM.png" alt="SRM" className="w-6 h-6 rounded-md shadow-md object-contain" />
            </div>
            <span className="font-display font-bold text-white tracking-tight">TogoIndia</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <LanguageToggle />
            <Link href="/notifications" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-togo-yellow rounded-full" />
            </Link>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-400 hover:text-white transition-colors">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-14 bottom-16 w-72 bg-togo-dark/95 backdrop-blur-xl border-l border-white/[0.06] animate-slide-in-right overflow-y-auto">
            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <img src={defaultUser.avatar} alt={defaultUser.name} className="w-12 h-12 rounded-full ring-2 ring-togo-green/40" />
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{defaultUser.name}</p>
                  <p className="text-sm text-gray-400 truncate">{defaultUser.university}</p>
                </div>
              </div>
            </div>
            <div className="p-3">
              {mainNavItems.map(({ href, icon: Icon, key }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-togo-green/15 text-togo-green' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon size={20} />
                    {t(key)}
                  </Link>
                );
              })}
              <div className="border-t border-white/[0.06] mt-2 pt-2">
                <Link
                  href="/messages"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04]"
                >
                  <MessageCircle size={20} />
                  {t('nav.messages')}
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04]"
                >
                  <User size={20} />
                  {t('nav.profile')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-togo-dark/90 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="h-full flex items-center justify-around px-2">
          {bottomNavItems.map(({ href, icon: Icon, key }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all min-w-[56px] ${
                  isActive ? 'text-togo-green' : 'text-gray-500'
                }`}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium">{t(key)}</span>
                {isActive && <span className="w-1 h-1 bg-togo-green rounded-full mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
