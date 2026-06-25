'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { useProfiles } from '@/hooks/supabase/useProfiles';
import { useFeed } from '@/hooks/supabase/useFeed';
import {
  MapPin, Building2, GraduationCap, Heart, MessageCircle,
  UserPlus, Download, Instagram, Linkedin, Twitter, MessageSquare,
  Edit3, Settings, ExternalLink, Users, Share2, Award, Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { t, lang } = useApp();
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'skills'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const { data: profiles = [], loading: profilesLoading } = useProfiles();
  const { data: allPosts = [], loading: postsLoading } = useFeed('all');

  const user = profiles.find((u: any) => u.id === params.id) || {} as any;
  const isOwnProfile = false;
  const userPosts = allPosts?.filter((p: any) => p.authorId === params.id) || [];
  const locale = lang === 'fr' ? fr : enUS;

  if (profilesLoading || postsLoading) return <div className="page-container max-w-4xl mx-auto"><div className="text-center py-12">Chargement...</div></div>;

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="relative h-52 lg:h-64 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-togo-green/30 via-togo-yellow/15 to-togo-red/25" />
      </div>

      <div className="relative -mt-16 lg:-mt-20 px-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-5">
          <div className="relative">
            <img src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.id || 'unknown')} alt={user?.full_name || 'Inconnu'} className="w-28 h-28 lg:w-36 lg:h-36 rounded-2xl ring-4 ring-togo-dark" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-white">{user.full_name}</h1>
            <p className="text-gray-400 mt-1 text-sm">{user.field} &middot; {user.level}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Building2 size={14} /> {user.university}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {user.city}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6 text-sm">
          <span><span className="font-bold text-white text-lg">{userPosts.length}</span> {t('profile.posts')}</span>
          <span><span className="font-bold text-white text-lg">{user.followersCount || 0}</span> {t('profile.followers')}</span>
          <span><span className="font-bold text-white text-lg">{user.followingCount || 0}</span> {t('profile.following')}</span>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex gap-2 mb-5">
          {['posts', 'about', 'skills'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-togo-green/15 text-togo-green border border-togo-green/20' : 'text-gray-400 hover:bg-white/[0.04]'}`}>
              {t(`profile.tab.${tab}`)}
            </button>
          ))}
        </div>

        {activeTab === 'posts' && (
          <div className="space-y-4">
            {userPosts.map((post: any) => (
              <div key={post.id} className="glass-card p-5">
                <p className="text-gray-300">{post.content}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Heart size={12} /> {post.likeCount || 0}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} /> {post.commentCount || 0}</span>
                </div>
              </div>
            ))}
            {userPosts.length === 0 && <div className="text-center py-8 text-gray-400">Aucun post</div>}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-3">{t('profile.about')}</h3>
            <p className="text-gray-300 leading-relaxed">{user.bio || 'Aucune bio'}</p>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-3">{t('profile.skills')}</h3>
            <div className="flex flex-wrap gap-2">
              {(user.skills || []).map((skill: string) => (
                <span key={skill} className="px-3 py-1 bg-white/[0.03] text-gray-300 rounded-lg text-sm">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}