'use client';

import { useApp } from '@/lib/context';
import { opportunities } from '@/data/opportunities';
import { users } from '@/data/users';
import {
  Briefcase, GraduationCap, MapPin, Calendar,
  ExternalLink, Clock, DollarSign, Zap
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useState } from 'react';

const typeIcons: Record<string, any> = {
  internship: Briefcase,
  job: DollarSign,
  scholarship: GraduationCap,
  event: Calendar,
};

const typeColors: Record<string, string> = {
  internship: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  job: 'bg-togo-green/15 text-togo-green border border-togo-green/20',
  scholarship: 'bg-togo-yellow/15 text-togo-yellow border border-togo-yellow/20',
  event: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
};

export default function OpportunitiesPage() {
  const { t, lang } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const locale = lang === 'fr' ? fr : enUS;

  const filters = [
    { key: 'all', label: t('search.all') },
    { key: 'internship', label: t('opportunities.internship') },
    { key: 'job', label: t('opportunities.job') },
    { key: 'scholarship', label: t('opportunities.scholarship') },
  ];

  const filtered = activeFilter === 'all'
    ? opportunities
    : opportunities.filter((o) => o.type === activeFilter);

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="section-title">{t('opportunities.title')}</h1>
        <p className="text-gray-400 mt-1 text-sm">
          {lang === 'fr' ? 'Stages, emplois et bourses pour les étudiants togolais' : 'Internships, jobs and scholarships for Togolese students'}
        </p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === f.key
                ? 'bg-togo-green/15 text-togo-green border border-togo-green/20'
                : 'text-gray-400 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((opp, i) => {
          const TypeIcon = typeIcons[opp.type] || Briefcase;
          const poster = users.find((u) => u.id === opp.postedBy);

          return (
            <div key={opp.id} className="glass-card-hover p-6 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${typeColors[opp.type]} flex-shrink-0`}>
                  <TypeIcon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="font-semibold text-white text-lg">{opp.title}</h2>
                      <p className="text-sm text-gray-400 mt-0.5">{opp.company}</p>
                    </div>
                    <a
                      href={opp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm flex-shrink-0 flex items-center gap-2"
                    >
                      {t('opportunities.apply')} <ExternalLink size={14} />
                    </a>
                  </div>

                  <p className="text-sm text-gray-300 mt-3 leading-relaxed">{opp.description}</p>

                  <div className="flex items-center gap-5 mt-4 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1.5"><MapPin size={13} /> {opp.location}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {t('opportunities.deadline')}: {format(new Date(opp.deadline), 'dd MMM yyyy', { locale })}</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {formatDistanceToNow(new Date(opp.createdAt), { addSuffix: true, locale })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[opp.type]}`}>
                      {t(`opportunities.${opp.type}`)}
                    </span>
                    {poster && (
                      <span className="text-xs text-gray-500 flex items-center gap-1.5 ml-auto">
                        <img src={poster.avatar} alt="" className="w-5 h-5 rounded-full ring-1 ring-white/10" />
                        {poster.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-5">
            <Briefcase size={32} className="text-gray-600" />
          </div>
          <p className="text-gray-400 text-lg">{lang === 'fr' ? 'Aucune opportunité trouvée' : 'No opportunities found'}</p>
        </div>
      )}
    </div>
  );
}
