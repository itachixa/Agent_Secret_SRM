'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { conversations, messages } from '@/data/mentorships';
import { users, currentUser } from '@/data/users';
import {
  Send, Search, ArrowLeft, Phone, Video, MoreVertical,
  Image as ImageIcon, Paperclip, Smile
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

export default function MessagesPage() {
  const { t, lang } = useApp();
  const locale = lang === 'fr' ? fr : enUS;
  const [selectedConvId, setSelectedConvId] = useState<string | null>(conversations[0]?.id || null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [localMessages, setLocalMessages] = useState(messages);

  const selectedConv = conversations.find(c => c.id === selectedConvId);
  const convMessages = selectedConvId ? (localMessages[selectedConvId] || []) : [];

  const getOtherParticipant = (conv: typeof conversations[0]) => {
    const otherId = conv.participants.find(p => p !== currentUser.id);
    return users.find(u => u.id === otherId);
  };

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherParticipant(conv);
    return other?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSend = () => {
    if (!messageInput.trim() || !selectedConvId) return;
    const otherId = selectedConv?.participants.find(p => p !== currentUser.id) || '';
    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: otherId,
      content: messageInput,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setLocalMessages(prev => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), newMsg],
    }));
    setMessageInput('');
  };

  return (
    <div className="h-[calc(100vh-7rem)] lg:h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
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
          {filteredConversations.map((conv) => {
            const other = getOtherParticipant(conv);
            if (!other) return null;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors text-left ${
                  selectedConvId === conv.id ? 'bg-togo-green/[0.06] border-l-2 border-togo-green' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={other.avatar} alt={other.name} className="w-12 h-12 rounded-full ring-2 ring-white/[0.06]" />
                  {other.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-togo-darker" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm truncate">{other.name}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false, locale })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-sm text-gray-400 truncate pr-2">
                      {conv.lastMessage.senderId === currentUser.id ? (lang === 'fr' ? 'Vous: ' : 'You: ') : ''}
                      {conv.lastMessage.content}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-togo-green text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConv ? (
        <div className={`flex-1 flex flex-col ${!selectedConvId ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/[0.06] bg-togo-dark/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedConvId(null)} className="md:hidden p-1.5 text-gray-400 hover:text-white">
                <ArrowLeft size={20} />
              </button>
              {(() => {
                const other = getOtherParticipant(selectedConv);
                return (
                  <>
                    <div className="relative">
                      <img src={other?.avatar} alt="" className="w-9 h-9 rounded-full ring-2 ring-white/[0.08]" />
                      {other?.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-togo-dark" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{other?.name}</p>
                      <p className="text-xs text-gray-400">
                        {other?.isOnline ? (lang === 'fr' ? 'En ligne' : 'Online') : (lang === 'fr' ? 'Hors ligne' : 'Offline')}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors">
                <Phone size={18} />
              </button>
              <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors">
                <Video size={18} />
              </button>
              <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {convMessages.map((msg, idx) => {
              const isMine = msg.senderId === currentUser.id;
              const sender = users.find(u => u.id === msg.senderId);
              const showAvatar = !isMine && (idx === 0 || convMessages[idx - 1]?.senderId !== msg.senderId);
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isMine ? 'flex-row-reverse' : ''}`}>
                  {!isMine && (
                    showAvatar ? (
                      <img src={sender?.avatar} alt="" className="w-8 h-8 rounded-full ring-1 ring-white/[0.06] flex-shrink-0 mt-1" />
                    ) : (
                      <div className="w-8 flex-shrink-0" />
                    )
                  )}
                  <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 ${
                      isMine
                        ? 'bg-gradient-to-r from-togo-green to-emerald-600 text-white rounded-2xl rounded-br-md'
                        : 'bg-white/[0.04] text-gray-200 rounded-2xl rounded-bl-md border border-white/[0.04]'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    <p className={`text-2xs text-gray-500 mt-1 px-1 ${isMine ? 'text-right' : ''}`}>
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors">
                <ImageIcon size={18} />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('messages.placeholder')}
                className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-togo-green/40"
              />
              <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors">
                <Smile size={18} />
              </button>
              <button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className="p-2.5 bg-togo-green text-white rounded-xl hover:bg-togo-green/80 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mx-auto mb-5">
              <Send size={28} className="text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">{t('messages.noMessages')}</p>
            <p className="text-gray-500 text-sm mt-1">{lang === 'fr' ? 'Sélectionnez une conversation' : 'Select a conversation'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
