'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/context';
import { useForumQuestion } from '@/hooks/supabase/useForum';
import {
  ArrowLeft, ThumbsUp, ThumbsDown, CheckCircle, Clock,
  MessageSquare, Tag, Send, Award
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

export default function ForumDetailPage() {
  const params = useParams();
  const { t, lang } = useApp();
  const locale = lang === 'fr' ? fr : enUS;
  const questionId = params.id as string;
  const { data: question, loading, error } = useForumQuestion(questionId);
  const [answerContent, setAnswerContent] = useState('');

  if (loading) return <div className="page-container max-w-4xl mx-auto"><div className="text-center py-12">Chargement...</div></div>;

  if (!question) {
    return (
      <div className="page-container max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-display font-bold text-white mb-4">
          {lang === 'fr' ? 'Question non trouvée' : 'Question not found'}
        </h1>
        <Link href="/forum" className="btn-primary">
          <ArrowLeft size={16} className="mr-2" /> {lang === 'fr' ? 'Retour au forum' : 'Back to forum'}
        </Link>
      </div>
    );
  }

  const author = { name: question.authorName, avatar: question.authorAvatar };

  return (
    <div className="page-container max-w-4xl mx-auto">
      <Link href="/forum" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> {lang === 'fr' ? 'Retour au forum' : 'Back to forum'}
      </Link>

      <div className="glass-card p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1 min-w-[48px]">
            <button className="p-1 text-gray-400 hover:text-togo-green transition-colors">
              <ThumbsUp size={18} />
            </button>
            <span className="font-bold text-white text-lg">{question.votes || 0}</span>
            <button className="p-1 text-gray-400 hover:text-togo-red transition-colors">
              <ThumbsDown size={18} />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-xl font-display font-bold text-white leading-snug">{question.title}</h1>
              {question.resolved && (
                <span className="flex-shrink-0 flex items-center gap-1 text-xs text-togo-green bg-togo-green/10 px-2.5 py-1 rounded-full">
                  <CheckCircle size={14} /> {t('forum.resolved')}
                </span>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{question.content}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {(question.tags || []).map((tag: string) => (
                <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Tag size={11} /> {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <img src={author?.avatar || ''} alt="" className="w-5 h-5 rounded-full ring-1 ring-white/10" />
                {author.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="space-y-4">
        {(question.answers || []).map((answer: any, i: number) => (
          <div key={answer.id} className="glass-card p-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1 min-w-[48px]">
                <button className="p-1 text-gray-400 hover:text-togo-green transition-colors">
                  <ThumbsUp size={18} />
                </button>
                <span className="font-bold text-white text-lg">{answer.votes || 0}</span>
                <button className="p-1 text-gray-400 hover:text-togo-red transition-colors">
                  <ThumbsDown size={18} />
                </button>
              </div>

              <div className="flex-1">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{answer.content}</p>

                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <img src={answer.authorAvatar || ''} alt="" className="w-5 h-5 rounded-full ring-1 ring-white/10" />
                    {answer.authorName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}