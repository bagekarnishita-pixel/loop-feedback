import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function verifyUserRole(request: Request, allowedRoles: string[]) {
  const authHeader = request.headers.get('authorization');
  // Ya agar aap cookies/session use kar rahe hain, toh userId nikal lein:
  const userId = request.headers.get('x-user-id'); // Example header

  if (!userId) {
    return { error: NextResponse.json({ error: 'Unauthorized: Missing User ID' }, { status: 401 }), user: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, workspaceId: true },
  });

  if (!user) {
    return { error: NextResponse.json({ error: 'User not found' }, { status: 404 }), user: null };
  }

  if (!allowedRoles.includes(user.role)) {
    return { 
      error: NextResponse.json({ error: 'Forbidden: You do not have permission to perform this action' }, { status: 403 }), 
      user: null 
    };
  }

  return { error: null, user };
}