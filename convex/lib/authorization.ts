import { QueryCtx } from "../_generated/server";

export async function validateIdentity(
  ctx: QueryCtx,
  options?: { requireAdminRole?: boolean }
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthenticated call to mutation");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();

  if (!user) {
    throw new Error("Unauthenticated call to mutation");
  }

  if (options?.requireAdminRole && !user.isAdmin) {
    throw new Error("Admin role required to call mutation");
  }

  return { identity, user };
}
