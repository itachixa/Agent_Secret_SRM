'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { Eye, EyeOff, Mail, Lock, User, Building2, MapPin, GraduationCap, ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react';

const universities = [
  'SRM Institute of Science and Technology',
  'AIIMS Delhi',
  'IIM Bangalore',
  'IIT Madras',
  'IIT Bombay',
  'IIT Delhi',
  'VIT Vellore',
  'Manipal Academy of Higher Education',
  'Jawaharlal Nehru University',
  'NLSIU Bangalore',
  'Delhi School of Economics',
  'CEPT University',
  'Autre',
];

const cities = ['Chennai', 'Delhi', 'Bangalore', 'Mumbai', 'Vellore', 'Manipal', 'Ahmedabad', 'Hyderabad', 'Pune', 'Kolkata', 'Autre'];
const fields = ['Computer Science', 'Medicine', 'Business Administration', 'Engineering', 'Data Science', 'Law', 'Architecture', 'Biotechnology', 'Pharmacy', 'Economics', 'Autre'];
const levels = ['Bachelor', 'Master', 'Doctorate', 'Diploma'];

export default function RegisterPage() {
  const { t, lang } = useApp();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    university: '', city: '', field: '', level: '',
  });

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); return; }
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-togo-green via-togo-yellow to-togo-red flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-togo-green/20 group-hover:scale-105 transition-transform">
              TG
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white mt-5">
            {lang === 'fr' ? 'Rejoignez-nous' : 'Join us'}
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            {t('auth.register')}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                s < step ? 'bg-togo-green text-white' : s === step ? 'bg-togo-green/20 text-togo-green border border-togo-green/40' : 'bg-white/[0.04] text-gray-500'
              }`}>
                {s < step ? <CheckCircle2 size={16} /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 rounded-full ${s < step ? 'bg-togo-green' : 'bg-white/[0.06]'}`} />}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <h2 className="text-lg font-display font-bold text-white mb-5">
                  {lang === 'fr' ? 'Informations personnelles' : 'Personal information'}
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.name')}</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="Kofi Mensah" className="input-field pl-11" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.email')}</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="exemple@email.com" className="input-field pl-11" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.password')}</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => updateForm('password', e.target.value)} placeholder="••••••••" className="input-field pl-11 pr-11" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.confirmPassword')}</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="password" value={form.confirmPassword} onChange={(e) => updateForm('confirmPassword', e.target.value)} placeholder="••••••••" className="input-field pl-11" required />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-display font-bold text-white mb-5">
                  {lang === 'fr' ? 'Études en Inde' : 'Studies in India'}
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('profile.university')}</label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select value={form.university} onChange={(e) => updateForm('university', e.target.value)} className="input-field pl-11 appearance-none" required>
                      <option value="">{lang === 'fr' ? 'Sélectionner' : 'Select'}</option>
                      {universities.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('profile.city')}</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select value={form.city} onChange={(e) => updateForm('city', e.target.value)} className="input-field pl-11 appearance-none" required>
                      <option value="">{lang === 'fr' ? 'Sélectionner' : 'Select'}</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('profile.field')}</label>
                  <div className="relative">
                    <GraduationCap size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select value={form.field} onChange={(e) => updateForm('field', e.target.value)} className="input-field pl-11 appearance-none" required>
                      <option value="">{lang === 'fr' ? 'Sélectionner' : 'Select'}</option>
                      {fields.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('profile.level')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {levels.map(l => (
                      <button key={l} type="button" onClick={() => updateForm('level', l)}
                        className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                          form.level === l ? 'bg-togo-green/15 text-togo-green border border-togo-green/30' : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06]'
                        }`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-display font-bold text-white mb-5">
                  {lang === 'fr' ? 'Confirmation' : 'Confirmation'}
                </h2>
                <div className="space-y-3">
                  {[
                    { label: t('auth.name'), value: form.name },
                    { label: t('auth.email'), value: form.email },
                    { label: t('profile.university'), value: form.university },
                    { label: t('profile.city'), value: form.city },
                    { label: t('profile.field'), value: form.field },
                    { label: t('profile.level'), value: form.level },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2.5 border-b border-white/[0.04]">
                      <span className="text-gray-400 text-sm">{label}</span>
                      <span className="text-white font-medium text-sm">{value}</span>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 mt-5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-togo-green focus:ring-togo-green/50" required />
                  <span className="text-sm text-gray-400">
                    {lang === 'fr'
                      ? "J'accepte les conditions d'utilisation et la politique de confidentialité"
                      : 'I accept the terms of service and privacy policy'}
                  </span>
                </label>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex-1 py-3">
                  {lang === 'fr' ? 'Retour' : 'Back'}
                </button>
              )}
              <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-50">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : step < 3 ? (
                  <>{lang === 'fr' ? 'Continuer' : 'Continue'} <ArrowRight size={18} /></>
                ) : (
                  <>{t('auth.register')} <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-8 text-sm">
          {t('auth.hasAccount')}{' '}
          <Link href="/auth/login" className="text-togo-green hover:underline font-medium">
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
