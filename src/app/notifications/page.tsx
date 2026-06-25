'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { useNotifications } from '@/hooks/supabase/useNotifications';
import {
  Bell, Heart, MessageCircle, UserPlus, Briefcase, Calendar,
  Users, Check, CheckCheck, Trash2, Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const notifIcons: Record<string, any> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  message: MessageCircle,
  opportunity: Briefcase,
  event: Calendar,
  mentorship: Users,
};

const notifColors: Record<string, string> = {
  like: 'text-togo-red bg-togo-red/10',
  comment: 'text-blue-400 bg-blue-400/10',
  follow: 'text-togo-green bg-togo-green/10',
  message: 'text-purple-400 bg-purple-400/10',
  opportunity: 'text-togo-yellow bg-togo-yellow/10',
  event: 'text-pink-400 bg-pink-400/10',
  mentorship: 'text-cyan-400 bg-cyan-400/10',
};

export default function NotificationsPage() {
  const { t, lang } = useApp();
  const locale = lang === 'fr' ? fr : enUS;
  const [filter, setFilter] = useState<string>('all');
  const { data: notifs, loading, error } = useNotifications(filter === 'unread' ? 'unread' : undefined);

  if (loading) return <div className="page-container max-w-2xl mx-auto"><div className="text-center py-12">Chargement...</div></div>;

  const unreadCount = (notifs || []).filter((n: any) => !n.read).length;

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Bell size={28} />
            {t('notifications.title')}
          </h1>
          {unreadCount > 0 && (
            <p className="text-gray-400 mt-1">{unreadCount} non lues</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'unread'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-togo-green/15 text-togo-green border border-togo-green/20' : 'text-gray-400 hover:bg-white/[0.04] border border-transparent'}`}>
            {f === 'all' ? t('notifications.all') : t('notifications.unread')}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {(notifs || []).map((notif: any) => {
          const Icon = notifIcons[notif.type] || Bell;
          const colors = notifColors[notif.type] || 'text-gray-400 bg-gray-400/10';
          return (
            <div key={notif.id} className={`glass-card-hover p-4 flex gap-3 ${!notif.read ? 'border-l-2 border-togo-green' : ''}`}>
              <div className={`w-10 h-10 rounded-xl ${colors} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200">{notif.content}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}