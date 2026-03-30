'use client';

import { useApp } from '@/lib/context';
import { guideSections } from '@/data/events';
import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from 'lucide-react';

export default function GuidePage() {
  const { t, lang } = useApp();
  const [expandedSection, setExpandedSection] = useState<string>('1');
  const [expandedStep, setExpandedStep] = useState<Record<string, string>>({});

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? '' : id);
  };

  const toggleStep = (sectionId: string, stepIdx: string) => {
    setExpandedStep((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId] === stepIdx ? '' : stepIdx,
    }));
  };

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-togo-green/[0.08] border border-togo-green/[0.12] rounded-full text-togo-green text-sm font-medium mb-5">
          <BookOpen size={16} />
          {lang === 'fr' ? 'Guide complet' : 'Complete guide'}
        </div>
        <h1 className="section-title">{t('guide.title')}</h1>
        <p className="text-gray-400 mt-2 max-w-xl mx-auto">{t('guide.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {guideSections.map((section, i) => {
          const isExpanded = expandedSection === section.id;
          const title = lang === 'fr' ? section.title : section.titleEn;
          const content = lang === 'fr' ? section.content : section.contentEn;

          return (
            <div key={section.id} className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{section.icon}</span>
                  <div className="text-left">
                    <h2 className="font-display font-bold text-white text-lg">{title}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{content}</p>
                  </div>
                </div>
                <div className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-togo-green/15 text-togo-green' : 'text-gray-400'}`}>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-white/[0.04]">
                  <div className="space-y-3 mt-5">
                    {section.steps.map((step, idx) => {
                      const stepTitle = lang === 'fr' ? step.title : step.titleEn;
                      const stepDesc = lang === 'fr' ? step.description : step.descriptionEn;
                      const stepKey = `${section.id}-${idx}`;
                      const isStepExpanded = expandedStep[section.id] === stepKey;

                      return (
                        <div key={idx} className="border border-white/[0.04] rounded-xl overflow-hidden hover:border-white/[0.08] transition-colors">
                          <button
                            onClick={() => toggleStep(section.id, stepKey)}
                            className="w-full p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="w-9 h-9 rounded-xl bg-togo-green/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-togo-green font-bold text-sm">{idx + 1}</span>
                            </div>
                            <span className="font-medium text-white text-left flex-1 text-[15px]">{stepTitle}</span>
                            {isStepExpanded ? (
                              <ChevronUp size={16} className="text-gray-400" />
                            ) : (
                              <ChevronDown size={16} className="text-gray-400" />
                            )}
                          </button>
                          {isStepExpanded && (
                            <div className="px-4 pb-4 pt-0">
                              <p className="text-sm text-gray-300 leading-relaxed pl-12">{stepDesc}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Banner */}
      <div className="mt-10 glass-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-togo-green/10 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={24} className="text-togo-green" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{lang === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {lang === 'fr'
              ? 'Posez vos questions sur le forum ou contactez un mentor.'
              : 'Ask questions on the forum or contact a mentor.'}
          </p>
        </div>
      </div>
    </div>
  );
}
