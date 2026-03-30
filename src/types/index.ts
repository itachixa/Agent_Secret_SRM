export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  university: string;
  city: string;
  field: string;
  level: string;
  skills: string[];
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
  };
  badge: 'alumni' | 'mentor' | 'new' | 'active' | 'founder';
  joinedAt: string;
  followers: string[];
  following: string[];
  friends: string[];
  isOnline: boolean;
  cvUrl?: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  images: string[];
  type: 'advice' | 'experience' | 'photo' | 'alert' | 'general';
  likes: string[];
  comments: Comment[];
  createdAt: string;
  tags: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: 'internship' | 'job' | 'scholarship' | 'event';
  location: string;
  description: string;
  deadline: string;
  url: string;
  postedBy: string;
  createdAt: string;
}

export interface ForumQuestion {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  answers: ForumAnswer[];
  votes: number;
  createdAt: string;
  resolved: boolean;
}

export interface ForumAnswer {
  id: string;
  authorId: string;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  type: 'meetup' | 'conference' | 'cultural' | 'sports' | 'other';
  attendees: string[];
  organizer: string;
  image: string;
}

export interface Mentorship {
  id: string;
  mentorId: string;
  menteeId: string;
  status: 'pending' | 'active' | 'completed';
  field: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'message' | 'opportunity' | 'event' | 'mentorship';
  content: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface GuideSection {
  id: string;
  title: string;
  titleEn: string;
  icon: string;
  content: string;
  contentEn: string;
  steps: { title: string; titleEn: string; description: string; descriptionEn: string }[];
}
