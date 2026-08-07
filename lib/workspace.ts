import db from "@/lib/db";
export async function getCurrentWorkspaceId(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { workspaceId: true },
  });
  return user?.workspaceId;
}