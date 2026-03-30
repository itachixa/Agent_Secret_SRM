'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { users } from '@/data/users';
import {
  Users, Globe, Building2, GraduationCap, MapPin, MessageSquare,
  Briefcase, Calendar, BookOpen, ArrowRight, Star, Sparkles,
  Heart, ChevronRight, Zap, Shield, TrendingUp, Quote,
  Play, CheckCircle2, Rocket, Target, Award, Lightbulb
} from 'lucide-react';

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 50, suffix: '+', icon: Users, labelKey: 'home.stats.students', color: 'text-togo-green' },
  { value: 15, suffix: '+', icon: Building2, labelKey: 'home.stats.universities', color: 'text-togo-yellow' },
  { value: 8, suffix: '', icon: MapPin, labelKey: 'home.stats.cities', color: 'text-blue-400' },
  { value: 12, suffix: '', icon: GraduationCap, labelKey: 'home.stats.mentors', color: 'text-purple-400' },
];

const features = [
  { key: 'profiles', icon: Users, href: '/search', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
  { key: 'feed', icon: Globe, href: '/feed', color: 'from-togo-green to-emerald-600', shadow: 'shadow-togo-green/20' },
  { key: 'map', icon: MapPin, href: '/map', color: 'from-red-500 to-pink-600', shadow: 'shadow-red-500/20' },
  { key: 'mentorship', icon: Star, href: '/mentorship', color: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20' },
  { key: 'opportunities', icon: Briefcase, href: '/opportunities', color: 'from-togo-yellow to-amber-600', shadow: 'shadow-togo-yellow/20' },
  { key: 'forum', icon: MessageSquare, href: '/forum', color: 'from-cyan-500 to-teal-600', shadow: 'shadow-cyan-500/20' },
  { key: 'events', icon: Calendar, href: '/events', color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/20' },
  { key: 'guide', icon: BookOpen, href: '/guide', color: 'from-orange-500 to-red-600', shadow: 'shadow-orange-500/20' },
];

const testimonials = [
  { name: 'Kofi Mensah', role: 'Computer Science, SRM', text: 'Grâce à TogoIndia, j\'ai trouvé des mentors qui m\'ont aidé à décrocher mon stage chez Infosys.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi&backgroundColor=b6e3f4' },
  { name: 'Ama Diallo', role: 'Medicine, AIIMS Delhi', text: 'Cette communauté m\'a sauvée lors de mon arrivée. Pas de stress, tout était expliqué.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ama&backgroundColor=ffd5dc' },
  { name: 'Yaw Boateng', role: 'MBA, IIM Bangalore', text: 'Le réseau TogoIndia m\'a ouvert des portes que je n\'aurais jamais imaginées.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yaw&backgroundColor=c0aede' },
];

const activityFeed = [
  { user: 'Efua', action: 'a rejoint la communauté', time: 'Il y a 2h', icon: Users, color: 'text-togo-green' },
  { user: 'Kwame', action: 'a partagé une opportunité de stage', time: 'Il y a 5h', icon: Briefcase, color: 'text-togo-yellow' },
  { user: 'Abena', action: 'a publié un conseil', time: 'Il y a 1j', icon: Lightbulb, color: 'text-purple-400' },
  { user: 'Yao', action: 'a trouvé un mentor', time: 'Il y a 2j', icon: Star, color: 'text-blue-400' },
];

export default function HomePage() {
  const { t, lang } = useApp();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredStudents = users.slice(0, 6);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-togo-green/[0.07] via-togo-dark/50 to-togo-darker" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-togo-green/[0.06] rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-togo-yellow/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-togo-red/[0.04] rounded-full blur-[120px]" />

        {/* African Pattern Overlay */}
        <div className="absolute inset-0 african-pattern-overlay pointer-events-none" />
        <div className="absolute inset-0 mudcloth-bg pointer-events-none" />

        {/* Kente border top */}
        <div className="absolute top-0 left-0 right-0 h-1 kente-border" />

        <div className="relative page-container pt-20 lg:pt-28 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Flags Banner */}
            <div className="flex items-center justify-center gap-4 mb-8 animate-slide-up">
              <img src="/img/Togo.png" alt="Drapeau du Togo" className="w-12 h-8 rounded shadow-lg flag-wave" />
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-togo-yellow/50" />
                <img src="/img/SRM.png" alt="SRM University" className="w-12 h-12 rounded-xl shadow-lg object-contain bg-white/5 p-1" />
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-india-saffron/50" />
              </div>
              <img src="/img/India.svg" alt="Drapeau de l'Inde" className="w-12 h-8 rounded shadow-lg" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-togo-green/[0.08] border border-togo-green/[0.15] rounded-full text-togo-green text-sm font-medium mb-8 animate-slide-up">
              <Sparkles size={16} className="animate-bounce-subtle" />
              <span>{lang === 'fr' ? 'Plus de 50 étudiants connectés' : 'Over 50 students connected'}</span>
              <ChevronRight size={14} />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-extrabold leading-[1.1] tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-white">{t('home.hero.title')}</span>
              <br />
              <span className="gradient-text text-4xl md:text-5xl lg:text-7xl flex items-center justify-center gap-3 mt-2">
                <img src="/img/Togo.png" alt="Togo" className="w-10 h-7 md:w-14 md:h-9 lg:w-16 lg:h-10 rounded shadow-md inline-block" />
                <span className="text-togo-yellow">{'\u2192'}</span>
                <img src="/img/India.svg" alt="India" className="w-10 h-7 md:w-14 md:h-9 lg:w-16 lg:h-10 rounded shadow-md inline-block" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {t('home.hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 flex items-center gap-2 group">
                {t('home.hero.cta')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/feed" className="btn-outline text-lg px-10 py-4 flex items-center gap-2">
                <Play size={18} />
                {lang === 'fr' ? 'Explorer' : 'Explore'}
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-togo-green" /> {lang === 'fr' ? '100% gratuit' : '100% free'}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-togo-green" /> {lang === 'fr' ? 'Vérifié par la communauté' : 'Community verified'}</span>
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-togo-yellow" /> {lang === 'fr' ? 'Inscription rapide' : 'Quick signup'}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="stat-card group">
                <stat.icon size={28} className={`mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                <div className="text-4xl font-display font-bold text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-400 mt-1.5">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* African divider */}
      <div className="african-divider" />

      {/* Features Section */}
      <section className="page-container py-20 lg:py-28">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-togo-green/[0.08] border border-togo-green/[0.12] rounded-full text-togo-green text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap size={12} /> {lang === 'fr' ? 'Fonctionnalités' : 'Features'}
          </span>
          <h2 className="section-title text-3xl lg:text-4xl">{t('home.features.title')}</h2>
          <p className="section-subtitle text-lg max-w-xl mx-auto">{t('home.features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {features.map(({ key, icon: Icon, href, color, shadow }, i) => (
            <Link
              key={key}
              href={href}
              className="feature-card group animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg ${shadow} transition-all duration-300`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1.5">{t(`home.feature.${key}.title`)}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{t(`home.feature.${key}.desc`)}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-togo-green opacity-0 group-hover:opacity-100 transition-opacity">
                {lang === 'fr' ? 'Explorer' : 'Explore'} <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Activity + Featured Students */}
      <section className="page-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Students */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-togo-yellow/[0.08] border border-togo-yellow/[0.12] rounded-full text-togo-yellow text-xs font-semibold uppercase tracking-wider mb-3">
                  <Award size={12} /> {lang === 'fr' ? 'Communauté' : 'Community'}
                </span>
                <h2 className="section-title">{lang === 'fr' ? 'Membres en vedette' : 'Featured Members'}</h2>
                <p className="section-subtitle">{lang === 'fr' ? 'Découvrez quelques membres de notre communauté' : 'Meet some of our community members'}</p>
              </div>
              <Link href="/search" className="hidden sm:flex items-center gap-2 text-togo-green hover:underline font-medium text-sm">
                {t('common.seeAll')} <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {featuredStudents.map((user, i) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className="glass-card-hover p-5 text-center group animate-slide-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="relative mx-auto w-20 h-20 mb-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full ring-2 ring-white/10 group-hover:ring-togo-green/50 transition-all duration-300"
                    />
                    {user.isOnline && (
                      <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-togo-dark animate-pulse" />
                    )}
                  </div>
                  <h3 className="font-semibold text-white text-sm truncate group-hover:text-togo-green transition-colors">{user.name}</h3>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{user.field}</p>
                  <p className="text-2xs text-gray-500 truncate mt-0.5">{user.city}</p>
                  <span className={`inline-block mt-2.5 badge-${user.badge}`}>
                    {t(`profile.badge.${user.badge}`)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-togo-green rounded-full animate-pulse" />
              {lang === 'fr' ? 'Activité récente' : 'Recent Activity'}
            </h3>
            <div className="space-y-3">
              {activityFeed.map((item, i) => (
                <div key={i} className="glass-card p-4 flex items-start gap-3 group hover:border-white/10 transition-all">
                  <div className={`w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">{item.user}</span> {item.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/feed" className="btn-ghost w-full mt-4 text-sm justify-center flex items-center gap-2">
              {lang === 'fr' ? 'Voir toute l\'activité' : 'See all activity'} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="page-container py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/[0.08] border border-purple-500/[0.12] rounded-full text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Quote size={12} /> {lang === 'fr' ? 'Témoignages' : 'Testimonials'}
          </span>
          <h2 className="section-title">{lang === 'fr' ? 'Ce que disent nos membres' : 'What our members say'}</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-togo-green/[0.05] rounded-full blur-[60px]" />
            <Quote size={40} className="text-togo-green/20 mb-6" />
            <p className="text-lg lg:text-xl text-gray-200 leading-relaxed mb-8">
              &ldquo;{testimonials[currentTestimonial].text}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <img
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].name}
                className="w-12 h-12 rounded-full ring-2 ring-togo-green/30"
              />
              <div>
                <p className="font-semibold text-white">{testimonials[currentTestimonial].name}</p>
                <p className="text-sm text-gray-400">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
            {/* Dots */}
            <div className="flex gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentTestimonial ? 'w-8 bg-togo-green' : 'w-1.5 bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="page-container py-20 relative">
        <div className="absolute inset-0 mudcloth-bg pointer-events-none opacity-30" />
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-togo-yellow/[0.08] border border-togo-yellow/[0.12] rounded-full text-togo-yellow text-xs font-semibold uppercase tracking-wider mb-4">
            <Target size={12} /> {lang === 'fr' ? 'Comment ça marche' : 'How it works'}
          </span>
          <h2 className="section-title">{lang === 'fr' ? 'Rejoignez en 3 étapes' : 'Join in 3 steps'}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: '01', title: lang === 'fr' ? 'Créez votre profil' : 'Create your profile', desc: lang === 'fr' ? 'Inscrivez-vous en moins de 2 minutes avec vos informations académiques.' : 'Sign up in under 2 minutes with your academic info.', icon: Users },
            { step: '02', title: lang === 'fr' ? 'Connectez-vous' : 'Connect', desc: lang === 'fr' ? 'Trouvez d\'autres étudiants, suivez des mentors et rejoignez les discussions.' : 'Find other students, follow mentors and join discussions.', icon: Heart },
            { step: '03', title: lang === 'fr' ? 'Profitez' : 'Enjoy', desc: lang === 'fr' ? 'Accédez aux opportunités, événements et à toute la communauté.' : 'Access opportunities, events and the full community.', icon: Rocket },
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-togo-green/20 to-togo-green/5 border border-togo-green/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon size={28} className="text-togo-green" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-togo-yellow rounded-full flex items-center justify-center text-xs font-bold text-togo-dark">
                  {item.step}
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-container py-20 relative">
        <div className="african-divider mb-10" />
        <div className="relative glass-card p-10 lg:p-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-togo-green/[0.06] via-togo-yellow/[0.03] to-togo-red/[0.06]" />
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-togo-green/[0.06] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-togo-red/[0.06] rounded-full blur-[100px]" />

          <div className="relative">
            {/* Flags in CTA */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src="/img/Togo.png" alt="Togo" className="w-10 h-7 rounded shadow-md" />
              <img src="/img/SRM.png" alt="SRM" className="w-10 h-10 rounded-xl shadow-lg object-contain bg-white/5 p-0.5" />
              <img src="/img/India.svg" alt="India" className="w-10 h-7 rounded shadow-md" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-togo-green/[0.1] border border-togo-green/[0.15] rounded-full text-togo-green text-sm font-medium mb-6">
              <TrendingUp size={16} />
              <span>{lang === 'fr' ? 'Rejoignez les 50+ étudiants' : 'Join 50+ students'}</span>
            </div>
            <h2 className="section-title text-3xl lg:text-5xl text-balance">{t('home.cta.title')}</h2>
            <p className="text-gray-400 mt-5 text-lg max-w-xl mx-auto leading-relaxed">{t('home.cta.desc')}</p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 flex items-center gap-2 group">
                {t('home.cta.button')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/guide" className="btn-outline text-lg px-10 py-4">
                {lang === 'fr' ? 'Lire le guide' : 'Read the guide'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <section className="page-container pb-12">
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-card overflow-hidden">
          <div className="absolute inset-0 african-pattern-overlay pointer-events-none opacity-50" />
          <div className="relative flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/img/Togo.png" alt="Togo" className="w-10 h-7 rounded shadow-md" />
              <span className="text-togo-yellow text-lg">⟷</span>
              <img src="/img/India.svg" alt="India" className="w-10 h-7 rounded shadow-md" />
            </div>
            <div className="h-10 w-px bg-white/10" />
            <img src="/img/SRM.png" alt="SRM" className="w-10 h-10 rounded-xl shadow-lg object-contain" />
            <div>
              <p className="font-display font-bold text-white">TogoIndia</p>
              <p className="text-sm text-gray-400">{lang === 'fr' ? 'La communauté togolaise en Inde' : 'The Togolese community in India'}</p>
            </div>
          </div>
          <div className="relative flex items-center gap-3">
            <Link href="/auth/register" className="btn-primary text-sm">
              {lang === 'fr' ? 'Rejoindre' : 'Join now'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
