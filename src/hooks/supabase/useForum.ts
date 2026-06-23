'use client';

import { useEffect, useState } from 'react';
import { getForumQuestion, getForumQuestions, voteForumAnswer, voteForumQuestion } from '../../lib/supabase/services/forum';
import type { ForumAnswerPublic, ForumQuestionPublic } from '../../lib/supabase/types';

export function useForumQuestions() {
  const [data, setData] = useState<ForumQuestionPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getForumQuestions()
      .then((result) => {
        if (!active) return;
        if (result.error) throw result.error;
        setData(result.data || []);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Erreur Supabase');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}

export function useForumQuestion(id?: string, userId?: string) {
   const [data, setData] = useState<(ForumQuestionPublic & { answers: ForumAnswerPublic[] }) | null>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
     if (!id) return;
     let active = true;
     setLoading(true);

     getForumQuestion(id)
       .then((result) => {
         if (!active) return;
         if (result.error) throw result.error;
         setData(result.data);
         setError(null);
       })
       .catch((err) => {
         if (!active) return;
         setError(err.message || 'Erreur Backend');
       })
       .finally(() => {
         if (active) setLoading(false);
       });

     return () => {
       active = false;
     };
   }, [id]);

   const voteQuestion = async (questionId: string, value: -1 | 1) => voteForumQuestion(questionId, value, userId);
   const voteAnswer = async (answerId: string, value: -1 | 1) => voteForumAnswer(answerId, value, userId);

   return { data, loading, error, voteQuestion, voteAnswer };
 }
