import { NextResponse } from 'next/server';
import { notifications } from '@/data/notifications';

export async function GET() {
  return NextResponse.json(notifications);
}
