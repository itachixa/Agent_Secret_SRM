import os
from datetime import datetime, timezone
from typing import Any, Literal

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

DATABASE_URL = os.environ["DATABASE_URL"].replace("postgresql://", "postgresql+asyncpg://", 1)
engine = create_async_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session


def require_user(x_user_id: str | None = Header(default=None, alias="X-User-ID")) -> str:
    if not x_user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="X-User-ID header is required")
    return x_user_id


class PostCreate(BaseModel):
    content: str
    type: str = "general"
    tags: list[str] = Field(default_factory=list)
    images: list[str] = Field(default_factory=list)


class PostUpdate(BaseModel):
    content: str | None = None
    type: str | None = None


class CommentCreate(BaseModel):
    content: str


class ForumQuestionCreate(BaseModel):
    title: str
    content: str
    tags: list[str] = Field(default_factory=list)


class ForumQuestionUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    tags: list[str] | None = None
    resolved: bool | None = None


class ForumAnswerCreate(BaseModel):
    content: str


class ForumAnswerUpdate(BaseModel):
    content: str | None = None
    is_accepted: bool | None = None


class OpportunityCreate(BaseModel):
    title: str
    company: str
    type: str
    status: str = "open"
    location: str
    description: str
    deadline: datetime | None = None
    url: str
    postedBy: str | None = None


class OpportunityUpdate(BaseModel):
    title: str | None = None
    company: str | None = None
    type: str | None = None
    status: str | None = None
    location: str | None = None
    description: str | None = None
    deadline: datetime | None = None
    url: str | None = None


class EventCreate(BaseModel):
    title: str
    description: str
    date: str
    time: str
    location: str
    city: str
    type: str
    organizer: str | None = None
    image: str | None = None
    image_storage_path: str | None = None


class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    date: str | None = None
    time: str | None = None
    location: str | None = None
    city: str | None = None
    type: str | None = None
    image: str | None = None
    image_storage_path: str | None = None


class MentorshipCreate(BaseModel):
    mentor_id: str
    field: str


class MentorshipUpdate(BaseModel):
    status: str | None = None
    field: str | None = None


class MessageCreate(BaseModel):
    content: str


class ConversationCreate(BaseModel):
    other_user_id: str
    title: str | None = None


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    university: str | None = None
    city: str | None = None
    field: str | None = None
    level: str | None = None
    department: str | None = None
    program: str | None = None
    graduation_year: int | None = None
    phone: str | None = None
    country: str | None = None
    badge: str | None = None
    avatar_type: str | None = None
    cv_url: str | None = None


class ProjectCreate(BaseModel):
    title: str
    description: str
    url: str | None = None
    repository_url: str | None = None
    status: str = "active"
    started_at: str | None = None
    completed_at: str | None = None


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    url: str | None = None
    repository_url: str | None = None
    status: str | None = None
    started_at: str | None = None
    completed_at: str | None = None


class LegacyCommentCreate(BaseModel):
    pseudo: str
    comment: str


def rows(result: Any) -> list[dict[str, Any]]:
    return [dict(row) for row in result.mappings().all()]


def one(result: Any) -> dict[str, Any] | None:
    row = result.mappings().first()
    return dict(row) if row else None


