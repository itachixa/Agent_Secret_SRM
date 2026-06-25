'use client';

import { useApp } from '@/lib/context';
import { useEvents } from '@/hooks/supabase/useEvents';
import {
  Calendar, MapPin, Clock, Users,
  CalendarPlus, Check, Sparkles
} from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useState } from 'react';

const typeBadgeColors: Record<string, string> = {
  meetup: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  conference: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  cultural: 'bg-togo-green/15 text-togo-green border border-togo-green/20',
  sports: 'bg-togo-yellow/15 text-togo-yellow border border-togo-yellow/20',
  other: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
};

export default function EventsPage() {
  const { t, lang } = useApp();
  const [attendingEvents, setAttendingEvents] = useState<Set<string>>(new Set());
  const locale = lang === 'fr' ? fr : enUS;
  const { data: events, loading, error } = useEvents();

  const upcomingEvents = (events || []).filter((e: any) => isAfter(new Date(e.date), new Date()));
  const pastEvents = (events || []).filter((e: any) => !isAfter(new Date(e.date), new Date()));

  const toggleAttend = (eventId: string) => {
    const newSet = new Set(attendingEvents);
    if (newSet.has(eventId)) newSet.delete(eventId);
    else newSet.add(eventId);
    setAttendingEvents(newSet);
  };

  if (loading) return <div className="page-container max-w-5xl mx-auto"><div className="text-center py-12">Chargement...</div></div>;

  return (
    <div className="page-container max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="section-title">{t('events.title')}</h1>
        <p className="text-gray-400 mt-1 text-sm">
          {lang === 'fr' ? 'Meetups, conférences et activités culturelles togolaises en Inde' : 'Meetups, conferences and Togolese cultural activities in India'}
        </p>
      </div>

      {/* Upcoming Events */}
      <div className="flex items-center gap-2 mb-5">
        <Calendar size={20} className="text-togo-green" />
        <h2 className="text-xl font-display font-bold text-white">{t('events.upcoming')}</h2>
      </div>

      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {upcomingEvents.map((event: any, i: number) => {
            const isAttending = attendingEvents.has(event.id);

            return (
              <div key={event.id} className="glass-card-hover overflow-hidden group animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                {event.image && (
                  <div className="h-44 overflow-hidden relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-togo-dark via-togo-dark/30 to-transparent" />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${typeBadgeColors[event.type]}`}>
                      {event.type}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-white text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{event.description}</p>

                  <div className="flex flex-col gap-2.5 mt-4 text-sm text-gray-500">
                    <span className="flex items-center gap-2.5">
                      <Calendar size={14} className="text-togo-green" />
                      {format(new Date(event.date), 'EEEE dd MMMM yyyy', { locale })}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <Clock size={14} className="text-togo-yellow" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <MapPin size={14} className="text-togo-red" />
                      {event.location}, {event.city}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <Users size={14} className="text-purple-400" />
                      {event.attendeesCount || 0} {t('events.attendees')}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleAttend(event.id)}
                    className={`mt-5 flex items-center gap-2 btn-outline text-sm ${isAttending ? 'bg-togo-green/15 text-togo-green border-togo-green/20' : ''}`}
                  >
                    <Check size={14} /> {isAttending ? t('events.attending') : t('events.attend')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">{lang === 'fr' ? 'Aucun événement à venir' : 'No upcoming events'}</div>
      )}
    </div>
  );
}