import { NextResponse } from 'next/server';
import { conversations, messages } from '@/data/mentorships';

export async function GET() {
  return NextResponse.json({ conversations, messages });
}
