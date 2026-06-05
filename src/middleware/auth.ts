import { auth } from "@/lib/auth";
import { AuthenticationError, AuthorizationError } from "@/types";

export async function requireAuth() {
  const session = await auth();

  if (!session || !session.user) {
    throw new AuthenticationError("Please sign in to access this resource");
  }

  return session;
}

export async function requirePermission(resource: string, action: string) {
  const session = await requireAuth();

  const user = session.user as any;

  if (!user.role) {
    throw new AuthorizationError("User has no role assigned");
  }

  const hasPermission = user.role.permissions.some(
    (p: any) => p.resource === resource && p.action === action
  );

  if (!hasPermission) {
    throw new AuthorizationError(`You don't have permission to ${action} ${resource}`);
  }

  return session;
}

export async function requireRole(...roleNames: string[]) {
  const session = await requireAuth();

  const user = session.user as any;

  if (!user.role || !roleNames.includes(user.role.name)) {
    throw new AuthorizationError("Insufficient permissions");
  }

  return session;
}
