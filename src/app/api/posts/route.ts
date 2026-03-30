import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/data/posts';

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newPost = {
    id: String(Date.now()),
    ...body,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(newPost, { status: 201 });
}
