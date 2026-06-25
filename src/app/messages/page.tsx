'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { useMessages } from '@/hooks/supabase/useMessages';
import {
  Send, Search, ArrowLeft, Phone, Video, MoreVertical,
  Image as ImageIcon, Paperclip, Smile
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const mockCurrentUser = { id: '1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current' };

export default function MessagesPage() {
  const { t, lang } = useApp();
  const locale = lang === 'fr' ? fr : enUS;
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations, loading, error } = useMessages();

  if (loading) return <div className="h-[calc(100vh-7rem)] flex items-center justify-center">Chargement...</div>;

  return (
    <div className="h-[calc(100vh-7rem)] lg:h-[calc(100vh-4rem)] flex">
      <div className={`w-full md:w-80 lg:w-96 border-r border-white/[0.06] flex flex-col bg-togo-darker ${selectedConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/[0.06]">
          <h1 className="text-lg font-display font-bold text-white mb-3">{t('messages.title')}</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('messages.search')}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-togo-green/40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {(conversations || []).map((conv: any) => (
            <button key={conv.id} onClick={() => setSelectedConvId(conv.id)} className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors text-left">
              <div className="relative flex-shrink-0">
                <img src={conv.otherUserAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + conv.otherUserId} alt="" className="w-12 h-12 rounded-full ring-2 ring-white/[0.06]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm truncate">{conv.otherUserName}</span>
                </div>
                <p className="text-sm text-gray-400 truncate pr-2">{conv.lastMessageContent || ''}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}