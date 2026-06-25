'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { useFeed } from '@/hooks/supabase/useFeed';
import {
  Heart, MessageCircle, Share2, MoreHorizontal, Image,
  Send, Bookmark, AlertTriangle, Lightbulb, Camera, Globe, BookOpen,
  TrendingUp, Hash, Users, Briefcase, Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const postTypeIcons: Record<string, any> = {
  advice: Lightbulb, experience: BookOpen, alert: AlertTriangle, photo: Camera, general: Globe,
};

const postTypeColors: Record<string, string> = {
  advice: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  experience: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  alert: 'bg-togo-red/15 text-togo-red border border-togo-red/20',
  photo: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  general: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
};

const trendingTags = ['SRM', 'Chennai', 'Visa', 'Logement', 'Bourse', 'Stage', 'Delhi', 'IIT'];
const mockCurrentUser = { id: '1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current' };
const mockSuggestedUsers = [
  { id: '2', name: 'Kofi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi', field: 'Computer Science', badge: 'mentor' },
  { id: '3', name: 'Ama', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ama', field: 'Medicine', badge: 'alumni' },
  { id: '4', name: 'Yaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yaw', field: 'MBA', badge: 'active' },
];

export default function FeedPage() {
  const { t, lang } = useApp();
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<string>('general');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<string>('all');
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const locale = lang === 'fr' ? fr : enUS;
  const { data: posts, loading, error, reload, create, like, comment, bookmark } = useFeed(filter as any);

  const toggleComments = (postId: string) => {
    const newSet = new Set(expandedComments);
    if (newSet.has(postId)) newSet.delete(postId);
    else newSet.add(postId);
    setExpandedComments(newSet);
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;
    await create({ content: postContent, type: postType as any });
    setPostContent('');
    setPostType('general');
  };

  const handleComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    await comment(postId, content);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    toggleComments(postId);
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  if (loading) return <div className="page-container max-w-6xl mx-auto"><div className="text-center py-12">Chargement...</div></div>;

  return (
    <div className="page-container max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="section-title mb-6">{t('feed.title')}</h1>

          <div className="glass-card p-5 mb-6">
            <div className="flex gap-3">
              <img src={mockCurrentUser.avatar} alt="" className="w-11 h-11 rounded-full ring-2 ring-white/[0.08]" />
              <div className="flex-1">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder={t('feed.placeholder')}
                  className="w-full bg-transparent text-white placeholder:text-gray-600 resize-none focus:outline-none min-h-[80px] text-sm leading-relaxed"
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                  <div className="flex gap-1">
                    {['general', 'advice', 'experience', 'alert', 'photo'].map((type) => {
                      const Icon = postTypeIcons[type];
                      return (
                        <button key={type} onClick={() => setPostType(type)} className={`p-2 rounded-xl transition-all ${postType === type ? postTypeColors[type] : 'text-gray-500 hover:bg-white/[0.04]'}`} title={t(`feed.${type}`)}>
                          <Icon size={18} />
                        </button>
                      );
                    })}
                    <button className="p-2 text-gray-500 hover:bg-white/[0.04] rounded-xl transition-colors">
                      <Image size={18} />
                    </button>
                  </div>
                  <button onClick={handlePost} disabled={!postContent.trim()} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                    <Send size={14} /> {t('feed.post')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            {['all', 'general', 'advice', 'experience', 'alert', 'photo'].map((type) => (
              <button key={type} onClick={() => setFilter(type)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === type ? 'bg-togo-green/15 text-togo-green border border-togo-green/20' : 'text-gray-400 hover:bg-white/[0.04] border border-transparent'}`}>
                {type === 'all' ? t('search.all') : t(`feed.${type}`)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {(posts || []).map((post: any) => {
              const author = { id: post.authorId, name: post.authorName, avatar: post.authorAvatar, badge: 'active', isOnline: false };
              const TypeIcon = postTypeIcons[post.type] || Globe;
              const isLiked = post.isLiked || false;
              const isExpanded = expandedComments.has(post.id);
              const isSaved = savedPosts.has(post.id);

              return (
                <article key={post.id} className="glass-card overflow-hidden animate-slide-up">
                  <div className="p-4 flex items-center justify-between">
                    <Link href={`/profile/${author.id}`} className="flex items-center gap-3 group">
                      <div className="relative">
                        <img src={author.avatar} alt={author.name} className="w-11 h-11 rounded-full ring-2 ring-white/[0.08] group-hover:ring-togo-green/40 transition-all" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm group-hover:text-togo-green transition-colors">{author.name}</span>
                          <span className={`badge-${author.badge}`}>{t(`profile.badge.${author.badge}`)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale })}</span>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${postTypeColors[post.type]}`}>
                        <TypeIcon size={12} /> {t(`feed.${post.type}`)}
                      </span>
                      <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.04] rounded-lg">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="px-4 pb-3">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-[15px]">{post.content}</p>
                    {(post.images || []).map((img: string, idx: number) => (
                      <div key={idx} className="mt-3 rounded-xl overflow-hidden border border-white/[0.04]">
                        <img src={img} alt="" className="w-full object-cover max-h-[400px]" />
                      </div>
                    ))}
                    {(post.tags || []).map((tag: string) => (
                      <div key={tag} className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs text-togo-green bg-togo-green/[0.08] px-2.5 py-0.5 rounded-full">#{tag}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-3 border-t border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <button onClick={() => like(post.id, isLiked)} className={`flex items-center gap-1.5 text-sm transition-all ${isLiked ? 'text-togo-red' : 'text-gray-400 hover:text-togo-red'}`}>
                        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                        <span>{post.likeCount || 0}</span>
                      </button>
                      <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                        <MessageCircle size={18} />
                        <span>{post.commentCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                    <button onClick={() => toggleSave(post.id)} className={`transition-colors ${isSaved ? 'text-togo-yellow' : 'text-gray-400 hover:text-togo-yellow'}`}>
                      <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:block space-y-5">
          <div className="glass-card p-5">
            <h3 className="font-display font-bold text-white text-sm mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-togo-green" />
              {lang === 'fr' ? 'Tendances' : 'Trending'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-full text-sm text-gray-300 hover:text-white transition-all">
                  <Hash size={12} className="text-togo-green" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-display font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Users size={16} className="text-togo-yellow" />
              {lang === 'fr' ? 'Personnes à suivre' : 'People to follow'}
            </h3>
            <div className="space-y-3">
              {mockSuggestedUsers.map((user) => (
                <Link key={user.id} href={`/profile/${user.id}`} className="flex items-center gap-3 group">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full ring-1 ring-white/[0.08] group-hover:ring-togo-green/40 transition-all" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-togo-green transition-colors">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.field}</p>
                  </div>
                  <span className={`badge-${user.badge} text-[10px]`}>{t(`profile.badge.${user.badge}`)}</span>
                </Link>
              ))}
            </div>
            <Link href="/search" className="btn-ghost w-full mt-3 text-sm justify-center flex">
              {lang === 'fr' ? 'Voir plus' : 'See more'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}