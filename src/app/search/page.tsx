'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { users } from '@/data/users';
import {
  Search, MapPin, Building2, GraduationCap,
  Star, Users, X, SlidersHorizontal, LayoutGrid, List
} from 'lucide-react';

const cities = ['All', 'Chennai', 'Delhi', 'Bangalore', 'Vellore', 'Manipal', 'Ahmedabad'];
const fields = ['All', 'Computer Science', 'Medicine', 'Business Administration', 'Data Science', 'Civil Engineering', 'Pharmacy', 'Architecture', 'Biotechnology', 'Law', 'Economics'];
const levels = ['All', 'Bachelor', 'Master', 'Doctorate'];
const badges = ['All', 'founder', 'mentor', 'alumni', 'active', 'new'];

export default function SearchPage() {
  const { t, lang } = useApp();
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedField, setSelectedField] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showMentorsOnly, setShowMentorsOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredUsers = users.filter((user) => {
    if (showMentorsOnly && user.badge !== 'mentor') return false;
    if (query && !user.name.toLowerCase().includes(query.toLowerCase()) && !user.university.toLowerCase().includes(query.toLowerCase()) && !user.city.toLowerCase().includes(query.toLowerCase())) return false;
    if (selectedCity !== 'All' && user.city !== selectedCity) return false;
    if (selectedField !== 'All' && user.field !== selectedField) return false;
    if (selectedLevel !== 'All' && user.level !== selectedLevel) return false;
    if (selectedBadge !== 'All' && user.badge !== selectedBadge) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedCity('All');
    setSelectedField('All');
    setSelectedLevel('All');
    setSelectedBadge('All');
    setQuery('');
    setShowMentorsOnly(false);
  };

  const hasActiveFilters = selectedCity !== 'All' || selectedField !== 'All' || selectedLevel !== 'All' || selectedBadge !== 'All' || query || showMentorsOnly;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="section-title">{t('search.title')}</h1>
          <p className="text-gray-400 mt-1 text-sm">{filteredUsers.length} {t('search.results')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMentorsOnly(!showMentorsOnly)}
            className={`btn-outline flex items-center gap-2 text-sm ${showMentorsOnly ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' : ''}`}
          >
            <Star size={16} /> {t('search.mentors')}
          </button>
          <div className="hidden sm:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'text-gray-500'}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'text-gray-500'}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="input-field pl-11"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-togo-green/15 text-togo-green border-togo-green/20' : ''}`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">{lang === 'fr' ? 'Filtres' : 'Filters'}</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">{t('search.city')}</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="input-field py-2 text-sm">
                {cities.map((c) => <option key={c} value={c}>{c === 'All' ? t('search.all') : c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">{t('search.field')}</label>
              <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} className="input-field py-2 text-sm">
                {fields.map((f) => <option key={f} value={f}>{f === 'All' ? t('search.all') : f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">{t('search.level')}</label>
              <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="input-field py-2 text-sm">
                {levels.map((l) => <option key={l} value={l}>{l === 'All' ? t('search.all') : l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">{t('search.badge')}</label>
              <select value={selectedBadge} onChange={(e) => setSelectedBadge(e.target.value)} className="input-field py-2 text-sm">
                {badges.map((b) => <option key={b} value={b}>{b === 'All' ? t('search.all') : t(`profile.badge.${b}`)}</option>)}
              </select>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <button onClick={clearFilters} className="mt-3 text-sm text-togo-red flex items-center gap-1 hover:underline">
            <X size={14} /> {lang === 'fr' ? 'Effacer les filtres' : 'Clear filters'}
          </button>
        )}
      </div>

      {/* Results */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        {filteredUsers.map((user) => (
          <Link key={user.id} href={`/profile/${user.id}`} className="glass-card-hover p-5 group">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <img src={user.avatar} alt={user.name} className={`${viewMode === 'grid' ? 'w-16 h-16' : 'w-14 h-14'} rounded-full ring-2 ring-white/[0.08] group-hover:ring-togo-green/40 transition-all`} />
                {user.isOnline && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-togo-dark" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white group-hover:text-togo-green transition-colors">{user.name}</h3>
                  <span className={`badge-${user.badge}`}>{t(`profile.badge.${user.badge}`)}</span>
                </div>
                <p className="text-sm text-gray-400 truncate mt-0.5">{user.field} &middot; {user.level}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Building2 size={12} /> {user.university.split(' ').slice(0, 2).join(' ')}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {user.city}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {user.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="text-xs bg-white/[0.03] text-gray-300 px-2.5 py-0.5 rounded-full border border-white/[0.04]">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-white/[0.04] text-xs text-gray-500">
              <span className="flex items-center gap-1"><Users size={12} /> {user.followers.length} {t('profile.followers')}</span>
              <span>{user.friends.length} {t('profile.friends')}</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-5">
            <Search size={32} className="text-gray-600" />
          </div>
          <p className="text-gray-400 text-lg">{t('search.noResults')}</p>
          <button onClick={clearFilters} className="btn-outline mt-4 text-sm">
            {lang === 'fr' ? 'Effacer les filtres' : 'Clear filters'}
          </button>
        </div>
      )}
    </div>
  );
}
