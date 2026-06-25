'use client';

import { useApp } from '@/lib/context';
import { useMentorship } from '@/hooks/supabase/useMentorship';
import {
  Users, Star, ArrowRight, Clock,
  Award, Heart, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  active: 'bg-togo-green/15 text-togo-green border border-togo-green/20',
  pending: 'bg-togo-yellow/15 text-togo-yellow border border-togo-yellow/20',
  completed: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
};

export default function MentorshipPage() {
  const { t, lang } = useApp();
  const { mentors, mentorships, loading, error } = useMentorship();

  if (loading) return <div className="page-container"><div className="text-center py-12">Chargement...</div></div>;

  const activeMentorships = mentorships.filter((m: any) => m.status === 'active');

  return (
    <div className="page-container max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="section-title">{t('mentorship.title')}</h1>
        <p className="text-gray-400 mt-1 text-sm">
          {lang === 'fr' ? 'Les anciens aident les nouveaux à réussir en Inde' : 'Seniors help newcomers succeed in India'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 text-center group">
          <Star size={28} className="mx-auto text-togo-yellow mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-3xl font-display font-bold text-white">{mentors.length}</div>
          <div className="text-sm text-gray-400 mt-1">{lang === 'fr' ? 'Mentors disponibles' : 'Available mentors'}</div>
        </div>
        <div className="glass-card p-5 text-center group">
          <Users size={28} className="mx-auto text-togo-green mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-3xl font-display font-bold text-white">{activeMentorships.length}</div>
          <div className="text-sm text-gray-400 mt-1">{lang === 'fr' ? 'Mentorats actifs' : 'Active mentorships'}</div>
        </div>
        <div className="glass-card p-5 text-center group">
          <Award size={28} className="mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-3xl font-display font-bold text-white">95%</div>
          <div className="text-sm text-gray-400 mt-1">{lang === 'fr' ? 'Taux de satisfaction' : 'Satisfaction rate'}</div>
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card p-6 lg:p-8 mb-8">
        <h2 className="text-xl font-display font-bold text-white mb-6">
          {lang === 'fr' ? 'Comment ça marche ?' : 'How it works?'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: 1, color: 'togo-green', title: lang === 'fr' ? 'Choisissez un mentor' : 'Choose a mentor', desc: lang === 'fr' ? 'Parcourez les profils des mentors disponibles dans votre domaine.' : 'Browse available mentor profiles in your field.' },
            { num: 2, color: 'togo-yellow', title: lang === 'fr' ? 'Envoyez une demande' : 'Send a request', desc: lang === 'fr' ? 'Décrivez vos objectifs et ce que vous aimeriez apprendre.' : 'Describe your goals and what you would like to learn.' },
            { num: 3, color: 'togo-red', title: lang === 'fr' ? 'Grandissez ensemble' : 'Grow together', desc: lang === 'fr' ? 'Échangez régulièrement avec votre mentor et atteignez vos objectifs.' : 'Connect regularly with your mentor and achieve your goals.' },
          ].map(({ num, color, title, desc }) => (
            <div key={num} className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-${color}/15 flex items-center justify-center flex-shrink-0`}>
                <span className={`text-${color} font-bold`}>{num}</span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{title}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Mentors */}
      <h2 className="text-xl font-display font-bold text-white mb-5 flex items-center gap-2">
        <Sparkles size={20} className="text-togo-yellow" />
        {lang === 'fr' ? 'Mentors disponibles' : 'Available mentors'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {mentors.map((mentor: any) => (
          <Link key={mentor.id} href={`/profile/${mentor.id}`} className="glass-card-hover p-5 group">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <img src={mentor.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + mentor.id} alt={mentor.full_name} className="w-14 h-14 rounded-full ring-2 ring-white/[0.08] group-hover:ring-togo-green/40 transition-all" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white group-hover:text-togo-green transition-colors">{mentor.full_name}</h3>
                  <span className={`badge-${mentor.badge}`}>{t(`profile.badge.${mentor.badge}`)}</span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">{mentor.field} &middot; {mentor.level}</p>
                <p className="text-xs text-gray-500 mt-0.5">{mentor.university} &middot; {mentor.city}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}