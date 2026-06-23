create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

do $$ begin
  create type public.profile_badge as enum ('alumni', 'mentor', 'new', 'active', 'founder');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.post_type as enum ('advice', 'experience', 'photo', 'alert', 'general');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.friendship_status as enum ('pending', 'accepted', 'blocked');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.opportunity_type as enum ('internship', 'job', 'scholarship', 'event');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.event_type as enum ('meetup', 'conference', 'cultural', 'sports', 'other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.attendance_status as enum ('going', 'interested', 'not_going');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.mentorship_status as enum ('pending', 'active', 'completed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.notification_type as enum ('follow', 'like', 'comment', 'message', 'opportunity', 'event', 'mentorship');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.opportunity_status as enum ('draft', 'open', 'closed', 'expired', 'featured');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.avatar_type as enum ('dicebear', 'upload', 'gravatar', 'initials');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.project_status as enum ('idea', 'active', 'paused', 'completed', 'archived');
exception when duplicate_object then null;
end $$;
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  avatar_url text,
  bio text not null default '',
  university text,
  city text,
  field text,
  level text,
  department text,
  program text,
  graduation_year smallint check (graduation_year is null or graduation_year between 1900 and 2100),
  phone text,
  country text not null default 'Togo',
  badge public.profile_badge not null default 'new',
  avatar_type public.avatar_type not null default 'dicebear',
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_online boolean not null default false,
  cv_url text,
  search_vector tsvector generated always as (
    setweight(to_tsvector('french', coalesce(full_name, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(university, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(city, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(field, '')), 'C') ||
    setweight(to_tsvector('french', coalesce(department, '')), 'C') ||
    setweight(to_tsvector('french', coalesce(program, '')), 'C') ||
    setweight(to_tsvector('french', coalesce(country, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(bio, '')), 'D')
  ) stored
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_badge public.profile_badge;
  v_avatar_type public.avatar_type;
  v_graduation_year smallint;
begin
  if new.raw_user_meta_data->>'badge' = 'alumni' then
    v_badge := 'alumni';
  elsif new.raw_user_meta_data->>'badge' = 'mentor' then
    v_badge := 'mentor';
  elsif new.raw_user_meta_data->>'badge' = 'active' then
    v_badge := 'active';
  elsif new.raw_user_meta_data->>'badge' = 'founder' then
    v_badge := 'founder';
  else
    v_badge := 'new';
  end if;

  if new.raw_user_meta_data->>'avatar_type' = 'upload' then
    v_avatar_type := 'upload';
  elsif new.raw_user_meta_data->>'avatar_type' = 'gravatar' then
    v_avatar_type := 'gravatar';
  elsif new.raw_user_meta_data->>'avatar_type' = 'initials' then
    v_avatar_type := 'initials';
  else
    v_avatar_type := 'dicebear';
  end if;

  if new.raw_user_meta_data->>'graduation_year' ~ '^\d{4}$' then
    v_graduation_year := (new.raw_user_meta_data->>'graduation_year')::smallint;
  end if;

  insert into public.profiles (
    id, email, full_name, avatar_url, bio, university, city, field, level,
    department, program, graduation_year, phone, country, badge, avatar_type,
    joined_at, updated_at, is_online
  )
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'user'), '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id),
    coalesce(new.raw_user_meta_data->>'bio', ''),
    coalesce(new.raw_user_meta_data->>'university', ''),
    coalesce(new.raw_user_meta_data->>'city', ''),
    coalesce(new.raw_user_meta_data->>'field', ''),
    coalesce(new.raw_user_meta_data->>'level', ''),
    coalesce(new.raw_user_meta_data->>'department', ''),
    coalesce(new.raw_user_meta_data->>'program', ''),
    v_graduation_year,
    nullif(new.raw_user_meta_data->>'phone', ''),
    coalesce(nullif(new.raw_user_meta_data->>'country', ''), 'Togo'),
    v_badge,
    v_avatar_type,
    now(),
    now(),
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create table public.profile_skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  skill text not null,
  created_at timestamptz not null default now(),
  unique (profile_id, skill)
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  instagram text,
  linkedin text,
  twitter text,
  whatsapp text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id)
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.roles (name, description)
values
  ('admin', 'Administrateur plateforme'),
  ('moderator', 'Modérateur communauté'),
  ('committee_admin', 'Gestionnaire comité')
on conflict (name) do nothing;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  granted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz,
  unique (user_id, role_id)
);

create table public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  status public.friendship_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, friend_id),
  check (user_id <> friend_id)
);

create unique index friendships_pair_idx on public.friendships (least(user_id, friend_id), greatest(user_id, friend_id));

create table public.committee_positions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_en text,
  description text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.committee_members (
  id uuid primary key default gen_random_uuid(),
  position_id uuid not null references public.committee_positions(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  term_start date,
  term_end date check (term_end is null or term_start is null or term_end >= term_start),
  is_current boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (position_id, profile_id, term_start)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  type public.post_type not null default 'general',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    setweight(to_tsvector('french', coalesce(content, '')), 'A')
  ) stored
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  url text,
  repository_url text,
  status public.project_status not null default 'active',
  started_at date,
  completed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (completed_at is null or started_at is null or completed_at >= started_at)
);

create table public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  url text not null,
  storage_path text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create table public.post_tags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  unique (post_id, tag)
);

create table public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.post_comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id)
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

