export type Badge = 'alumni' | 'mentor' | 'new' | 'active' | 'founder';
export type PostType = 'advice' | 'experience' | 'photo' | 'alert' | 'general';
export type FriendshipStatus = 'pending' | 'accepted' | 'blocked';
export type OpportunityType = 'internship' | 'job' | 'scholarship' | 'event';
export type EventType = 'meetup' | 'conference' | 'cultural' | 'sports' | 'other';
export type AttendanceStatus = 'going' | 'interested' | 'not_going';
export type MentorshipStatus = 'pending' | 'active' | 'completed';
export type NotificationType = 'follow' | 'like' | 'comment' | 'message' | 'opportunity' | 'event' | 'mentorship';
export type OpportunityStatus = 'draft' | 'open' | 'closed' | 'expired' | 'featured';
export type AvatarType = 'dicebear' | 'upload' | 'gravatar' | 'initials';
export type ProjectStatus = 'idea' | 'active' | 'paused' | 'completed' | 'archived';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  bio: string;
  university?: string | null;
  city?: string | null;
  field?: string | null;
  level?: string | null;
  department?: string | null;
  program?: string | null;
  graduationYear?: number | null;
  phone?: string | null;
  country?: string | null;
  badge: Badge;
  avatarType: AvatarType;
  joinedAt: string;
  isOnline: boolean;
  cvUrl?: string | null;
  followersCount: number;
  followingCount: number;
  friendsCount: number;
  skills: string[];
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  whatsapp?: string | null;
}

export interface PublicPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  type: PostType;
  createdAt: string;
  images: string[];
  tags: string[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface PublicComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  createdAt: string;
  likeCount: number;
}

export interface ForumQuestionPublic {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  title: string;
  content: string;
  tags: string[];
  votes: number;
  resolved: boolean;
  createdAt: string;
  answerCount: number;
}

export interface ForumAnswerPublic {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface OpportunityPublic {
  id: string;
  title: string;
  company: string;
  type: OpportunityType;
  status: OpportunityStatus;
  location: string;
  description: string;
  deadline?: string | null;
  url: string;
  postedBy?: string | null;
  createdAt: string;
}

export interface EventPublic {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  type: EventType;
  organizer?: string | null;
  image?: string | null;
  goingCount: number;
  isAttending: boolean;
}

export interface MentorshipPublic {
  id: string;
  mentorId: string;
  menteeId: string;
  status: MentorshipStatus;
  field: string;
  createdAt: string;
}

export interface ConversationListItem {
  id: string;
  title?: string | null;
  unreadCount: number;
  otherUserId?: string | null;
  otherUserName?: string | null;
  otherUserAvatar?: string | null;
  otherUserIsOnline?: boolean | null;
  lastMessageContent?: string | null;
  lastMessageCreatedAt?: string | null;
  lastMessageSenderId?: string | null;
}

export interface MessagePublic {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string | null;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationPublic {
  id: string;
  userId: string;
  type: NotificationType;
  content: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
}

export interface ProjectPublic {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  url?: string | null;
  repositoryUrl?: string | null;
  status: ProjectStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

export interface CommitteePositionPublic {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  sortOrder: number;
}

export interface CommitteeMemberPublic {
  id: string;
  profileId: string;
  positionId: string;
  memberName: string;
  memberAvatar?: string | null;
  city?: string | null;
  field?: string | null;
  badge: Badge;
  termStart?: string | null;
  termEnd?: string | null;
  isCurrent: boolean;
  sortOrder: number;
}

export interface CommitteePublic extends CommitteePositionPublic {
  members: CommitteeMemberPublic[];
}

