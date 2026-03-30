'use client';

import { useApp } from '@/lib/context';
import { events } from '@/data/events';
import { users } from '@/data/users';
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

  const upcomingEvents = events.filter((e) => isAfter(new Date(e.date), new Date())).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter((e) => !isAfter(new Date(e.date), new Date()));

  const toggleAttend = (eventId: string) => {
    const newSet = new Set(attendingEvents);
    if (newSet.has(eventId)) newSet.delete(eventId);
    else newSet.add(eventId);
    setAttendingEvents(newSet);
  };

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
          {upcomingEvents.map((event, i) => {
            const organizer = users.find((u) => u.id === event.organizer);
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
                      {event.attendees.length + (isAttending ? 1 : 0)} {t('events.attendees')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.04]">
                    {organizer && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <img src={organizer.avatar} alt="" className="w-6 h-6 rounded-full ring-1 ring-white/10" />
                        <span>{t('events.organizer')}: {organizer.name}</span>
                      </div>
                    )}
                    <button
                      onClick={() => toggleAttend(event.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isAttending
                          ? 'bg-togo-green/15 text-togo-green border border-togo-green/20'
                          : 'btn-primary'
                      }`}
                    >
                      {isAttending ? <><Check size={14} /> {t('events.attending')}</> : <><CalendarPlus size={14} /> {t('events.attend')}</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center mb-12">
          <Sparkles size={32} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400">{lang === 'fr' ? 'Aucun événement à venir' : 'No upcoming events'}</p>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-5">
            <Clock size={20} className="text-gray-400" />
            <h2 className="text-xl font-display font-bold text-white">{t('events.past')}</h2>
          </div>
          <div className="space-y-3">
            {pastEvents.map((event) => (
              <div key={event.id} className="glass-card p-5 opacity-60 hover:opacity-80 transition-opacity">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {format(new Date(event.date), 'dd MMM yyyy', { locale })} &middot; {event.location}, {event.city}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 bg-white/[0.03] px-3 py-1 rounded-full">{event.attendees.length} {t('events.attendees')}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
