import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { QueryCtx, ActionCtx } from "../_generated/server";

export async function validateIdentity(
  ctx: QueryCtx,
  options?: { requireAdminRole?: boolean }
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  if (options?.requireAdminRole && !user.isAdmin) {
    throw new Error("Admin role required");
  }

  return { identity, user };
}

export async function validateMachineToken(
  ctx: ActionCtx,
  machineToken: string
) {
  console.log(machineToken);
  const validMachineToken = await ctx.runQuery(
    internal.machineTokens.privatelyGetMachineToken,
    {
      id: machineToken as Id<"machineTokens">,
    }
  );
  if (!validMachineToken) throw new Error("Invalid machine token");
}
