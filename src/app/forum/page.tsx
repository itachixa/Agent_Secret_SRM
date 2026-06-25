'use client';

import Link from 'next/link';
import { useApp } from '@/lib/context';
import { useForumQuestions } from '@/hooks/supabase/useForum';
import {
  MessageSquare, ThumbsUp, CheckCircle, Clock,
  Plus, Tag, ArrowUp, ArrowDown
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

export default function ForumPage() {
  const { t, lang } = useApp();
  const locale = lang === 'fr' ? fr : enUS;
  const { data: forumQuestions, loading, error } = useForumQuestions();
  const sortedQuestions = [...(forumQuestions || [])].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="section-title">{t('forum.title')}</h1>
          <p className="text-gray-400 mt-1 text-sm">{sortedQuestions.length} {lang === 'fr' ? 'questions' : 'questions'}</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> {t('forum.ask')}
        </button>
      </div>

      {loading && <div className="text-center py-8 text-gray-400">Chargement...</div>}

      <div className="space-y-3">
        {sortedQuestions.map((q, i) => {
          return (
            <Link key={q.id} href={`/forum/${q.id}`} className="glass-card-hover p-5 block group animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1 min-w-[48px]">
                  <button className="p-1 text-gray-400 hover:text-togo-green transition-colors">
                    <ArrowUp size={16} />
                  </button>
                  <span className="font-bold text-white text-lg">{q.votes || 0}</span>
                  <button className="p-1 text-gray-400 hover:text-togo-red transition-colors">
                    <ArrowDown size={16} />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-white group-hover:text-togo-green transition-colors leading-snug">
                      {q.title}
                    </h2>
                    {q.resolved && (
                      <span className="flex-shrink-0 flex items-center gap-1 text-xs text-togo-green bg-togo-green/10 px-2.5 py-1 rounded-full border border-togo-green/15">
                        <CheckCircle size={12} /> {t('forum.resolved')}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">{q.content}</p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <img src={q.authorAvatar || ''} alt="" className="w-5 h-5 rounded-full ring-1 ring-white/10" />
                      {q.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true, locale })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} />
                      {q.answerCount || 0} {t('forum.answers')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(q.tags || []).map((tag) => (
                      <span key={tag} className="text-xs bg-white/[0.03] text-gray-400 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/[0.04]">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}