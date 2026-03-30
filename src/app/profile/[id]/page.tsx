'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { users, currentUser } from '@/data/users';
import { posts } from '@/data/posts';
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

  const user = users.find((u) => u.id === params.id) || currentUser;
  const isOwnProfile = user.id === currentUser.id;
  const userPosts = posts.filter((p) => p.authorId === user.id);
  const locale = lang === 'fr' ? fr : enUS;

  const socialIcons: Record<string, any> = {
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    whatsapp: MessageSquare,
  };

  const joinDate = new Date(user.joinedAt);
  const memberSince = formatDistanceToNow(joinDate, { addSuffix: true, locale });

  return (
    <div className="page-container max-w-4xl mx-auto">
      {/* Cover */}
      <div className="relative h-52 lg:h-64 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-togo-green/30 via-togo-yellow/15 to-togo-red/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-togo-dark/60 to-transparent" />
        <div className="absolute top-6 right-6 flex gap-2">
          {isOwnProfile && (
            <>
              <Link href="/profile/edit" className="p-2.5 bg-black/40 backdrop-blur-sm text-white rounded-xl hover:bg-black/60 transition-colors">
                <Edit3 size={16} />
              </Link>
              <button className="p-2.5 bg-black/40 backdrop-blur-sm text-white rounded-xl hover:bg-black/60 transition-colors">
                <Settings size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative -mt-16 lg:-mt-20 px-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-5">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 lg:w-36 lg:h-36 rounded-2xl ring-4 ring-togo-dark object-cover shadow-xl"
            />
            {user.isOnline && (
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-togo-dark animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-white">{user.name}</h1>
              <span className={`badge-${user.badge} text-sm`}>{t(`profile.badge.${user.badge}`)}</span>
            </div>
            <p className="text-gray-400 mt-1 text-sm">{user.field} &middot; {user.level}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Building2 size={14} className="text-gray-600" /> {user.university}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-600" /> {user.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <>
                <Link href="/profile/edit" className="btn-primary flex items-center gap-2 text-sm">
                  <Edit3 size={14} /> {t('profile.edit')}
                </Link>
                <button className="btn-secondary p-2.5">
                  <Settings size={18} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isFollowing
                      ? 'bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.08]'
                      : 'btn-primary'
                  }`}
                >
                  <UserPlus size={16} />
                  {isFollowing ? t('profile.unfollow') : t('profile.follow')}
                </button>
                <Link href="/messages" className="btn-secondary flex items-center gap-2 text-sm">
                  <MessageCircle size={16} /> {t('profile.message')}
                </Link>
                <button className="btn-secondary p-2.5">
                  <Share2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-6 text-sm">
          <button className="text-gray-400 hover:text-white transition-colors">
            <span className="font-bold text-white text-lg">{userPosts.length}</span>
            <span className="ml-1">{t('profile.posts')}</span>
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <span className="font-bold text-white text-lg">{user.followers.length}</span>
            <span className="ml-1">{t('profile.followers')}</span>
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <span className="font-bold text-white text-lg">{user.following.length}</span>
            <span className="ml-1">{t('profile.following')}</span>
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <span className="font-bold text-white text-lg">{user.friends.length}</span>
            <span className="ml-1">{t('profile.friends')}</span>
          </button>
        </div>

        {/* Bio */}
        <p className="mt-5 text-gray-300 leading-relaxed text-[15px]">{user.bio}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {user.skills.map((skill) => (
            <span key={skill} className="text-xs bg-white/[0.03] text-gray-300 px-3 py-1.5 rounded-full border border-white/[0.06] hover:border-togo-green/20 transition-colors">
              {skill}
            </span>
          ))}
        </div>

        {/* Social & CV */}
        <div className="flex items-center gap-2 mt-4">
          {Object.entries(user.socialLinks).map(([platform, url]) => {
            const Icon = socialIcons[platform] || ExternalLink;
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/[0.03] rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                title={platform}
              >
                <Icon size={18} />
              </a>
            );
          })}
          {user.cvUrl && (
            <a
              href={user.cvUrl}
              className="flex items-center gap-2 px-4 py-2.5 bg-togo-green/[0.08] text-togo-green rounded-xl text-sm font-medium hover:bg-togo-green/[0.15] border border-togo-green/[0.12] transition-all ml-auto"
            >
              <Download size={14} /> {t('profile.downloadCV')}
            </a>
          )}
        </div>

        {/* Member Since */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
          <Calendar size={12} />
          <span>{lang === 'fr' ? 'Membre depuis' : 'Member since'} {memberSince}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mt-8 border-b border-white/[0.06]">
        {(['posts', 'about', 'skills'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab
                ? 'border-togo-green text-togo-green'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'posts' ? t('profile.posts') : tab === 'about' ? (lang === 'fr' ? 'À propos' : 'About') : t('profile.skills')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'posts' && (
          userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <article key={post.id} className="glass-card p-5">
                  <p className="text-gray-200 leading-relaxed text-[15px]">{post.content}</p>
                  {post.images.length > 0 && (
                    <img src={post.images[0]} alt="" className="mt-3 rounded-xl w-full object-cover max-h-[300px]" />
                  )}
                  <div className="flex items-center gap-5 mt-4 pt-4 border-t border-white/[0.04] text-sm text-gray-400">
                    <span className="flex items-center gap-1.5"><Heart size={15} /> {post.likes.length}</span>
                    <span className="flex items-center gap-1.5"><MessageCircle size={15} /> {post.comments.length}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale })}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-5">
                <MessageCircle size={32} className="text-gray-600" />
              </div>
              <p className="text-gray-400">{lang === 'fr' ? 'Aucune publication' : 'No posts yet'}</p>
            </div>
          )
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-togo-green" />
                {t('profile.university')}
              </h3>
              <div className="ml-7">
                <p className="text-white font-medium">{user.university}</p>
                <p className="text-sm text-gray-400 mt-0.5">{user.city}</p>
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <GraduationCap size={18} className="text-togo-green" />
                {t('profile.field')}
              </h3>
              <div className="ml-7">
                <p className="text-white font-medium">{user.field}</p>
                <p className="text-sm text-gray-400 mt-0.5">{user.level}</p>
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <ExternalLink size={18} className="text-togo-green" />
                {t('profile.social')}
              </h3>
              <div className="flex flex-wrap gap-2 ml-7">
                {Object.entries(user.socialLinks).map(([platform, url]) => {
                  const Icon = socialIcons[platform] || ExternalLink;
                  return (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.04] transition-all text-sm">
                      <Icon size={16} /> <span className="capitalize">{platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Award size={18} className="text-togo-green" />
              {t('profile.skills')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {user.skills.map((skill) => (
                <div key={skill} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-togo-green/20 transition-colors">
                  <p className="font-medium text-white text-sm">{skill}</p>
                  <div className="mt-2 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-togo-green to-emerald-400 rounded-full" style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
