# Migration Supabase

## Ordre d'exécution

1. Supprimer ou remplacer la clé exposée dans `.env:1`, puis régénérer la clé compromise dans Supabase Dashboard.
2. Créer les variables suivantes dans Vercel, Render et Supabase Edge/Server runtime :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
3. Exécuter `supabase/migrations/0001_init_supabase.sql` dans Supabase SQL Editor.
4. Vérifier dans Supabase Dashboard que RLS est activé sur toutes les tables.
5. Vérifier que les buckets Storage existent : `avatars`, `post-images`, `event-images`, `cv-files`, `opportunity-files`.
6. Vérifier que Realtime est activé pour : `posts`, `post_comments`, `forum_questions`, `forum_answers`, `messages`, `notifications`, `events`, `event_attendees`, `projects`, `committee_members`.
7. Installer les dépendances : `npm install @supabase/supabase-js @supabase/ssr`.
8. Remplacer progressivement les imports `src/data/*.ts` par les hooks `src/hooks/supabase/*`.
9. Remplacer les appels API mockés par les services `src/lib/supabase/services/*`.
10. Exécuter `npm run build`.

## Mapping fichier par fichier

| Fichier actuel | Données mockées | Remplacement Supabase | Hook | Service |
|---|---|---|---|---|
| `src/data/users.ts` | `users`, `currentUser` | `profile_public_view`, `profiles`, `profile_skills`, `social_links`, `follows`, `friendships` | `useProfiles`, `useProfile`, `useCurrentUser` | `profiles.ts`, `auth.ts` |
| `src/app/auth/login/page.tsx` | `setTimeout` login | `supabase.auth.signInWithPassword` | Aucun hook nécessaire | `auth.ts` |
| `src/app/auth/register/page.tsx` | `setTimeout` register | `supabase.auth.signUp` avec `raw_user_meta_data` | Aucun hook nécessaire | `auth.ts` |
| `src/app/profile/[id]/page.tsx` | `users`, `posts` | `profile_public_view`, `post_public_view`, `post_comments`, `projects` | `useProfile`, `useFeed`, `useProjects` | `profiles.ts`, `posts.ts`, `projects.ts` |
| `src/app/profile/edit/page.tsx` | `currentUser`, timeout save | `profiles.update`, `profile_skills.replace`, `social_links.upsert`, Storage `cv-files` | Aucun hook nécessaire | `profiles.ts`, `storage.ts` |
| `src/app/feed/page.tsx` | `posts`, `currentUser`, local likes/comments/bookmarks | `post_public_view`, `posts`, `post_likes`, `post_comments`, `bookmarks` | `useFeed` | `posts.ts` |
| `src/app/search/page.tsx` | filtre local sur `users` | `profile_public_view` avec `.textSearch`, `.eq`, `.in` | `useProfiles` | `profiles.ts` |
| `src/app/map/page.tsx` | `users` locaux groupés par ville | `profile_public_view` `.select('id,name,avatar,city,field,badge,is_online')` | `useProfiles` | `profiles.ts` |
| `src/app/opportunities/page.tsx` | `opportunities`, `users` | `opportunities`, `profiles` | `useOpportunities` | `opportunities.ts`, `profiles.ts` |
| `src/app/forum/page.tsx` | `forumQuestions`, `users` | `forum_question_public_view` | `useForumQuestions` | `forum.ts` |
| `src/app/forum/[id]/page.tsx` | `forumQuestions`, `users`, local answers/votes | `forum_questions`, `forum_answers`, `forum_votes`, `upsert_forum_vote` | `useForumQuestion` | `forum.ts` |
| `src/app/events/page.tsx` | `events`, local attendance | `event_public_view`, `event_attendees` | `useEvents` | `events.ts` |
| `src/app/mentorship/page.tsx` | `mentorships`, `users` | `mentorships`, `profile_public_view` | `useMentorship` | `mentorship.ts`, `profiles.ts` |
| `src/app/messages/page.tsx` | `conversations`, `messages`, local send | `conversation_list_view`, `messages`, `conversation_participants` | `useMessages` | `messages.ts` |
| `src/app/notifications/page.tsx` | `notifications`, local read/delete | `notifications` | `useNotifications` | `notifications.ts` |
| Nouvelle page comité | Aucun équivalent UI actuel | `committee_public_view`, `committee_positions`, `committee_members`, `roles`, `user_roles` | `useCommittee` | `committee.ts` |
| Nouvelle page projets | Aucun équivalent UI actuel | `projects` | `useProjects` | `projects.ts` |
| `src/app/api/users/route.ts` | `users` | Supprimer ou remplacer par server action/route protégée avec `createServerSupabaseClient` | Aucun | `profiles.ts` côté server |
| `src/app/api/posts/route.ts` | `posts` static + POST non persistant | Supprimer ou remplacer par `posts` + `post_public_view` | Aucun | `posts.ts` côté server |
| `src/app/api/notifications/route.ts` | `notifications` static | Supprimer ou remplacer par `notifications` | Aucun | `notifications.ts` côté server |
| `src/app/api/messages/route.ts` | `conversations`, `messages` static | Supprimer ou remplacer par `conversation_list_view`, `messages` | Aucun | `messages.ts` côté server |
| `src/app/api/forum/route.ts` | `forumQuestions` static | Supprimer ou remplacer par `forum_question_public_view` | Aucun | `forum.ts` côté server |
| `app.js`, `js/form.js`, `js/script.js`, `js/comments.json` | Legacy comments | Optionnel : `legacy_comments` | Aucun | Aucun |

