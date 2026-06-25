export type GuideSection = {
  id: string;
  icon: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  steps: GuideStep[];
};

export type GuideStep = {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
};

export const guideSections: GuideSection[] = [
  {
    id: '1',
    icon: '🇹🇬',
    title: 'Arrivée en Inde',
    titleEn: 'Arrival in India',
    content: 'Premiers pas après l\'arrivée',
    contentEn: 'First steps after arrival',
    steps: [
      { title: 'Visa étudiant', titleEn: 'Student visa', description: 'Procédure pour obtenir le visa étudiant' },
      { title: 'Aéroport', titleEn: 'Airport', description: 'Livraison à l\'université ou à l\'hébergement' },
      { title: 'Douane', titleEn: 'Customs', description: 'Déclaration des bagages et objets personnels' },
    ],
  },
  {
    id: '2',
    icon: '🏠',
    title: 'Logement',
    titleEn: 'Housing',
    content: 'Trouver un logement étudiant',
    contentEn: 'Finding student accommodation',
    steps: [
      { title: 'Universités', titleEn: 'Universities', description: 'Résidences universitaires disponibles' },
      { title: 'Privé', titleEn: 'Private', description: 'Appartements et colocations' },
    ],
  },
  {
    id: '3',
    icon: '💼',
    title: 'Stage et emploi',
    titleEn: 'Internship and Job',
    content: 'Comment trouver un stage ou emploi',
    contentEn: 'How to find internship or job',
    steps: [
      { title: 'Plateformes', titleEn: 'Platforms', description: 'LinkedIn, Internshala, LetsIntern' },
      { title: 'CV', titleEn: 'CV', description: 'Formatage du CV pour l\'Inde' },
    ],
  },
];