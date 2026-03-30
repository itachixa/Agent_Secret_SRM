'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { users } from '@/data/users';
import Link from 'next/link';
import { MapPin, Users, ExternalLink } from 'lucide-react';

const cityCoords: Record<string, { x: number; y: number }> = {
  'Delhi': { x: 45, y: 28 },
  'Chennai': { x: 55, y: 72 },
  'Bangalore': { x: 47, y: 65 },
  'Vellore': { x: 53, y: 69 },
  'Manipal': { x: 44, y: 62 },
  'Ahmedabad': { x: 34, y: 40 },
};

const cityColors: Record<string, string> = {
  'Delhi': '#3b82f6',
  'Chennai': '#009639',
  'Bangalore': '#8b5cf6',
  'Vellore': '#f59e0b',
  'Manipal': '#ec4899',
  'Ahmedabad': '#06b6d4',
};

const cityGroups = users.reduce((acc, user) => {
  if (!acc[user.city]) acc[user.city] = [];
  acc[user.city].push(user);
  return acc;
}, {} as Record<string, typeof users>);

export default function MapPage() {
  const { t, lang } = useApp();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const totalStudents = users.length;

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">{t('map.title')}</h1>
        <p className="text-gray-400 mt-1">{t('map.subtitle')}</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-white">{totalStudents}</p>
          <p className="text-xs text-gray-400 mt-1">{lang === 'fr' ? 'Étudiants' : 'Students'}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-white">{Object.keys(cityGroups).length}</p>
          <p className="text-xs text-gray-400 mt-1">{lang === 'fr' ? 'Villes' : 'Cities'}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-white">6</p>
          <p className="text-xs text-gray-400 mt-1">{lang === 'fr' ? 'États' : 'States'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 glass-card p-6 relative min-h-[500px]">
          <div className="relative w-full h-full min-h-[460px]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* India Outline */}
              <path
                d="M30,12 L38,8 L45,7 L52,8 L58,10 L63,14 L68,20 L70,28 L72,35 L70,42 L68,48 L65,54 L62,58 L58,62 L55,66 L52,70 L50,74 L48,78 L52,82 L55,85 L52,88 L48,86 L44,82 L40,78 L37,74 L34,68 L32,62 L30,56 L28,50 L26,44 L27,38 L28,32 L30,25 L30,18 Z"
                fill="rgba(255,255,255,0.02)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.4"
              />
              {/* Southern India */}
              <path
                d="M48,78 L44,82 L40,86 L38,90 L40,92 L44,90 L48,86 L52,82 L50,78"
                fill="rgba(255,255,255,0.015)"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.3"
              />

              {/* Connection Lines */}
              {Object.entries(cityCoords).map(([city, coords]) => {
                const isSelected = selectedCity === city;
                const isHovered = hoveredCity === city;
                if (!isSelected && !isHovered) return null;
                return Object.entries(cityCoords)
                  .filter(([otherCity]) => otherCity !== city)
                  .map(([otherCity, otherCoords]) => (
                    <line
                      key={`${city}-${otherCity}`}
                      x1={coords.x}
                      y1={coords.y}
                      x2={otherCoords.x}
                      y2={otherCoords.y}
                      stroke={cityColors[city] || '#009639'}
                      strokeWidth="0.15"
                      strokeOpacity="0.3"
                      strokeDasharray="1,1"
                    />
                  ));
              })}

              {/* City Markers */}
              {Object.entries(cityGroups).map(([city, cityUsers]) => {
                const coords = cityCoords[city];
                if (!coords) return null;
                const isSelected = selectedCity === city;
                const isHovered = hoveredCity === city;
                const size = Math.min(16 + cityUsers.length * 4, 32);
                const color = cityColors[city] || '#009639';

                return (
                  <g
                    key={city}
                    onClick={() => setSelectedCity(isSelected ? null : city)}
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulse Ring */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={size / 3 + 3}
                        fill="none"
                        stroke={color}
                        strokeWidth="0.3"
                        strokeOpacity="0.4"
                      >
                        <animate attributeName="r" from={size / 3} to={size / 3 + 6} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Outer Glow */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={size / 3 + 1}
                      fill={color}
                      fillOpacity={isSelected ? 0.2 : isHovered ? 0.15 : 0.08}
                    />

                    {/* Main Circle */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={size / 4}
                      fill={color}
                      fillOpacity={isSelected ? 0.6 : 0.35}
                      stroke={color}
                      strokeWidth="0.4"
                      strokeOpacity={isSelected ? 0.9 : 0.6}
                    />

                    {/* Center Dot */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={size / 8}
                      fill={color}
                      fillOpacity={0.9}
                    />

                    {/* City Name */}
                    <text
                      x={coords.x}
                      y={coords.y + size / 4 + 3}
                      textAnchor="middle"
                      fill={isSelected || isHovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)'}
                      fontSize="2.5"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {city}
                    </text>
                    <text
                      x={coords.x}
                      y={coords.y + size / 4 + 5.5}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.35)"
                      fontSize="1.8"
                    >
                      {cityUsers.length} {lang === 'fr' ? 'étudiants' : 'students'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* City List */}
        <div className="space-y-3">
          <h2 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
            {lang === 'fr' ? 'Villes' : 'Cities'}
          </h2>
          {Object.entries(cityGroups)
            .sort(([, a], [, b]) => b.length - a.length)
            .map(([city, cityUsers]) => {
              const color = cityColors[city] || '#009639';
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                  className={`w-full text-left glass-card-hover p-4 transition-all ${
                    selectedCity === city ? 'ring-1' : ''
                  }`}
                  style={selectedCity === city ? { borderColor: color, boxShadow: `0 0 20px ${color}15` } : {}}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-semibold text-white">{city}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-400 bg-white/[0.03] px-2 py-0.5 rounded-full">
                      <Users size={11} /> {cityUsers.length}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {cityUsers.slice(0, 5).map((user) => (
                      <Link key={user.id} href={`/profile/${user.id}`} onClick={(e) => e.stopPropagation()}>
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full ring-2 ring-togo-dark hover:ring-togo-green/40 transition-all"
                          title={user.name}
                        />
                      </Link>
                    ))}
                    {cityUsers.length > 5 && (
                      <span className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-xs text-gray-400 ring-2 ring-togo-dark">
                        +{cityUsers.length - 5}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* Selected City Detail */}
      {selectedCity && cityGroups[selectedCity] && (
        <div className="mt-6 glass-card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-white text-xl flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cityColors[selectedCity] || '#009639' }} />
              {lang === 'fr' ? `Étudiants à ${selectedCity}` : `Students in ${selectedCity}`}
            </h3>
            <span className="text-sm text-gray-400">{cityGroups[selectedCity].length} {lang === 'fr' ? 'étudiants' : 'students'}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cityGroups[selectedCity].map((user) => (
              <Link key={user.id} href={`/profile/${user.id}`} className="glass-card-hover p-4 flex items-center gap-3 group">
                <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full ring-2 ring-white/[0.06] group-hover:ring-togo-green/40 transition-all" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-togo-green transition-colors">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.field}</p>
                  <span className={`badge-${user.badge} mt-1 inline-block`} style={{ fontSize: '10px', padding: '1px 6px' }}>{t(`profile.badge.${user.badge}`)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
