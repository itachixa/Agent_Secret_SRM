'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/context';
import { forumQuestions } from '@/data/forum';
import { users, currentUser } from '@/data/users';
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
  const question = forumQuestions.find(q => q.id === questionId);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [answerContent, setAnswerContent] = useState('');
  const [localAnswers, setLocalAnswers] = useState(question?.answers || []);

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

  const author = users.find(u => u.id === question.authorId);
  const questionVotes = votes[`q-${question.id}`] ?? question.votes;

  const handleVoteQuestion = (delta: number) => {
    setVotes(prev => ({ ...prev, [`q-${question.id}`]: (prev[`q-${question.id}`] ?? question.votes) + delta }));
  };

  const handleVoteAnswer = (answerId: string, delta: number) => {
    setVotes(prev => ({ ...prev, [`a-${answerId}`]: (prev[`a-${answerId}`] ?? localAnswers.find(a => a.id === answerId)?.votes ?? 0) + delta }));
  };

  const handleSubmitAnswer = () => {
    if (!answerContent.trim()) return;
    const newAnswer = {
      id: `a-${Date.now()}`,
      authorId: currentUser.id,
      content: answerContent,
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
    };
    setLocalAnswers(prev => [...prev, newAnswer]);
    setAnswerContent('');
  };

  return (
    <div className="page-container max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/forum" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> {lang === 'fr' ? 'Retour au forum' : 'Back to forum'}
      </Link>

      {/* Question */}
      <div className="glass-card p-6 mb-6">
        <div className="flex gap-4">
          {/* Votes */}
          <div className="flex flex-col items-center gap-1 min-w-[48px]">
            <button onClick={() => handleVoteQuestion(1)} className="p-1 text-gray-400 hover:text-togo-green transition-colors">
              <ThumbsUp size={18} />
            </button>
            <span className="font-bold text-white text-lg">{questionVotes}</span>
            <button onClick={() => handleVoteQuestion(-1)} className="p-1 text-gray-400 hover:text-togo-red transition-colors">
              <ThumbsDown size={18} />
            </button>
          </div>

          {/* Content */}
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
              {question.tags.map((tag) => (
                <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <Link href={`/profile/${author?.id}`} className="flex items-center gap-2 group">
                <img src={author?.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-white/10 group-hover:ring-togo-green/50 transition-all" />
                <div>
                  <span className="font-medium text-white text-sm group-hover:text-togo-green transition-colors">{author?.name}</span>
                  <span className={`ml-2 badge-${author?.badge}`}>{t(`profile.badge.${author?.badge}`)}</span>
                </div>
              </Link>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} />
          {localAnswers.length} {t('forum.answers')}
        </h2>

        <div className="space-y-4">
          {localAnswers.sort((a, b) => {
            if (a.isAccepted) return -1;
            if (b.isAccepted) return 1;
            return (votes[`a-${b.id}`] ?? b.votes) - (votes[`a-${a.id}`] ?? a.votes);
          }).map((answer) => {
            const answerAuthor = users.find(u => u.id === answer.authorId);
            const answerVotes = votes[`a-${answer.id}`] ?? answer.votes;

            return (
              <div key={answer.id} className={`glass-card p-5 ${answer.isAccepted ? 'border border-togo-green/30 bg-togo-green/5' : ''}`}>
                <div className="flex gap-4">
                  {/* Votes */}
                  <div className="flex flex-col items-center gap-1 min-w-[40px]">
                    <button onClick={() => handleVoteAnswer(answer.id, 1)} className="p-1 text-gray-400 hover:text-togo-green transition-colors">
                      <ThumbsUp size={16} />
                    </button>
                    <span className="font-bold text-white">{answerVotes}</span>
                    <button onClick={() => handleVoteAnswer(answer.id, -1)} className="p-1 text-gray-400 hover:text-togo-red transition-colors">
                      <ThumbsDown size={16} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {answer.isAccepted && (
                      <div className="flex items-center gap-1.5 text-togo-green text-sm font-medium mb-2">
                        <Award size={16} /> {t('forum.accepted')}
                      </div>
                    )}
                    <p className="text-gray-300 leading-relaxed">{answer.content}</p>

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                      <Link href={`/profile/${answerAuthor?.id}`} className="flex items-center gap-2 group">
                        <img src={answerAuthor?.avatar} alt="" className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{answerAuthor?.name}</span>
                      </Link>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true, locale })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Answer */}
      <div className="glass-card p-5">
        <h3 className="font-display font-bold text-white mb-3">
          {lang === 'fr' ? 'Votre réponse' : 'Your answer'}
        </h3>
        <textarea
          value={answerContent}
          onChange={(e) => setAnswerContent(e.target.value)}
          placeholder={lang === 'fr' ? 'Écrivez votre réponse...' : 'Write your answer...'}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-togo-green/50 resize-none min-h-[120px]"
          rows={4}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleSubmitAnswer}
            disabled={!answerContent.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} /> {t('forum.answer')}
          </button>
        </div>
      </div>
    </div>
  );
}
