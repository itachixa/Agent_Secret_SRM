'use client';

import { useEffect, useState } from 'react';
import { createPost, createPostComment, getPosts, toggleBookmarkPost, toggleLikePost } from '../../lib/supabase/services/posts';
import type { PostType, PublicPost } from '../../lib/supabase/types';

export function useFeed(type: PostType | 'all' = 'all', userId?: string) {
  const [data, setData] = useState<PublicPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    const result = await getPosts(type);
    if (result.error) {
      setError(result.error.message);
    } else {
      setData(result.data || []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, [type]);

  const create = async (input: { content: string; type: PostType; tags?: string[]; images?: string[] }) => {
    const result = await createPost(input);
    if (result.error) return result;
    await reload();
    return result;
  };

  const like = async (postId: string, liked: boolean) => {
    const result = await toggleLikePost(postId, liked, userId);
    if (result.error) return result;
    await reload();
    return result;
  };

  const comment = async (postId: string, content: string) => {
    const result = await createPostComment(postId, content, userId);
    if (result.error) return result;
    await reload();
    return result;
  };

  const bookmark = async (postId: string, bookmarked: boolean) => {
    const result = await toggleBookmarkPost(postId, bookmarked, userId);
    if (result.error) return result;
    await reload();
    return result;
  };

  return { data, loading, error, reload, create, like, comment, bookmark };
}
