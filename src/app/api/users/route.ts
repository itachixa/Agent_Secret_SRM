import { NextResponse } from 'next/server';
import { users } from '@/data/users';

export async function GET() {
  return NextResponse.json(users);
}