create table public.forum_questions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  tags text[] not null default '{}',
  votes integer not null default 0,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.forum_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.forum_questions(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  votes integer not null default 0,
  is_accepted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.forum_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid references public.forum_questions(id) on delete cascade,
  answer_id uuid references public.forum_answers(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  check (question_id is not null or answer_id is not null),
  check (question_id is null or answer_id is null)
);

create unique index forum_votes_question_user_idx on public.forum_votes (user_id, question_id) where question_id is not null;
create unique index forum_votes_answer_user_idx on public.forum_votes (user_id, answer_id) where answer_id is not null;
create unique index forum_answers_one_accepted_idx on public.forum_answers (question_id) where is_accepted;

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  type public.opportunity_type not null,
  status public.opportunity_status not null default 'open',
  location text not null,
  description text not null,
  deadline timestamptz,
  url text not null,
  posted_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date date not null,
  time text not null,
  location text not null,
  city text not null,
  type public.event_type not null,
  organizer uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  image text,
  image_storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.attendance_status not null default 'going',
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table public.mentorships (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.profiles(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  status public.mentorship_status not null default 'pending',
  field text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (mentor_id <> mentee_id),
  unique (mentor_id, mentee_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  title text,
  created_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz
);

create table public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  unread_count integer not null default 0 check (unread_count >= 0),
  created_at timestamptz not null default now(),
  unique (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  content text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.legacy_comments (
  id uuid primary key default gen_random_uuid(),
  pseudo text not null,
  comment text not null,
  created_at timestamptz not null default now()
);

create index if not exists profiles_search_vector_idx on public.profiles using gin (search_vector);
create index if not exists profiles_city_idx on public.profiles (city);
create index if not exists profiles_university_idx on public.profiles (university);
create index if not exists profiles_field_idx on public.profiles (field);
create index if not exists profiles_department_idx on public.profiles (department);
create index if not exists profiles_program_idx on public.profiles (program);
create index if not exists profiles_graduation_year_idx on public.profiles (graduation_year);
create index if not exists profiles_country_idx on public.profiles (country);
create index if not exists profiles_badge_idx on public.profiles (badge);

create index if not exists profile_skills_profile_id_idx on public.profile_skills (profile_id);

create index if not exists user_roles_user_id_idx on public.user_roles (user_id);
create index if not exists user_roles_role_id_idx on public.user_roles (role_id);

create index if not exists follows_following_id_idx on public.follows (following_id);
create index if not exists follows_follower_id_idx on public.follows (follower_id);

create index if not exists friendships_user_id_idx on public.friendships (user_id);
create index if not exists friendships_friend_id_idx on public.friendships (friend_id);
create index if not exists friendships_status_idx on public.friendships (status);

create index if not exists committee_positions_sort_order_idx on public.committee_positions (sort_order);
create index if not exists committee_members_profile_id_idx on public.committee_members (profile_id);
create index if not exists committee_members_position_id_idx on public.committee_members (position_id);
create index if not exists committee_members_current_idx on public.committee_members (is_current);

create index if not exists posts_author_id_idx on public.posts (author_id);
create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_type_idx on public.posts (type);
create index if not exists posts_search_vector_idx on public.posts using gin (search_vector);

create index if not exists projects_owner_id_idx on public.projects (owner_id);
create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_started_at_idx on public.projects (started_at);

create index if not exists post_images_post_id_idx on public.post_images (post_id);
create index if not exists post_tags_tag_idx on public.post_tags (tag);
create index if not exists post_likes_post_id_idx on public.post_likes (post_id);
create index if not exists post_likes_user_id_idx on public.post_likes (user_id);

create index if not exists post_comments_post_id_idx on public.post_comments (post_id);
create index if not exists post_comments_author_id_idx on public.post_comments (author_id);
create index if not exists post_comment_likes_comment_id_idx on public.post_comment_likes (comment_id);
create index if not exists post_comment_likes_user_id_idx on public.post_comment_likes (user_id);

create index if not exists bookmarks_user_id_idx on public.bookmarks (user_id);
create index if not exists bookmarks_post_id_idx on public.bookmarks (post_id);

create index if not exists forum_questions_author_id_idx on public.forum_questions (author_id);
create index if not exists forum_questions_created_at_idx on public.forum_questions (created_at desc);
create index if not exists forum_questions_resolved_idx on public.forum_questions (resolved);
create index if not exists forum_questions_tags_idx on public.forum_questions using gin (tags);

create index if not exists forum_answers_question_id_idx on public.forum_answers (question_id);
create index if not exists forum_answers_author_id_idx on public.forum_answers (author_id);
create index if not exists forum_answers_accepted_idx on public.forum_answers (is_accepted);

create index if not exists opportunities_type_idx on public.opportunities (type);
create index if not exists opportunities_status_idx on public.opportunities (status);
create index if not exists opportunities_deadline_idx on public.opportunities (deadline);
create index if not exists opportunities_posted_by_idx on public.opportunities (posted_by);
create index if not exists opportunities_created_at_idx on public.opportunities (created_at desc);

create index if not exists events_city_idx on public.events (city);
create index if not exists events_date_idx on public.events (date);
create index if not exists events_type_idx on public.events (type);
create index if not exists events_organizer_idx on public.events (organizer);
create index if not exists events_created_at_idx on public.events (created_at desc);

create index if not exists event_attendees_event_id_idx on public.event_attendees (event_id);
create index if not exists event_attendees_user_id_idx on public.event_attendees (user_id);
create index if not exists event_attendees_status_idx on public.event_attendees (status);

create index if not exists mentorships_mentor_id_idx on public.mentorships (mentor_id);
create index if not exists mentorships_mentee_id_idx on public.mentorships (mentee_id);
create index if not exists mentorships_status_idx on public.mentorships (status);

create index if not exists conversations_created_by_idx on public.conversations (created_by);
create index if not exists conversations_last_message_at_idx on public.conversations (last_message_at desc nulls last);

create index if not exists conversation_participants_user_id_idx on public.conversation_participants (user_id);
create index if not exists conversation_participants_conversation_id_idx on public.conversation_participants (conversation_id);

create index if not exists messages_conversation_id_idx on public.messages (conversation_id);
create index if not exists messages_sender_id_idx on public.messages (sender_id);
create index if not exists messages_created_at_idx on public.messages (created_at);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_created_at_idx on public.notifications (created_at desc);
create index if not exists notifications_read_idx on public.notifications (read);
create index if not exists notifications_type_idx on public.notifications (type);

create or replace function public.is_friend(profile_a uuid, profile_b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.friendships f
    where f.status = 'accepted'
      and (
        (f.user_id = profile_a and f.friend_id = profile_b)
        or
        (f.user_id = profile_b and f.friend_id = profile_a)
      )
  );
$$;

create or replace function public.is_conversation_participant(target_conversation_id uuid, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = target_conversation_id
      and cp.user_id = target_user_id
  );
$$;

create or replace function public.touch_conversation(target_conversation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_conversation_participant(target_conversation_id, auth.uid()) then
    raise exception 'current user is not a participant of this conversation';
  end if;

  update public.conversations
  set last_message_at = now(),
      updated_at = now()
  where id = target_conversation_id;
end;
$$;

create or replace function public.sync_forum_vote_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    if new.question_id is not null then
      update public.forum_questions
      set votes = votes + new.value
      where id = new.question_id;
    else
      update public.forum_answers
      set votes = votes + new.value
      where id = new.answer_id;
    end if;
  elsif TG_OP = 'UPDATE' then
    if old.question_id is not null then
      update public.forum_questions
      set votes = votes - old.value
      where id = old.question_id;
    else
      update public.forum_answers
      set votes = votes - old.value
      where id = old.answer_id;
    end if;

    if new.question_id is not null then
      update public.forum_questions
      set votes = votes + new.value
      where id = new.question_id;
    else
      update public.forum_answers
      set votes = votes + new.value
      where id = new.answer_id;
    end if;
  elsif TG_OP = 'DELETE' then
    if old.question_id is not null then
      update public.forum_questions
      set votes = votes - old.value
      where id = old.question_id;
    else
      update public.forum_answers
      set votes = votes - old.value
      where id = old.answer_id;
    end if;
  end if;

  return null;
end;
$$;

create or replace function public.upsert_forum_vote(
  p_user_id uuid,
  p_question_id uuid default null,
  p_answer_id uuid default null,
  p_value smallint default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'cannot vote on behalf of another user';
  end if;

  if p_value is null or p_value not in (-1, 1) then
    raise exception 'forum vote value must be -1 or 1';
  end if;

  if (p_question_id is null and p_answer_id is null) or (p_question_id is not null and p_answer_id is not null) then
    raise exception 'exactly one of question_id or answer_id is required';
  end if;

  if p_question_id is not null and not exists (select 1 from public.forum_questions where id = p_question_id) then
    raise exception 'question not found';
  end if;

  if p_answer_id is not null and not exists (select 1 from public.forum_answers where id = p_answer_id) then
    raise exception 'answer not found';
  end if;

  if p_question_id is not null then
    if exists (select 1 from public.forum_votes where user_id = p_user_id and question_id = p_question_id) then
      update public.forum_votes
      set value = p_value
      where user_id = p_user_id
        and question_id = p_question_id;
    else
      insert into public.forum_votes (user_id, question_id, value)
      values (p_user_id, p_question_id, p_value);
    end if;
  else
    if exists (select 1 from public.forum_votes where user_id = p_user_id and answer_id = p_answer_id) then
      update public.forum_votes
      set value = p_value
      where user_id = p_user_id
        and answer_id = p_answer_id;
    else
      insert into public.forum_votes (user_id, answer_id, value)
      values (p_user_id, p_answer_id, p_value);
    end if;
  end if;
end;
$$;

create or replace function public.message_update_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'service_role' or auth.uid() is null then
    return new;
  end if;

  if new.conversation_id is distinct from old.conversation_id
    or new.sender_id is distinct from old.sender_id
    or new.created_at is distinct from old.created_at then
    raise exception 'message identity fields cannot be changed';
  end if;

  if auth.uid() is distinct from old.sender_id and new.content is distinct from old.content then
    raise exception 'only the sender can change message content';
  end if;

  if auth.uid() is distinct from old.sender_id and new.read = false then
    raise exception 'participants can only mark messages as read';
  end if;

  if auth.uid() is distinct from old.sender_id and not public.is_conversation_participant(new.conversation_id, auth.uid()) then
    raise exception 'only conversation participants can update message read state';
  end if;

  return new;
end;
$$;

create or replace function public.get_or_create_conversation(p_other_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_conversation_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  if p_other_user_id is null or p_other_user_id = v_user_id then
    raise exception 'invalid conversation participant';
  end if;

  if not exists (select 1 from public.profiles where id = p_other_user_id) then
    raise exception 'profile not found';
  end if;

  select c.id
  into v_conversation_id
  from public.conversations c
  where exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = c.id and cp.user_id = v_user_id
  )
  and exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = c.id and cp.user_id = p_other_user_id
  )
  order by c.last_message_at desc nulls last, c.created_at desc
  limit 1;

  if v_conversation_id is not null then
    return v_conversation_id;
  end if;

  insert into public.conversations (created_by)
  values (v_user_id)
  returning id into v_conversation_id;

  insert into public.conversation_participants (conversation_id, user_id)
  values
    (v_conversation_id, v_user_id),
    (v_conversation_id, p_other_user_id);

  return v_conversation_id;
end;
$$;

create or replace function public.mark_conversation_read(p_conversation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_conversation_participant(p_conversation_id, auth.uid()) then
    raise exception 'current user is not a participant of this conversation';
  end if;

  update public.messages
  set read = true
  where conversation_id = p_conversation_id
    and sender_id <> auth.uid();

  update public.conversation_participants
  set unread_count = 0
  where conversation_id = p_conversation_id
    and user_id = auth.uid();
end;
$$;

create or replace function public.create_follow_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, content, link)
  select
    new.following_id,
    'follow',
    'Un nouvel utilisateur vous suit.',
    '/profile/' || new.follower_id
  where not exists (
    select 1
    from public.notifications n
    where n.user_id = new.following_id
      and n.type = 'follow'
      and n.link = '/profile/' || new.follower_id
      and n.created_at > now() - interval '1 minute'
  );

  return new;
end;
$$;

create or replace function public.create_post_like_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_post_author uuid;
begin
  select author_id into target_post_author
  from public.posts
  where id = new.post_id;

  if target_post_author is not null and target_post_author <> new.user_id then
    insert into public.notifications (user_id, type, content, link)
    select
      target_post_author,
      'like',
      'Quelqu’un a aimé votre publication.',
      '/feed'
    where not exists (
      select 1
      from public.notifications n
      where n.user_id = target_post_author
        and n.type = 'like'
        and n.link = '/feed'
        and n.created_at > now() - interval '1 minute'
    );
  end if;

  return new;
end;
$$;

create or replace function public.create_post_comment_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_post_author uuid;
begin
  select author_id into target_post_author
  from public.posts
  where id = new.post_id;

  if target_post_author is not null and target_post_author <> new.author_id then
    insert into public.notifications (user_id, type, content, link)
    select
      target_post_author,
      'comment',
      'Quelqu’un a commenté votre publication.',
      '/feed'
    where not exists (
      select 1
      from public.notifications n
      where n.user_id = target_post_author
        and n.type = 'comment'
        and n.link = '/feed'
        and n.created_at > now() - interval '1 minute'
    );
  end if;

  return new;
end;
$$;

create or replace function public.create_message_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversation_participants
  set unread_count = unread_count + 1
  where conversation_id = new.conversation_id
    and user_id <> new.sender_id;

  perform public.touch_conversation(new.conversation_id);

  return new;
end;
$$;

create or replace function public.create_mentorship_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'pending' then
    insert into public.notifications (user_id, type, content, link)
    select
      new.mentor_id,
      'mentorship',
      'Nouvelle demande de mentorat reçue.',
      '/mentorship'
    where not exists (
      select 1
      from public.notifications n
      where n.user_id = new.mentor_id
        and n.type = 'mentorship'
        and n.link = '/mentorship'
        and n.created_at > now() - interval '1 minute'
    );
  elsif new.status = 'active' and (TG_OP = 'INSERT' or old.status is distinct from 'active') then
    insert into public.notifications (user_id, type, content, link)
    select
      new.mentee_id,
      'mentorship',
      'Votre demande de mentorat a été acceptée.',
      '/mentorship'
    where not exists (
      select 1
      from public.notifications n
      where n.user_id = new.mentee_id
        and n.type = 'mentorship'
        and n.link = '/mentorship'
        and n.created_at > now() - interval '1 minute'
    );
  end if;

  return new;
end;
$$;

create or replace function public.create_event_attendance_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_organizer uuid;
begin
  if new.status <> 'going' or (TG_OP = 'UPDATE' and old.status = 'going') then
    return new;
  end if;

  select organizer into target_organizer
  from public.events
  where id = new.event_id;

  if target_organizer is not null and target_organizer <> new.user_id then
    insert into public.notifications (user_id, type, content, link)
    select
      target_organizer,
      'event',
      'Un nouvel étudiant participe à votre événement.',
      '/events'
    where not exists (
      select 1
      from public.notifications n
      where n.user_id = target_organizer
        and n.type = 'event'
        and n.link = '/events'
        and n.created_at > now() - interval '1 minute'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_social_links_updated_at on public.social_links;
create trigger set_social_links_updated_at
before update on public.social_links
for each row
execute function public.set_updated_at();

drop trigger if exists set_roles_updated_at on public.roles;
create trigger set_roles_updated_at
before update on public.roles
for each row
execute function public.set_updated_at();

drop trigger if exists set_user_roles_updated_at on public.user_roles;
create trigger set_user_roles_updated_at
before update on public.user_roles
for each row
execute function public.set_updated_at();

drop trigger if exists set_committee_positions_updated_at on public.committee_positions;
create trigger set_committee_positions_updated_at
before update on public.committee_positions
for each row
execute function public.set_updated_at();

drop trigger if exists set_committee_members_updated_at on public.committee_members;
create trigger set_committee_members_updated_at
before update on public.committee_members
for each row
execute function public.set_updated_at();

drop trigger if exists set_friendships_updated_at on public.friendships;
create trigger set_friendships_updated_at
before update on public.friendships
for each row
execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

drop trigger if exists set_post_comments_updated_at on public.post_comments;
create trigger set_post_comments_updated_at
before update on public.post_comments
for each row
execute function public.set_updated_at();

drop trigger if exists set_forum_questions_updated_at on public.forum_questions;
create trigger set_forum_questions_updated_at
before update on public.forum_questions
for each row
execute function public.set_updated_at();

drop trigger if exists set_forum_answers_updated_at on public.forum_answers;
create trigger set_forum_answers_updated_at
before update on public.forum_answers
for each row
execute function public.set_updated_at();

drop trigger if exists set_opportunities_updated_at on public.opportunities;
create trigger set_opportunities_updated_at
before update on public.opportunities
for each row
execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

drop trigger if exists set_mentorships_updated_at on public.mentorships;
create trigger set_mentorships_updated_at
before update on public.mentorships
for each row
execute function public.set_updated_at();

drop trigger if exists set_conversations_updated_at on public.conversations;
create trigger set_conversations_updated_at
before update on public.conversations
for each row
execute function public.set_updated_at();

drop trigger if exists handle_new_user_trigger on auth.users;
create trigger handle_new_user_trigger
after insert on auth.users
for each row
execute function public.handle_new_user();

drop trigger if exists forum_vote_count_trigger on public.forum_votes;
create trigger forum_vote_count_trigger
after insert or update or delete on public.forum_votes
for each row
execute function public.sync_forum_vote_counts();

drop trigger if exists follow_notification_trigger on public.follows;
create trigger follow_notification_trigger
after insert on public.follows
for each row
execute function public.create_follow_notification();

drop trigger if exists post_like_notification_trigger on public.post_likes;
create trigger post_like_notification_trigger
after insert on public.post_likes
for each row
execute function public.create_post_like_notification();

drop trigger if exists post_comment_notification_trigger on public.post_comments;
create trigger post_comment_notification_trigger
after insert on public.post_comments
for each row
execute function public.create_post_comment_notification();

drop trigger if exists message_notification_trigger on public.messages;
create trigger message_notification_trigger
after insert on public.messages
for each row
execute function public.create_message_notification();

drop trigger if exists mentorship_notification_trigger on public.mentorships;
create trigger mentorship_notification_trigger
after insert or update of status on public.mentorships
for each row
execute function public.create_mentorship_notification();

drop trigger if exists event_attendance_notification_trigger on public.event_attendees;
create trigger event_attendance_notification_trigger
after insert or update of status on public.event_attendees
for each row
execute function public.create_event_attendance_notification();

drop trigger if exists message_update_rules_trigger on public.messages;
create trigger message_update_rules_trigger
before update on public.messages
for each row
execute function public.message_update_rules();

alter table public.profiles enable row level security;
alter table public.profile_skills enable row level security;
alter table public.social_links enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.follows enable row level security;
alter table public.friendships enable row level security;
alter table public.committee_positions enable row level security;
alter table public.committee_members enable row level security;
alter table public.posts enable row level security;
alter table public.projects enable row level security;
alter table public.post_images enable row level security;
alter table public.post_tags enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_comment_likes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.forum_questions enable row level security;
alter table public.forum_answers enable row level security;
alter table public.forum_votes enable row level security;
alter table public.opportunities enable row level security;
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;
alter table public.mentorships enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.legacy_comments enable row level security;

drop policy if exists "profiles are viewable by everyone" on public.profiles;
drop policy if exists "users can insert own profile" on public.profiles;
drop policy if exists "users can update own profile" on public.profiles;
create policy "profiles are viewable by own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profile skills are viewable by everyone" on public.profile_skills;
drop policy if exists "users can manage own profile skills" on public.profile_skills;
create policy "profile skills are viewable by everyone"
on public.profile_skills
for select
using (true);

create policy "users can manage own profile skills"
on public.profile_skills
for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

drop policy if exists "social links are viewable by everyone" on public.social_links;
drop policy if exists "users can manage own social links" on public.social_links;
create policy "social links are viewable by everyone"
on public.social_links
for select
using (true);

create policy "users can manage own social links"
on public.social_links
for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

drop policy if exists "roles are viewable by everyone" on public.roles;
drop policy if exists "roles managed by authenticated admins placeholder" on public.roles;
create policy "roles are viewable by authenticated users"
on public.roles
for select
using (auth.role() = 'authenticated');

drop policy if exists "users can view their own user roles" on public.user_roles;
drop policy if exists "users can manage own user roles" on public.user_roles;
create policy "users can view their own user roles"
on public.user_roles
for select
using (auth.uid() = user_id);

drop policy if exists "follows are viewable by everyone" on public.follows;
drop policy if exists "users can manage own follows" on public.follows;
create policy "follows are viewable by everyone"
on public.follows
for select
using (true);

create policy "users can create follows"
on public.follows
for insert
with check (auth.uid() = follower_id and following_id <> auth.uid());

create policy "users can delete own follows"
on public.follows
for delete
using (auth.uid() = follower_id);

drop policy if exists "friendship rows are viewable to involved users" on public.friendships;
drop policy if exists "users can create friendship requests" on public.friendships;
drop policy if exists "users can update own friendship rows" on public.friendships;
drop policy if exists "friendships can be deleted by involved users" on public.friendships;
create policy "friendship rows are viewable to involved users"
on public.friendships
for select
using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "users can create friendship requests"
on public.friendships
for insert
with check (auth.uid() = user_id and friend_id <> auth.uid());

create policy "users can update friendship rows"
on public.friendships
for update
using (auth.uid() = user_id or auth.uid() = friend_id)
with check (auth.uid() = user_id or auth.uid() = friend_id);

create policy "friendships can be deleted by involved users"
on public.friendships
for delete
using (auth.uid() = user_id or auth.uid() = friend_id);

drop policy if exists "committee positions are viewable by everyone" on public.committee_positions;
drop policy if exists "committee positions managed by authenticated admins placeholder" on public.committee_positions;
create policy "committee positions are viewable by everyone"
on public.committee_positions
for select
using (true);

drop policy if exists "committee members are viewable by everyone" on public.committee_members;
drop policy if exists "committee members managed by authenticated admins placeholder" on public.committee_members;
create policy "committee members are viewable by everyone"
on public.committee_members
for select
using (true);

drop policy if exists "posts are viewable by everyone" on public.posts;
drop policy if exists "users can create posts" on public.posts;
drop policy if exists "users can update own posts" on public.posts;
drop policy if exists "users can delete own posts" on public.posts;
create policy "posts are viewable by everyone"
on public.posts
for select
using (true);

create policy "users can create posts"
on public.posts
for insert
with check (auth.uid() = author_id);

create policy "users can update own posts"
on public.posts
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "users can delete own posts"
on public.posts
for delete
using (auth.uid() = author_id);

drop policy if exists "post images are viewable by everyone" on public.post_images;
drop policy if exists "post owners can manage images" on public.post_images;
create policy "post images are viewable by everyone"
on public.post_images
for select
using (true);

create policy "post owners can manage images"
on public.post_images
for all
using (exists (select 1 from public.posts p where p.id = post_images.post_id and p.author_id = auth.uid()))
with check (exists (select 1 from public.posts p where p.id = post_images.post_id and p.author_id = auth.uid()));

drop policy if exists "post tags are viewable by everyone" on public.post_tags;
drop policy if exists "post owners can manage tags" on public.post_tags;
create policy "post tags are viewable by everyone"
on public.post_tags
for select
using (true);

create policy "post owners can manage tags"
on public.post_tags
for all
using (exists (select 1 from public.posts p where p.id = post_tags.post_id and p.author_id = auth.uid()))
with check (exists (select 1 from public.posts p where p.id = post_tags.post_id and p.author_id = auth.uid()));

drop policy if exists "post likes are viewable by everyone" on public.post_likes;
drop policy if exists "users can manage own post likes" on public.post_likes;
create policy "post likes are viewable by everyone"
on public.post_likes
for select
using (true);

create policy "users can manage own post likes"
on public.post_likes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "post comments are viewable by everyone" on public.post_comments;
drop policy if exists "users can create post comments" on public.post_comments;
drop policy if exists "users can update own post comments" on public.post_comments;
drop policy if exists "users can delete own post comments" on public.post_comments;
create policy "post comments are viewable by everyone"
on public.post_comments
for select
using (true);

create policy "users can create post comments"
on public.post_comments
for insert
with check (auth.uid() = author_id);

create policy "users can update own post comments"
on public.post_comments
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "users can delete own post comments"
on public.post_comments
for delete
using (auth.uid() = author_id);

drop policy if exists "post comment likes are viewable by everyone" on public.post_comment_likes;
drop policy if exists "users can manage own post comment likes" on public.post_comment_likes;
create policy "post comment likes are viewable by everyone"
on public.post_comment_likes
for select
using (true);

create policy "users can manage own post comment likes"
on public.post_comment_likes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can manage own bookmarks" on public.bookmarks;
create policy "users can view own bookmarks"
on public.bookmarks
for select
using (auth.uid() = user_id);

create policy "users can manage own bookmarks"
on public.bookmarks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "projects are viewable by everyone" on public.projects;
drop policy if exists "users can create projects" on public.projects;
drop policy if exists "users can update own projects" on public.projects;
drop policy if exists "users can delete own projects" on public.projects;
create policy "projects are viewable by everyone"
on public.projects
for select
using (true);

create policy "users can create projects"
on public.projects
for insert
with check (auth.uid() = owner_id);

create policy "users can update own projects"
on public.projects
for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "users can delete own projects"
on public.projects
for delete
using (auth.uid() = owner_id);

drop policy if exists "forum questions are viewable by everyone" on public.forum_questions;
drop policy if exists "users can create forum questions" on public.forum_questions;
drop policy if exists "users can update own forum questions" on public.forum_questions;
drop policy if exists "users can delete own forum questions" on public.forum_questions;
create policy "forum questions are viewable by everyone"
on public.forum_questions
for select
using (true);

create policy "users can create forum questions"
on public.forum_questions
for insert
with check (auth.uid() = author_id);

create policy "users can update own forum questions"
on public.forum_questions
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "users can delete own forum questions"
on public.forum_questions
for delete
using (auth.uid() = author_id);

drop policy if exists "forum answers are viewable by everyone" on public.forum_answers;
drop policy if exists "users can create forum answers" on public.forum_answers;
drop policy if exists "users can update own forum answers" on public.forum_answers;
drop policy if exists "users can delete own forum answers" on public.forum_answers;
create policy "forum answers are viewable by everyone"
on public.forum_answers
for select
using (true);

create policy "users can create forum answers"
on public.forum_answers
for insert
with check (auth.uid() = author_id);

create policy "users can update own forum answers"
on public.forum_answers
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "users can delete own forum answers"
on public.forum_answers
for delete
using (auth.uid() = author_id);

drop policy if exists "forum votes are viewable by everyone" on public.forum_votes;
drop policy if exists "users can manage own forum votes" on public.forum_votes;
create policy "forum votes are viewable by everyone"
on public.forum_votes
for select
using (true);

create policy "users can manage own forum votes"
on public.forum_votes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "opportunities are viewable by everyone" on public.opportunities;
drop policy if exists "users can create opportunities" on public.opportunities;
drop policy if exists "users can update own opportunities" on public.opportunities;
drop policy if exists "users can delete own opportunities" on public.opportunities;
create policy "opportunities are viewable by everyone"
on public.opportunities
for select
using (true);

create policy "users can create opportunities"
on public.opportunities
for insert
with check (auth.uid() = posted_by);

create policy "users can update own opportunities"
on public.opportunities
for update
using (auth.uid() = posted_by)
with check (auth.uid() = posted_by);

create policy "users can delete own opportunities"
on public.opportunities
for delete
using (auth.uid() = posted_by);

drop policy if exists "events are viewable by everyone" on public.events;
drop policy if exists "users can create events" on public.events;
drop policy if exists "users can update own events" on public.events;
drop policy if exists "users can delete own events" on public.events;
create policy "events are viewable by everyone"
on public.events
for select
using (true);

create policy "users can create events"
on public.events
for insert
with check (auth.uid() = organizer);

create policy "users can update own events"
on public.events
for update
using (auth.uid() = organizer)
with check (auth.uid() = organizer);

create policy "users can delete own events"
on public.events
for delete
using (auth.uid() = organizer);

drop policy if exists "event attendees are viewable by everyone" on public.event_attendees;
drop policy if exists "users can manage own event attendance" on public.event_attendees;
create policy "event attendees are viewable by everyone"
on public.event_attendees
for select
using (true);

create policy "users can manage own event attendance"
on public.event_attendees
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "mentorships are viewable to involved users" on public.mentorships;
drop policy if exists "users can request mentorship" on public.mentorships;
drop policy if exists "mentorship can be updated by involved users" on public.mentorships;
drop policy if exists "mentorship can be deleted by involved users" on public.mentorships;
create policy "mentorships are viewable to involved users"
on public.mentorships
for select
using (auth.uid() = mentor_id or auth.uid() = mentee_id);

create policy "users can request mentorship"
on public.mentorships
for insert
with check (auth.uid() = mentee_id and mentor_id <> auth.uid());

create policy "mentorship can be updated by involved users"
on public.mentorships
for update
using (auth.uid() = mentor_id or auth.uid() = mentee_id)
with check (auth.uid() = mentor_id or auth.uid() = mentee_id);

create policy "mentorship can be deleted by involved users"
on public.mentorships
for delete
using (auth.uid() = mentor_id or auth.uid() = mentee_id);

drop policy if exists "conversations are viewable to participants" on public.conversations;
drop policy if exists "users can create conversations" on public.conversations;
create policy "conversations are viewable to participants"
on public.conversations
for select
using (public.is_conversation_participant(id, auth.uid()));

create policy "users can create conversations"
on public.conversations
for insert
with check (auth.uid() = created_by);

drop policy if exists "conversation participants are viewable to participants" on public.conversation_participants;
drop policy if exists "users can manage own conversation participant row" on public.conversation_participants;
create policy "conversation participants are viewable to involved users"
on public.conversation_participants
for select
using (
  auth.uid() = user_id
  or public.is_conversation_participant(conversation_id, auth.uid())
  or exists (
    select 1
    from public.conversations c
    where c.id = conversation_participants.conversation_id
      and c.created_by = auth.uid()
  )
);

create policy "users can manage conversation participant rows"
on public.conversation_participants
for all
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.conversations c
    where c.id = conversation_participants.conversation_id
      and c.created_by = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  or exists (
    select 1
    from public.conversations c
    where c.id = conversation_participants.conversation_id
      and c.created_by = auth.uid()
  )
);

drop policy if exists "messages are viewable to conversation participants" on public.messages;
drop policy if exists "users can send messages in conversations they participate in" on public.messages;
drop policy if exists "users can update messages as sender or receiver" on public.messages;
drop policy if exists "users can delete own messages" on public.messages;
create policy "messages are viewable to conversation participants"
on public.messages
for select
using (public.is_conversation_participant(conversation_id, auth.uid()));

create policy "users can send messages in conversations they participate in"
on public.messages
for insert
with check (
  auth.uid() = sender_id
  and public.is_conversation_participant(conversation_id, auth.uid())
);

create policy "users can update messages they may change"
on public.messages
for update
using (
  auth.uid() = sender_id
  or public.is_conversation_participant(conversation_id, auth.uid())
)
with check (
  auth.uid() = sender_id
  or (public.is_conversation_participant(conversation_id, auth.uid()) and read = true)
);

create policy "users can delete own messages"
on public.messages
for delete
using (auth.uid() = sender_id);

drop policy if exists "users can view own notifications" on public.notifications;
drop policy if exists "users can update own notifications" on public.notifications;
drop policy if exists "users can delete own notifications" on public.notifications;
create policy "users can view own notifications"
on public.notifications
for select
using (auth.uid() = user_id);

create policy "users can update own notifications"
on public.notifications
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can delete own notifications"
on public.notifications
for delete
using (auth.uid() = user_id);

drop policy if exists "legacy comments are viewable by everyone" on public.legacy_comments;
drop policy if exists "legacy comments can be inserted by anyone" on public.legacy_comments;
create policy "legacy comments are viewable by everyone"
on public.legacy_comments
for select
using (true);

create policy "legacy comments can be inserted by authenticated users"
on public.legacy_comments
for insert
with check (auth.role() = 'authenticated');

grant usage on schema public to anon, authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profile_skills to authenticated;
grant select, insert, update, delete on public.social_links to authenticated;
grant select on public.roles to authenticated;
grant select on public.user_roles to authenticated;
grant select, insert, delete on public.follows to authenticated;
grant select, insert, update, delete on public.friendships to authenticated;
grant select on public.committee_positions to authenticated;
grant select on public.committee_members to authenticated;
grant select, insert, update, delete on public.posts to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.post_images to authenticated;
grant select, insert, update, delete on public.post_tags to authenticated;
grant select, insert, update, delete on public.post_likes to authenticated;
grant select, insert, update, delete on public.post_comments to authenticated;
grant select, insert, update, delete on public.post_comment_likes to authenticated;
grant select, insert, update, delete on public.bookmarks to authenticated;
grant select, insert, update, delete on public.forum_questions to authenticated;
grant select, insert, update, delete on public.forum_answers to authenticated;
grant select, insert, update, delete on public.forum_votes to authenticated;
grant select, insert, update, delete on public.opportunities to authenticated;
grant select, insert, update, delete on public.events to authenticated;
grant select, insert, update, delete on public.event_attendees to authenticated;
grant select, insert, update, delete on public.mentorships to authenticated;
grant select, insert on public.conversations to authenticated;
grant select, insert, update, delete on public.conversation_participants to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select on public.legacy_comments to anon, authenticated;
grant insert on public.legacy_comments to authenticated;

revoke execute on function public.set_updated_at() from public;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.touch_conversation(uuid) from public;
revoke execute on function public.sync_forum_vote_counts() from public;
revoke execute on function public.create_follow_notification() from public;
revoke execute on function public.create_post_like_notification() from public;
revoke execute on function public.create_post_comment_notification() from public;
revoke execute on function public.create_message_notification() from public;
revoke execute on function public.create_mentorship_notification() from public;
revoke execute on function public.create_event_attendance_notification() from public;
revoke execute on function public.message_update_rules() from public;
revoke execute on function public.get_or_create_conversation(uuid) from public;
revoke execute on function public.mark_conversation_read(uuid) from public;
revoke execute on function public.upsert_forum_vote(uuid, uuid, uuid, smallint) from public;

grant execute on function public.is_friend(uuid, uuid) to authenticated;
grant execute on function public.is_conversation_participant(uuid, uuid) to authenticated;
grant execute on function public.upsert_forum_vote(uuid, uuid, uuid, smallint) to authenticated;
grant execute on function public.get_or_create_conversation(uuid) to authenticated;
grant execute on function public.mark_conversation_read(uuid) to authenticated;

create or replace view public.profile_public_view as
select
  p.id,
  case when p.id = auth.uid() then p.email else null end as email,
  p.full_name as name,
  p.avatar_url as avatar,
  p.bio,
  p.university,
  p.city,
  p.field,
  p.level,
  p.department,
  p.program,
  p.graduation_year,
  case when p.id = auth.uid() then p.phone else null end as phone,
  p.country,
  p.badge,
  p.avatar_type,
  p.joined_at,
  p.updated_at,
  p.is_online,
  case when p.id = auth.uid() then p.cv_url else null end as cv_url,
  p.search_vector,
  coalesce(follower_stats.followers_count, 0) as followers_count,
  coalesce(following_stats.following_count, 0) as following_count,
  coalesce(friend_stats.friends_count, 0) as friends_count,
  coalesce(ps.skills, '{}') as skills,
  sl.instagram,
  sl.linkedin,
  sl.twitter,
  sl.whatsapp
from public.profiles p
left join lateral (
  select count(*) as followers_count
  from public.follows f
  where f.following_id = p.id
) follower_stats on true
left join lateral (
  select count(*) as following_count
  from public.follows f
  where f.follower_id = p.id
) following_stats on true
left join lateral (
  select count(*) as friends_count
  from public.friendships f
  where f.status = 'accepted'
    and (f.user_id = p.id or f.friend_id = p.id)
) friend_stats on true
left join lateral (
  select array_agg(skill order by created_at) as skills
  from public.profile_skills ps
  where ps.profile_id = p.id
) ps on true
left join public.social_links sl on sl.profile_id = p.id;

create or replace view public.post_public_view as
select
  p.id,
  p.author_id,
  pa.full_name as author_name,
  pa.avatar_url as author_avatar,
  p.content,
  p.type,
  p.created_at,
  p.updated_at,
  coalesce(array_agg(pi.url order by pi.sort_order, pi.created_at) filter (where pi.id is not null), '{}') as images,
  coalesce(array_agg(pt.tag order by pt.tag) filter (where pt.id is not null), '{}') as tags,
  count(distinct pl.user_id) as like_count,
  count(distinct pc.id) as comment_count,
  coalesce(bool_or(pl.user_id = auth.uid()), false) as is_liked,
  exists (
    select 1
    from public.bookmarks b
    where b.user_id = auth.uid()
      and b.post_id = p.id
  ) as is_bookmarked
from public.posts p
left join public.profiles pa on pa.id = p.author_id
left join public.post_images pi on pi.post_id = p.id
left join public.post_tags pt on pt.post_id = p.id
left join public.post_likes pl on pl.post_id = p.id
left join public.post_comments pc on pc.post_id = p.id
group by
  p.id, p.author_id, p.content, p.type, p.created_at, p.updated_at,
  pa.full_name, pa.avatar_url;

create or replace view public.forum_question_public_view as
select
  fq.id,
  fq.author_id,
  pa.full_name as author_name,
  pa.avatar_url as author_avatar,
  fq.title,
  fq.content,
  fq.tags,
  fq.votes,
  fq.resolved,
  fq.created_at,
  fq.updated_at,
  count(distinct fa.id) as answer_count,
  coalesce(bool_or(fv.user_id = auth.uid()), false) as is_voted
from public.forum_questions fq
left join public.profiles pa on pa.id = fq.author_id
left join public.forum_answers fa on fa.question_id = fq.id
left join public.forum_votes fv on fv.question_id = fq.id
group by
  fq.id, fq.author_id, fq.title, fq.content, fq.tags, fq.votes,
  fq.resolved, fq.created_at, fq.updated_at, pa.full_name, pa.avatar_url;

create or replace view public.event_public_view as
select
  e.id,
  e.title,
  e.description,
  e.date,
  e.time,
  e.location,
  e.city,
  e.type,
  e.organizer,
  e.image,
  e.image_storage_path,
  e.created_at,
  e.updated_at,
  count(ea.user_id) filter (where ea.status = 'going') as going_count,
  coalesce(bool_or(ea.user_id = auth.uid()), false) as is_attending
from public.events e
left join public.event_attendees ea on ea.event_id = e.id
group by
  e.id, e.title, e.description, e.date, e.time, e.location, e.city,
  e.type, e.organizer, e.image, e.image_storage_path, e.created_at, e.updated_at;

create or replace view public.conversation_list_view as
select
  c.id,
  c.title,
  c.created_by,
  c.created_at,
  c.updated_at,
  c.last_message_at,
  cp.unread_count,
  other_profile.id as other_user_id,
  other_profile.full_name as other_user_name,
  other_profile.avatar_url as other_user_avatar,
  other_profile.is_online as other_user_is_online,
  last_msg.content as last_message_content,
  last_msg.created_at as last_message_created_at,
  last_msg.sender_id as last_message_sender_id
from public.conversations c
join public.conversation_participants cp
  on cp.conversation_id = c.id
 and cp.user_id = auth.uid()
left join public.conversation_participants other_cp
  on other_cp.conversation_id = c.id
 and other_cp.user_id <> cp.user_id
left join public.profiles other_profile
  on other_profile.id = other_cp.user_id
left join lateral (
  select m.*
  from public.messages m
  where m.conversation_id = c.id
  order by m.created_at desc
  limit 1
) last_msg on true;

create or replace view public.committee_public_view as
select
  cp.id as position_id,
  cp.title,
  cp.title_en,
  cp.description,
  cp.sort_order as position_sort_order,
  cm.id as membership_id,
  cm.profile_id,
  p.full_name as member_name,
  p.avatar_url as member_avatar,
  p.city,
  p.field,
  p.badge,
  cm.term_start,
  cm.term_end,
  cm.is_current,
  cm.sort_order as member_sort_order
from public.committee_positions cp
left join public.committee_members cm
  on cm.position_id = cp.id
 and cm.is_current = true
left join public.profiles p
  on p.id = cm.profile_id
order by cp.sort_order, cm.sort_order;

grant select on public.profile_public_view to anon, authenticated;
grant select on public.post_public_view to anon, authenticated;
grant select on public.forum_question_public_view to anon, authenticated;
grant select on public.event_public_view to anon, authenticated;
grant select on public.conversation_list_view to authenticated;
grant select on public.committee_public_view to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('post-images', 'post-images', true, 10485760, array['image/png','image/jpeg','image/webp']),
  ('event-images', 'event-images', true, 10485760, array['image/png','image/jpeg','image/webp']),
  ('cv-files', 'cv-files', false, 5242880, array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('opportunity-files', 'opportunity-files', false, 10485760, array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

do $$
declare
  policy_name text;
  policy_sql text;
  drop_policy_names text[] := array[
    'avatars are publicly viewable',
    'users can upload own avatar',
    'users can update own avatar',
    'users can delete own avatar',
    'post images are publicly viewable',
    'authenticated users can upload post images',
    'authenticated users can update post images',
    'authenticated users can delete post images',
    'event images are publicly viewable',
    'authenticated users can upload event images',
    'authenticated users can update event images',
    'authenticated users can delete event images',
    'users can view own cv files',
    'users can upload own cv files',
    'users can update own cv files',
    'users can delete own cv files',
    'users can view own opportunity files',
    'users can upload own opportunity files',
    'users can update own opportunity files',
    'users can delete own opportunity files'
  ];
  create_policy_sql text[] := array[
    $policy$create policy "avatars are publicly viewable" on storage.objects for select using (bucket_id = 'avatars');$policy$,
    $policy$create policy "users can upload own avatar" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "users can update own avatar" on storage.objects for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]) with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "users can delete own avatar" on storage.objects for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "post images are publicly viewable" on storage.objects for select using (bucket_id = 'post-images');$policy$,
    $policy$create policy "authenticated users can upload post images" on storage.objects for insert with check (bucket_id = 'post-images' and auth.role() = 'authenticated' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "authenticated users can update post images" on storage.objects for update using (bucket_id = 'post-images' and auth.role() = 'authenticated' and auth.uid()::text = (storage.foldername(name))[1]) with check (bucket_id = 'post-images' and auth.role() = 'authenticated' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "authenticated users can delete post images" on storage.objects for delete using (bucket_id = 'post-images' and auth.role() = 'authenticated' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "event images are publicly viewable" on storage.objects for select using (bucket_id = 'event-images');$policy$,
    $policy$create policy "authenticated users can upload event images" on storage.objects for insert with check (bucket_id = 'event-images' and auth.role() = 'authenticated' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "authenticated users can update event images" on storage.objects for update using (bucket_id = 'event-images' and auth.role() = 'authenticated' and auth.uid()::text = (storage.foldername(name))[1]) with check (bucket_id = 'event-images' and auth.role() = 'authenticated' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "authenticated users can delete event images" on storage.objects for delete using (bucket_id = 'event-images' and auth.role() = 'authenticated' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "users can view own cv files" on storage.objects for select using (bucket_id = 'cv-files' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "users can upload own cv files" on storage.objects for insert with check (bucket_id = 'cv-files' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "users can update own cv files" on storage.objects for update using (bucket_id = 'cv-files' and auth.uid()::text = (storage.foldername(name))[1]) with check (bucket_id = 'cv-files' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "users can delete own cv files" on storage.objects for delete using (bucket_id = 'cv-files' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "users can view own opportunity files" on storage.objects for select using (bucket_id = 'opportunity-files' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "users can upload own opportunity files" on storage.objects for insert with check (bucket_id = 'opportunity-files' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "users can update own opportunity files" on storage.objects for update using (bucket_id = 'opportunity-files' and auth.uid()::text = (storage.foldername(name))[1]) with check (bucket_id = 'opportunity-files' and auth.uid()::text = (storage.foldername(name))[1]);$policy$,
    $policy$create policy "users can delete own opportunity files" on storage.objects for delete using (bucket_id = 'opportunity-files' and auth.uid()::text = (storage.foldername(name))[1]);$policy$
  ];
begin
  begin
    alter table storage.objects enable row level security;
  exception when insufficient_privilege then
    raise notice 'Skipping storage.objects RLS enable because the current role is not the table owner.';
  end;

  foreach policy_name in array drop_policy_names loop
    begin
      execute format('drop policy if exists %I on storage.objects', policy_name);
    exception when insufficient_privilege then
      raise notice 'Skipping drop policy "%" on storage.objects because the current role is not the table owner.', policy_name;
    end;
  end loop;

  foreach policy_sql in array create_policy_sql loop
    begin
      execute policy_sql;
    exception when insufficient_privilege then
      raise notice 'Skipping storage.objects policy creation because the current role is not the table owner.';
    end;
  end loop;
end;
$$;


do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'projects'
  ) then
    alter publication supabase_realtime add table public.projects;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'committee_members'
  ) then
    alter publication supabase_realtime add table public.committee_members;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'posts'
  ) then
    alter publication supabase_realtime add table public.posts;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'post_comments'
  ) then
    alter publication supabase_realtime add table public.post_comments;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'forum_questions'
  ) then
    alter publication supabase_realtime add table public.forum_questions;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'forum_answers'
  ) then
    alter publication supabase_realtime add table public.forum_answers;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'events'
  ) then
    alter publication supabase_realtime add table public.events;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'event_attendees'
  ) then
    alter publication supabase_realtime add table public.event_attendees;
  end if;
end;
$$;