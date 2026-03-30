'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { users, currentUser } from '@/data/users';
import { posts as initialPosts } from '@/data/posts';
import { Post } from '@/types';
import {
  Heart, MessageCircle, Share2, MoreHorizontal, Image,
  Send, Bookmark, AlertTriangle, Lightbulb, Camera, Globe, BookOpen,
  TrendingUp, Hash, Users, Briefcase, Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const postTypeIcons: Record<string, any> = {
  advice: Lightbulb,
  experience: BookOpen,
  alert: AlertTriangle,
  photo: Camera,
  general: Globe,
};

const postTypeColors: Record<string, string> = {
  advice: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  experience: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  alert: 'bg-togo-red/15 text-togo-red border border-togo-red/20',
  photo: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  general: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
};

const trendingTags = ['SRM', 'Chennai', 'Visa', 'Logement', 'Bourse', 'Stage', 'Delhi', 'IIT'];

export default function FeedPage() {
  const { t, lang } = useApp();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<string>('general');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<string>('all');
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const locale = lang === 'fr' ? fr : enUS;
  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  const toggleComments = (postId: string) => {
    const newSet = new Set(expandedComments);
    if (newSet.has(postId)) newSet.delete(postId);
    else newSet.add(postId);
    setExpandedComments(newSet);
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const userId = currentUser.id;
      const alreadyLiked = post.likes.includes(userId);
      return {
        ...post,
        likes: alreadyLiked
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId],
      };
    }));
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  const handlePost = () => {
    if (!postContent.trim()) return;
    const newPost: Post = {
      id: String(Date.now()),
      authorId: currentUser.id,
      content: postContent,
      images: [],
      type: postType as Post['type'],
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      tags: [],
    };
    setPosts(prev => [newPost, ...prev]);
    setPostContent('');
    setPostType('general');
  };

  const handleComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comments: [...post.comments, {
          id: `c-${Date.now()}`,
          authorId: currentUser.id,
          content,
          createdAt: new Date().toISOString(),
          likes: [],
        }],
      };
    }));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="page-container max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <h1 className="section-title mb-6">{t('feed.title')}</h1>

          {/* Create Post */}
          <div className="glass-card p-5 mb-6">
            <div className="flex gap-3">
              <img src={currentUser.avatar} alt="" className="w-11 h-11 rounded-full ring-2 ring-white/[0.08]" />
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
                        <button
                          key={type}
                          onClick={() => setPostType(type)}
                          className={`p-2 rounded-xl transition-all ${
                            postType === type ? postTypeColors[type] : 'text-gray-500 hover:bg-white/[0.04]'
                          }`}
                          title={t(`feed.${type}`)}
                        >
                          <Icon size={18} />
                        </button>
                      );
                    })}
                    <button className="p-2 text-gray-500 hover:bg-white/[0.04] rounded-xl transition-colors">
                      <Image size={18} />
                    </button>
                  </div>
                  <button
                    onClick={handlePost}
                    disabled={!postContent.trim()}
                    className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Send size={14} /> {t('feed.post')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            {['all', 'general', 'advice', 'experience', 'alert', 'photo'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === type
                    ? 'bg-togo-green/15 text-togo-green border border-togo-green/20'
                    : 'text-gray-400 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {type === 'all' ? t('search.all') : t(`feed.${type}`)}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const author = users.find((u) => u.id === post.authorId);
              if (!author) return null;

              const TypeIcon = postTypeIcons[post.type];
              const isLiked = post.likes.includes(currentUser.id);
              const isExpanded = expandedComments.has(post.id);
              const isSaved = savedPosts.has(post.id);

              return (
                <article key={post.id} className="glass-card overflow-hidden animate-slide-up">
                  {/* Header */}
                  <div className="p-4 flex items-center justify-between">
                    <Link href={`/profile/${author.id}`} className="flex items-center gap-3 group">
                      <div className="relative">
                        <img src={author.avatar} alt={author.name} className="w-11 h-11 rounded-full ring-2 ring-white/[0.08] group-hover:ring-togo-green/40 transition-all" />
                        {author.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-togo-dark" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm group-hover:text-togo-green transition-colors">{author.name}</span>
                          <span className={`badge-${author.badge}`}>{t(`profile.badge.${author.badge}`)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{author.city}</span>
                          <span>&middot;</span>
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

                  {/* Content */}
                  <div className="px-4 pb-3">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-[15px]">{post.content}</p>
                    {post.images.length > 0 && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-white/[0.04]">
                        <img src={post.images[0]} alt="" className="w-full object-cover max-h-[400px]" />
                      </div>
                    )}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-xs text-togo-green bg-togo-green/[0.08] px-2.5 py-0.5 rounded-full">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-3 border-t border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-sm transition-all ${
                          isLiked ? 'text-togo-red' : 'text-gray-400 hover:text-togo-red'
                        }`}
                      >
                        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'animate-scale-in' : ''} />
                        <span>{post.likes.length}</span>
                      </button>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        <MessageCircle size={18} />
                        <span>{post.comments.length}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                    <button
                      onClick={() => toggleSave(post.id)}
                      className={`transition-colors ${isSaved ? 'text-togo-yellow' : 'text-gray-400 hover:text-togo-yellow'}`}
                    >
                      <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Comments */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-white/[0.04]">
                      {post.comments.map((comment) => {
                        const commentAuthor = users.find((u) => u.id === comment.authorId);
                        if (!commentAuthor) return null;
                        return (
                          <div key={comment.id} className="flex gap-3 py-3 border-b border-white/[0.04] last:border-0">
                            <img src={commentAuthor.avatar} alt="" className="w-8 h-8 rounded-full ring-1 ring-white/[0.06]" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white text-sm">{commentAuthor.name}</span>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 mt-0.5">{comment.content}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <button className="text-xs text-gray-500 hover:text-togo-red flex items-center gap-1 transition-colors">
                                  <Heart size={12} /> {comment.likes.length}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex gap-3 mt-3">
                        <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                            placeholder={t('feed.writeComment')}
                            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-togo-green/40"
                          />
                          <button
                            onClick={() => handleComment(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                            className="p-2 text-togo-green hover:bg-togo-green/10 rounded-full transition-colors disabled:opacity-20"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block space-y-5">
          {/* Trending Tags */}
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

          {/* Suggested Users */}
          <div className="glass-card p-5">
            <h3 className="font-display font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Users size={16} className="text-togo-yellow" />
              {lang === 'fr' ? 'Personnes à suivre' : 'People to follow'}
            </h3>
            <div className="space-y-3">
              {users.slice(3, 7).map((user) => (
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

          {/* Quick Links */}
          <div className="glass-card p-5">
            <h3 className="font-display font-bold text-white text-sm mb-4">
              {lang === 'fr' ? 'Liens rapides' : 'Quick links'}
            </h3>
            <div className="space-y-2">
              {[
                { href: '/guide', label: lang === 'fr' ? 'Guide pour nouveaux' : 'Newcomer guide', icon: BookOpen },
                { href: '/opportunities', label: lang === 'fr' ? 'Dernières opportunités' : 'Latest opportunities', icon: Briefcase },
                { href: '/mentorship', label: lang === 'fr' ? 'Trouver un mentor' : 'Find a mentor', icon: Star },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/[0.04] rounded-xl transition-colors">
                  <Icon size={16} className="text-gray-500" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