## Exemples de remplacement de requêtes

### Auth login

```ts
import { login } from '@/lib/supabase/services/auth';
import { useRouter } from 'next/navigation';

const result = await login(email, password);
if (!result.error) router.push('/feed');
```

### Auth register

```ts
import { register } from '@/lib/supabase/services/auth';
import { useRouter } from 'next/navigation';

const result = await register({
  email,
  password,
  name,
  university,
  city,
  field,
  level,
});

if (!result.error) router.push('/profile/edit');
```

### Profil

```ts
const { data: profile, loading, error } = useProfile(params.id);
```

### Feed

```ts
const { data, loading, error, create, like, comment, bookmark } = useFeed(filter === 'all' ? undefined : filter as any);
```

### Recherche

```ts
const { data, loading, error } = useProfiles({
  query,
  city: selectedCity === 'All' ? undefined : selectedCity,
  field: selectedField === 'All' ? undefined : selectedField,
  level: selectedLevel === 'All' ? undefined : selectedLevel,
  badge: selectedBadge === 'All' ? 'all' : selectedBadge as Badge,
  mentorsOnly: showMentorsOnly,
});
```

### Forum

```ts
const { data: questions } = useForumQuestions();
const { data: question, voteQuestion, voteAnswer } = useForumQuestion(questionId);
```

### Événements

```ts
const { data: events, toggleAttendance } = useEvents();
await toggleAttendance(event.id, !event.isAttending, 'going');
```

### Messages

```ts
const { conversations, messages, send } = useMessages(selectedConvId);
await send(messageInput);
```

### Notifications

```ts
const { data, markRead, markAllRead, remove } = useNotifications(filter);
```

## Points d'intégration UI prioritaires

1. `src/app/auth/login/page.tsx` : remplacer `setTimeout` par `login`.
2. `src/app/auth/register/page.tsx` : remplacer `setTimeout` par `register`.
3. `src/app/feed/page.tsx` : remplacer `initialPosts` par `useFeed`.
4. `src/app/search/page.tsx` : remplacer `users` par `useProfiles`.
5. `src/app/profile/[id]/page.tsx` : remplacer `users`/`posts` par `useProfile` + `useFeed`.
6. `src/app/profile/edit/page.tsx` : remplacer `currentUser` par `useCurrentUser` + `useProfile`, puis `updateProfile`, `replaceProfileSkills`, `upsertSocialLinks`.
7. `src/app/events/page.tsx` : remplacer `events` par `useEvents`.
8. `src/app/messages/page.tsx` : remplacer `conversations`/`messages` par `useMessages`.
9. `src/app/notifications/page.tsx` : remplacer `initialNotifications` par `useNotifications`.
10. Ajouter une page comité avec `useCommittee`.
11. Ajouter une page projets avec `useProjects`.

## Supabase Realtime côté client

```ts
import { useRealtimeSubscriptions } from '@/hooks/supabase';
import { useCurrentUser } from '@/hooks/supabase';

const { userId } = useCurrentUser();

useRealtimeSubscriptions({
  userId,
  conversationId: selectedConvId,
  onMessage: () => refreshMessages(),
  onNotification: () => refreshNotifications(),
  onPost: () => refreshFeed(),
  onEvent: () => refreshEvents(),
});
```
