import { ForumQuestion } from '@/types';

export const forumQuestions: ForumQuestion[] = [
  {
    id: '1',
    authorId: '4',
    title: 'Comment trouver un logement abordable à Vellore ?',
    content: 'Je viens d\'arriver à VELLORE et je cherche un appartement. Quelqu\'un peut me recommander des quartiers sûrs et abordables près de VIT ? Mon budget est de 8,000-12,000 INR/mois.',
    tags: ['logement', 'Vellore', 'VIT'],
    answers: [
      { id: 'a1', authorId: '1', content: 'Salut Efua ! Je te recommande le quartier de Katpadi, c\'est proche de VIT et les loyers sont raisonnables. Évite les agents, cherche directement avec les propriétaires. Contacte-moi en privé, j\'ai des contacts.', votes: 12, isAccepted: true, createdAt: '2024-12-10T10:00:00Z' },
      { id: 'a2', authorId: '6', content: 'À Manipal, j\'ai trouvé mon appartement sur Housing.com. Vérifie aussi les groupes Facebook pour étudiants internationaux.', votes: 5, isAccepted: false, createdAt: '2024-12-10T12:00:00Z' },
    ],
    votes: 8,
    createdAt: '2024-12-10T08:00:00Z',
    resolved: true,
  },
  {
    id: '2',
    authorId: '9',
    title: 'Conseils pour préparer les examens de droit à NLSIU ?',
    content: 'Je suis en première année de droit à NLSIU Bangalore. Les examens approchent et je suis un peu stressé. Les anciens étudiants ont-ils des conseils pour bien réviser ? Surtout pour Constitutional Law et Contracts.',
    tags: ['droit', 'NLSIU', 'examens', 'révision'],
    answers: [
      { id: 'a3', authorId: '8', content: 'Pour Constitutional Law, je recommande de lire les jugements originaux plutôt que les résumés. Fais des fiches de jurisprudence. Pour Contracts, comprends bien les concepts avant de mémoriser.', votes: 7, isAccepted: false, createdAt: '2024-12-09T15:00:00Z' },
    ],
    votes: 5,
    createdAt: '2024-12-09T14:00:00Z',
    resolved: false,
  },
  {
    id: '3',
    authorId: '10',
    title: 'Comment obtenir un visa de travail après les études en Inde ?',
    content: 'Je termine mon Master en Économie à Delhi School of Economics. Quelqu\'un a de l\'expérience avec le processus de visa de travail en Inde ? Est-ce que c\'est difficile pour les étudiants africains ?',
    tags: ['visa', 'travail', 'post-études'],
    answers: [
      { id: 'a4', authorId: '5', content: 'Après tes études, tu peux demander un Employment Visa si tu as une offre d\'emploi. Le processus est le même pour tous les étrangers. Le plus important c\'est d\'avoir un employeur qui te sponsorise. Je te recommande de commencer à chercher du travail 6 mois avant la fin de tes études.', votes: 15, isAccepted: true, createdAt: '2024-12-08T11:00:00Z' },
      { id: 'a5', authorId: '3', content: 'Tu peux aussi explorer le visa d\'affaires si tu veux créer une startup. Le Startup India programme facilite les choses pour les entrepreneurs étrangers.', votes: 8, isAccepted: false, createdAt: '2024-12-08T13:00:00Z' },
    ],
    votes: 20,
    createdAt: '2024-12-08T09:00:00Z',
    resolved: true,
  },
  {
    id: '4',
    authorId: '7',
    title: 'Meilleures banques pour étudiants internationaux en Inde ?',
    content: 'Quelle banque recommandez-vous pour ouvrir un compte en tant qu\'étudiant international ? J\'ai besoin d\'une bonne appli mobile et de frais de transfert bas pour envoyer de l\'argent au Togo.',
    tags: ['banque', 'finance', 'transfert'],
    answers: [
      { id: 'a6', authorId: '1', content: 'HDFC Bank est très bien pour les étudiants. L\'appli est bonne et ils ont un service client en anglais. Pour les transferts internationaux, Wise (ex-TransferWise) est le moins cher.', votes: 10, isAccepted: false, createdAt: '2024-12-07T14:00:00Z' },
    ],
    votes: 12,
    createdAt: '2024-12-07T10:00:00Z',
    resolved: false,
  },
  {
    id: '5',
    authorId: '6',
    title: 'Comment cuisiner de la nourriture togolaise en Inde ?',
    content: 'Je meurs d\'envie de manger du fufu et du djenkoumé mais je ne trouve pas les ingrédients à Manipal. Quelqu\'un a des astuces pour adapter les recettes togolaises avec des ingrédients indiens ?',
    tags: ['cuisine', 'nourriture', 'adaptation'],
    answers: [
      { id: 'a7', authorId: '2', content: 'Pour le fufu, utilise de la farine de blé indienne (atta) mélangée avec de la farine de plantain. Tu peux trouver du plantain dans les marchés locaux. Pour le piment, le piment vert indien fonctionne très bien !', votes: 18, isAccepted: true, createdAt: '2024-12-06T16:00:00Z' },
      { id: 'a8', authorId: '4', content: 'Il y a un magasin africain à Bangalore qui vend des ingrédients togolais ! Je peux te partager l\'adresse en privé.', votes: 6, isAccepted: false, createdAt: '2024-12-06T18:00:00Z' },
    ],
    votes: 25,
    createdAt: '2024-12-06T14:00:00Z',
    resolved: true,
  },
];
