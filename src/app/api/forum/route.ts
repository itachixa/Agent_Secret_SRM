import { NextResponse } from 'next/server';
import { forumQuestions } from '@/data/forum';

export async function GET() {
  return NextResponse.json(forumQuestions);
}