app = FastAPI(title="Togolese Students India API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "").split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "togolese-students-india-api", "status": "ok"}


@app.get("/api/health")
async def health(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("select now() as now, count(*) as profiles_count from public.profiles"))
    row = one(result) or {}
    return {"status": "ok", "database": "ok", "now": row.get("now"), "profiles_count": row.get("profiles_count")}


@app.get("/api/profiles")
async def list_profiles(
    q: str | None = None,
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> list[dict[str, Any]]:
    params: dict[str, Any] = {"limit": limit}
    where = ""
    if q:
        where = "where p.search_vector @@ plainto_tsquery('french', :q) or p.full_name ilike :like_q"
        params.update({"q": q, "like_q": f"%{q}%"})
    result = await db.execute(text(f"""
        select * from public.profile_public_view p
        {where}
        order by p.name
        limit :limit
    """), params)
    return rows(result)


@app.get("/api/profiles/{profile_id}")
async def get_profile(profile_id: str, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("select * from public.profile_public_view where id = :id"), {"id": profile_id})
    profile = one(result)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@app.put("/api/profiles/{profile_id}")
async def update_profile(profile_id: str, payload: ProfileUpdate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    if user_id != profile_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")
    assignments = ", ".join(f"{key} = :{key}" for key in data)
    data["id"] = profile_id
    result = await db.execute(text(f"update public.profiles set {assignments}, updated_at = now() where id = :id returning *"), data)
    await db.commit()
    return one(result) or {}


@app.get("/api/profiles/{profile_id}/skills")
async def get_profile_skills(profile_id: str, db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    result = await db.execute(text("select id, profile_id, skill, created_at from public.profile_skills where profile_id = :id order by created_at"), {"id": profile_id})
    return rows(result)


@app.put("/api/profiles/{profile_id}/skills")
async def replace_profile_skills(profile_id: str, skills: list[str], user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    if user_id != profile_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    normalized = sorted({skill.strip() for skill in skills if skill.strip()})
    await db.execute(text("delete from public.profile_skills where profile_id = :id"), {"id": profile_id})
    if normalized:
        await db.execute(text("insert into public.profile_skills (profile_id, skill) values (:profile_id, :skill)"), [{"profile_id": profile_id, "skill": skill} for skill in normalized])
    await db.commit()
    return await get_profile_skills(profile_id, db)


@app.get("/api/profiles/{profile_id}/social-links")
async def get_social_links(profile_id: str, db: AsyncSession = Depends(get_db)) -> dict[str, Any] | None:
    result = await db.execute(text("select * from public.social_links where profile_id = :id"), {"id": profile_id})
    return one(result)


@app.put("/api/profiles/{profile_id}/social-links")
async def upsert_social_links(profile_id: str, payload: dict[str, Any], user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    if user_id != profile_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    data = {**payload, "profile_id": profile_id}
    result = await db.execute(text("""
        insert into public.social_links (profile_id, instagram, linkedin, twitter, whatsapp)
        values (:profile_id, :instagram, :linkedin, :twitter, :whatsapp)
        on conflict (profile_id) do update set
          instagram = excluded.instagram,
          linkedin = excluded.linkedin,
          twitter = excluded.twitter,
          whatsapp = excluded.whatsapp,
          updated_at = now()
        returning *
    """), data)
    await db.commit()
    return one(result) or {}


@app.post("/api/profiles/{profile_id}/follow")
async def follow_profile(profile_id: str, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    if user_id == profile_id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    result = await db.execute(text("insert into public.follows (follower_id, following_id) values (:follower_id, :following_id) on conflict do nothing returning *"), {"follower_id": user_id, "following_id": profile_id})
    await db.commit()
    return one(result) or {"follower_id": user_id, "following_id": profile_id}


@app.delete("/api/profiles/{profile_id}/follow")
async def unfollow_profile(profile_id: str, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    await db.execute(text("delete from public.follows where follower_id = :follower_id and following_id = :following_id"), {"follower_id": user_id, "following_id": profile_id})
    await db.commit()
    return {"status": "deleted"}


@app.get("/api/posts")
async def list_posts(type: str | None = None, db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    params: dict[str, Any] = {}
    where = ""
    if type and type != "all":
        where = "where p.type = :type"
        params["type"] = type
    result = await db.execute(text(f"select * from public.post_public_view p {where} order by p.created_at desc limit 50"), params)
    return rows(result)


@app.post("/api/posts")
async def create_post(payload: PostCreate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("insert into public.posts (author_id, content, type) values (:author_id, :content, :type::public.post_type) returning *"), {"author_id": user_id, "content": payload.content, "type": payload.type})
    post = one(result) or {}
    post_id = post["id"]
    if payload.tags:
        await db.execute(text("insert into public.post_tags (post_id, tag) values (:post_id, :tag) on conflict do nothing"), [{"post_id": post_id, "tag": tag} for tag in payload.tags])
    if payload.images:
        await db.execute(text("insert into public.post_images (post_id, url, sort_order) values (:post_id, :url, :sort_order)"), [{"post_id": post_id, "url": url, "sort_order": index} for index, url in enumerate(payload.images)])
    await db.commit()
    return post


@app.post("/api/posts/{post_id}/comments")
async def create_post_comment(post_id: str, payload: CommentCreate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("insert into public.post_comments (post_id, author_id, content) values (:post_id, :author_id, :content) returning *"), {"post_id": post_id, "author_id": user_id, "content": payload.content})
    await db.commit()
    return one(result) or {}


@app.post("/api/posts/{post_id}/like")
async def like_post(post_id: str, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("insert into public.post_likes (post_id, user_id) values (:post_id, :user_id) on conflict do nothing returning *"), {"post_id": post_id, "user_id": user_id})
    await db.commit()
    return one(result) or {"post_id": post_id, "user_id": user_id}


@app.delete("/api/posts/{post_id}/like")
async def unlike_post(post_id: str, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    await db.execute(text("delete from public.post_likes where post_id = :post_id and user_id = :user_id"), {"post_id": post_id, "user_id": user_id})
    await db.commit()
    return {"status": "deleted"}


@app.post("/api/posts/{post_id}/bookmark")
async def bookmark_post(post_id: str, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("insert into public.bookmarks (post_id, user_id) values (:post_id, :user_id) on conflict do nothing returning *"), {"post_id": post_id, "user_id": user_id})
    await db.commit()
    return one(result) or {"post_id": post_id, "user_id": user_id}


@app.delete("/api/posts/{post_id}/bookmark")
async def unbookmark_post(post_id: str, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    await db.execute(text("delete from public.bookmarks where post_id = :post_id and user_id = :user_id"), {"post_id": post_id, "user_id": user_id})
    await db.commit()
    return {"status": "deleted"}


@app.get("/api/forum/questions")
async def list_forum_questions(db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    result = await db.execute(text("select * from public.forum_question_public_view order by created_at desc limit 50"))
    return rows(result)


@app.post("/api/forum/questions")
async def create_forum_question(payload: ForumQuestionCreate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("insert into public.forum_questions (author_id, title, content, tags) values (:author_id, :title, :content, :tags) returning *"), {"author_id": user_id, "title": payload.title, "content": payload.content, "tags": payload.tags})
    await db.commit()
    return one(result) or {}


@app.post("/api/forum/questions/{question_id}/answers")
async def create_forum_answer(question_id: str, payload: ForumAnswerCreate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("insert into public.forum_answers (question_id, author_id, content) values (:question_id, :author_id, :content) returning *"), {"question_id": question_id, "author_id": user_id, "content": payload.content})
    await db.commit()
    return one(result) or {}


@app.post("/api/forum/questions/{question_id}/vote")
async def vote_question(question_id: str, value: Literal[-1, 1], user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    await db.execute(text("select public.upsert_forum_vote(:user_id, :question_id, null, :value)"), {"user_id": user_id, "question_id": question_id, "value": value})
    await db.commit()
    return {"status": "ok"}


@app.post("/api/forum/answers/{answer_id}/vote")
async def vote_answer(answer_id: str, value: Literal[-1, 1], user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    await db.execute(text("select public.upsert_forum_vote(:user_id, null, :answer_id, :value)"), {"user_id": user_id, "answer_id": answer_id, "value": value})
    await db.commit()
    return {"status": "ok"}


@app.get("/api/opportunities")
async def list_opportunities(type: str | None = None, status: str | None = None, db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    clauses = []
    params: dict[str, Any] = {}
    if type and type != "all":
        clauses.append("type = :type")
        params["type"] = type
    if status and status != "all":
        clauses.append("status = :status")
        params["status"] = status
    where = f"where {' and '.join(clauses)}" if clauses else ""
    result = await db.execute(text(f"select * from public.opportunities {where} order by created_at desc"), params)
    return rows(result)


@app.post("/api/opportunities")
async def create_opportunity(payload: OpportunityCreate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    data = payload.model_dump()
    data["posted_by"] = payload.postedBy or user_id
    result = await db.execute(text("""
        insert into public.opportunities (title, company, type, status, location, description, deadline, url, posted_by)
        values (:title, :company, :type::public.opportunity_type, :status::public.opportunity_status, :location, :description, :deadline, :url, :posted_by)
        returning *
    """), data)
    await db.commit()
    return one(result) or {}


@app.get("/api/events")
async def list_events(db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    result = await db.execute(text("select * from public.event_public_view order by date asc, created_at desc"))
    return rows(result)


@app.post("/api/events")
async def create_event(payload: EventCreate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    data = payload.model_dump()
    data["organizer"] = payload.organizer or user_id
    result = await db.execute(text("""
        insert into public.events (title, description, date, time, location, city, type, organizer, image, image_storage_path)
        values (:title, :description, :date, :time, :location, :city, :type::public.event_type, :organizer, :image, :image_storage_path)
        returning *
    """), data)
    await db.commit()
    return one(result) or {}


@app.post("/api/events/{event_id}/attend")
async def attend_event(event_id: str, status_value: Literal["going", "interested", "not_going"] = "going", user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("""
        insert into public.event_attendees (event_id, user_id, status)
        values (:event_id, :user_id, :status::public.attendance_status)
        on conflict (event_id, user_id) do update set status = excluded.status
        returning *
    """), {"event_id": event_id, "user_id": user_id, "status": status_value})
    await db.commit()
    return one(result) or {}


@app.delete("/api/events/{event_id}/attend")
async def leave_event(event_id: str, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    await db.execute(text("delete from public.event_attendees where event_id = :event_id and user_id = :user_id"), {"event_id": event_id, "user_id": user_id})
    await db.commit()
    return {"status": "deleted"}


@app.get("/api/mentorships")
async def list_mentorships(user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    result = await db.execute(text("select * from public.mentorships where mentor_id = :user_id or mentee_id = :user_id order by created_at desc"), {"user_id": user_id})
    return rows(result)


@app.post("/api/mentorships")
async def create_mentorship(payload: MentorshipCreate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("insert into public.mentorships (mentor_id, mentee_id, field) values (:mentor_id, :mentee_id, :field) returning *"), {"mentor_id": payload.mentor_id, "mentee_id": user_id, "field": payload.field})
    await db.commit()
    return one(result) or {}


@app.get("/api/conversations")
async def list_conversations(db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    result = await db.execute(text("select * from public.conversation_list_view order by last_message_at desc nulls last, created_at desc"))
    return rows(result)


@app.post("/api/conversations")
async def create_conversation(payload: ConversationCreate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("select public.get_or_create_conversation(:other_user_id)"), {"other_user_id": payload.other_user_id})
    conversation_id = result.scalar()
    if payload.title and conversation_id:
        await db.execute(text("update public.conversations set title = :title where id = :id"), {"title": payload.title, "id": conversation_id})
    await db.commit()
    return {"id": conversation_id, "title": payload.title}


@app.get("/api/conversations/{conversation_id}/messages")
async def list_messages(conversation_id: str, db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    result = await db.execute(text("select * from public.messages where conversation_id = :id order by created_at asc"), {"id": conversation_id})
    return rows(result)


@app.post("/api/conversations/{conversation_id}/messages")
async def send_message(conversation_id: str, payload: MessageCreate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("insert into public.messages (conversation_id, sender_id, content) values (:conversation_id, :sender_id, :content) returning *"), {"conversation_id": conversation_id, "sender_id": user_id, "content": payload.content})
    await db.commit()
    return one(result) or {}


@app.post("/api/conversations/{conversation_id}/read")
async def mark_conversation_read(conversation_id: str, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    await db.execute(text("select public.mark_conversation_read(:conversation_id)"), {"conversation_id": conversation_id})
    await db.commit()
    return {"status": "ok"}


@app.get("/api/notifications")
async def list_notifications(user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    result = await db.execute(text("select * from public.notifications where user_id = :user_id order by created_at desc limit 100"), {"user_id": user_id})
    return rows(result)


@app.put("/api/notifications/read-all")
async def mark_all_notifications_read(user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    await db.execute(text("update public.notifications set read = true where user_id = :user_id and read = false"), {"user_id": user_id})
    await db.commit()
    return {"status": "ok"}


@app.get("/api/projects")
async def list_projects(status: str | None = None, db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    params: dict[str, Any] = {}
    where = ""
    if status and status != "all":
        where = "where status = :status"
        params["status"] = status
    result = await db.execute(text(f"select * from public.projects {where} order by created_at desc"), params)
    return rows(result)


@app.post("/api/projects")
async def create_project(payload: ProjectCreate, user_id: str = Depends(require_user), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("""
        insert into public.projects (owner_id, title, description, url, repository_url, status, started_at, completed_at)
        values (:owner_id, :title, :description, :url, :repository_url, :status::public.project_status, :started_at, :completed_at)
        returning *
    """), {**payload.model_dump(), "owner_id": user_id})
    await db.commit()
    return one(result) or {}


@app.get("/api/committee")
async def get_committee(db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    result = await db.execute(text("select * from public.committee_public_view"))
    return rows(result)


@app.get("/api/legacy-comments")
async def list_legacy_comments(db: AsyncSession = Depends(get_db)) -> list[dict[str, Any]]:
    result = await db.execute(text("select * from public.legacy_comments order by created_at desc limit 100"))
    return rows(result)


@app.post("/api/legacy-comments")
async def create_legacy_comment(payload: LegacyCommentCreate, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(text("insert into public.legacy_comments (pseudo, comment) values (:pseudo, :comment) returning *"), payload.model_dump())
    await db.commit()
    return one(result) or {}
