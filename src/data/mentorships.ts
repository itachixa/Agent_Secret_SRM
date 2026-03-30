import { Mentorship, Conversation, Message } from '@/types';

export const mentorships: Mentorship[] = [
  {
    id: '1',
    mentorId: '2',
    menteeId: '4',
    status: 'active',
    field: 'Medicine / Science',
    createdAt: '2024-11-01',
  },
  {
    id: '2',
    mentorId: '5',
    menteeId: '7',
    status: 'active',
    field: 'Engineering',
    createdAt: '2024-10-15',
  },
  {
    id: '3',
    mentorId: '1',
    menteeId: '4',
    status: 'active',
    field: 'Computer Science',
    createdAt: '2024-12-01',
  },
  {
    id: '4',
    mentorId: '3',
    menteeId: '9',
    status: 'pending',
    field: 'Career Development',
    createdAt: '2024-12-18',
  },
];

export const conversations: Conversation[] = [
  {
    id: 'conv1',
    participants: ['1', '2'],
    lastMessage: {
      id: 'm1',
      senderId: '2',
      receiverId: '1',
      content: 'Merci pour les conseils ! Je vais essayer ta méthode de révision.',
      createdAt: '2024-12-20T15:30:00Z',
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: 'conv2',
    participants: ['1', '3'],
    lastMessage: {
      id: 'm2',
      senderId: '3',
      receiverId: '1',
      content: 'On se retrouve demain au café à 14h ?',
      createdAt: '2024-12-20T12:00:00Z',
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: 'conv3',
    participants: ['1', '5'],
    lastMessage: {
      id: 'm3',
      senderId: '1',
      receiverId: '5',
      content: 'Salut Kwame, j\'aurais besoin de conseils pour le stage chez TCS.',
      createdAt: '2024-12-19T20:00:00Z',
      read: true,
    },
    unreadCount: 0,
  },
];

export const messages: Record<string, Message[]> = {
  conv1: [
    { id: 'm1a', senderId: '1', receiverId: '2', content: 'Salut Ama ! Comment se passent tes révisions pour les examens ?', createdAt: '2024-12-20T14:00:00Z', read: true },
    { id: 'm1b', senderId: '2', receiverId: '1', content: 'Salut Kofi ! Ça va bien, mais c\'est intense. 12 chapitres d\'anatomie à réviser 😅', createdAt: '2024-12-20T14:15:00Z', read: true },
    { id: 'm1c', senderId: '1', receiverId: '2', content: 'Tu devrais essayer la technique de répétition espacée. Ça m\'a beaucoup aidé.', createdAt: '2024-12-20T14:30:00Z', read: true },
    { id: 'm1', senderId: '2', receiverId: '1', content: 'Merci pour les conseils ! Je vais essayer ta méthode de révision.', createdAt: '2024-12-20T15:30:00Z', read: false },
  ],
  conv2: [
    { id: 'm2a', senderId: '1', receiverId: '3', content: 'Hey Yaw, tu es libre cette semaine ?', createdAt: '2024-12-20T11:00:00Z', read: true },
    { id: 'm2', senderId: '3', receiverId: '1', content: 'On se retrouve demain au café à 14h ?', createdAt: '2024-12-20T12:00:00Z', read: true },
  ],
  conv3: [
    { id: 'm3', senderId: '1', receiverId: '5', content: 'Salut Kwame, j\'aurais besoin de conseils pour le stage chez TCS.', createdAt: '2024-12-19T20:00:00Z', read: true },
  ],
};
