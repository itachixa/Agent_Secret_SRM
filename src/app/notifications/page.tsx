'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { notifications as initialNotifications } from '@/data/notifications';
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
  const [notifs, setNotifs] = useState(initialNotifications);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.read === (filter === 'read'));
  const unreadCount = notifs.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

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
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm text-togo-green hover:bg-togo-green/10 rounded-xl transition-colors"
          >
            <CheckCheck size={16} />
            {t('notifications.markAll')}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: lang === 'fr' ? 'Toutes' : 'All' },
          { key: 'unread', label: lang === 'fr' ? 'Non lues' : 'Unread' },
          { key: 'read', label: lang === 'fr' ? 'Lues' : 'Read' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === key ? 'bg-togo-green/20 text-togo-green' : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            {label}
            {key === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 w-5 h-5 inline-flex items-center justify-center bg-togo-red text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">{t('notifications.empty')}</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const Icon = notifIcons[notif.type] || Bell;
            const color = notifColors[notif.type] || 'text-gray-400 bg-gray-400/10';

            return (
              <div
                key={notif.id}
                className={`glass-card-hover p-4 flex items-start gap-3 group ${
                  !notif.read ? 'border-l-2 border-togo-green bg-togo-green/5' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={notif.link}
                    onClick={() => markAsRead(notif.id)}
                    className="block"
                  >
                    <p className={`text-sm ${!notif.read ? 'text-white font-medium' : 'text-gray-300'}`}>
                      {notif.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale })}
                    </p>
                  </Link>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-1.5 text-gray-400 hover:text-togo-green hover:bg-white/5 rounded-lg transition-colors"
                      title="Marquer comme lu"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(notif.id)}
                    className="p-1.5 text-gray-400 hover:text-togo-red hover:bg-white/5 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
