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

export const searchByName = query({
  args: { queryTerm: v.string() },
  handler: async (ctx, { queryTerm }) => {
    return await ctx.db
      .query("tags")
      .withSearchIndex("search_name", (q) => q.search("name", queryTerm))
      .collect();
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
