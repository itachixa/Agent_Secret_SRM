'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { currentUser } from '@/data/users';
import {
  ArrowLeft, Camera, Plus, X, Save, User, Mail, Building2,
  MapPin, GraduationCap, FileText, Globe, Instagram, Linkedin,
  Twitter, MessageCircle as WhatsApp
} from 'lucide-react';

export default function ProfileEditPage() {
  const { t, lang } = useApp();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: currentUser.name,
    bio: currentUser.bio,
    university: currentUser.university,
    city: currentUser.city,
    field: currentUser.field,
    level: currentUser.level,
    skills: currentUser.skills.join(', '),
    instagram: currentUser.socialLinks.instagram || '',
    linkedin: currentUser.socialLinks.linkedin || '',
    twitter: currentUser.socialLinks.twitter || '',
    whatsapp: currentUser.socialLinks.whatsapp || '',
  });

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push('/profile/1');
    }, 1000);
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${currentUser.id}`} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="section-title">{t('profile.edit')}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {t('common.save')}
        </button>
      </div>

      {/* Avatar & Cover */}
      <div className="glass-card overflow-hidden mb-6">
        {/* Cover */}
        <div className="relative h-32 bg-gradient-to-r from-togo-green/30 via-togo-yellow/20 to-togo-red/30">
          <button className="absolute bottom-3 right-3 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors">
            <Camera size={16} />
          </button>
        </div>
        {/* Avatar */}
        <div className="relative px-6 -mt-12 pb-6">
          <div className="relative inline-block">
            <img src={currentUser.avatar} alt="" className="w-24 h-24 rounded-2xl ring-4 ring-togo-dark object-cover" />
            <button className="absolute bottom-0 right-0 p-2 bg-togo-green text-white rounded-lg hover:bg-togo-green/80 transition-colors shadow-lg">
              <Camera size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Personal Info */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
            <User size={18} className="text-togo-green" />
            {lang === 'fr' ? 'Informations personnelles' : 'Personal information'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.name')}</label>
              <input type="text" value={form.name} onChange={(e) => updateForm('name', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('profile.bio')}</label>
              <textarea value={form.bio} onChange={(e) => updateForm('bio', e.target.value)} className="input-field resize-none min-h-[100px]" rows={4} />
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
            <GraduationCap size={18} className="text-togo-green" />
            {lang === 'fr' ? 'Informations académiques' : 'Academic information'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('profile.university')}</label>
              <input type="text" value={form.university} onChange={(e) => updateForm('university', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('profile.city')}</label>
              <input type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('profile.field')}</label>
              <input type="text" value={form.field} onChange={(e) => updateForm('field', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('profile.level')}</label>
              <input type="text" value={form.level} onChange={(e) => updateForm('level', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
            <FileText size={18} className="text-togo-green" />
            {t('profile.skills')}
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {lang === 'fr' ? 'Compétences (séparées par des virgules)' : 'Skills (comma separated)'}
            </label>
            <input type="text" value={form.skills} onChange={(e) => updateForm('skills', e.target.value)} className="input-field" placeholder="React, Python, Machine Learning" />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {form.skills.split(',').filter(s => s.trim()).map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-togo-green/10 text-togo-green text-sm rounded-full">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
            <Globe size={18} className="text-togo-green" />
            {t('profile.social')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Instagram size={14} className="text-pink-400" /> Instagram
              </label>
              <input type="url" value={form.instagram} onChange={(e) => updateForm('instagram', e.target.value)} className="input-field" placeholder="https://instagram.com/username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Linkedin size={14} className="text-blue-400" /> LinkedIn
              </label>
              <input type="url" value={form.linkedin} onChange={(e) => updateForm('linkedin', e.target.value)} className="input-field" placeholder="https://linkedin.com/in/username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Twitter size={14} className="text-sky-400" /> Twitter
              </label>
              <input type="url" value={form.twitter} onChange={(e) => updateForm('twitter', e.target.value)} className="input-field" placeholder="https://twitter.com/username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <WhatsApp size={14} className="text-green-400" /> WhatsApp
              </label>
              <input type="tel" value={form.whatsapp} onChange={(e) => updateForm('whatsapp', e.target.value)} className="input-field" placeholder="+91 98765 43210" />
            </div>
          </div>
        </div>

        {/* CV Upload */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
            <FileText size={18} className="text-togo-green" />
            CV
          </h2>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-togo-green/30 transition-colors cursor-pointer">
            <FileText size={32} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400 text-sm">
              {lang === 'fr' ? 'Glissez votre CV ici ou cliquez pour parcourir' : 'Drag your CV here or click to browse'}
            </p>
            <p className="text-gray-500 text-xs mt-1">PDF, DOC, DOCX (max 5MB)</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-3 mt-8 mb-8">
        <Link href={`/profile/${currentUser.id}`} className="btn-secondary flex-1 text-center py-3">
          {t('common.cancel')}
        </Link>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-50">
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>{t('common.save')} <Save size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
}
