import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const all = query({
  args: {},
  handler: async (ctx, args) => {
    await validateIdentity(ctx);
    return await ctx.db.query("tags").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await validateIdentity(ctx);
    return await ctx.db.insert("tags", args);
  },
});
