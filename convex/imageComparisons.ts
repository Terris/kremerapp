import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const all = query({
  args: {},
  handler: async (ctx, args) => {
    validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.query("imageComparisons").collect();
  },
});

export const findAllCloseComparisons = query({
  args: {},
  handler: async (ctx, args) => {
    validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db
      .query("imageComparisons")
      .filter((q) => q.lt(q.field("distance"), 1))
      .collect();
  },
});

// PRIVATE
export const privatelyInsertImageComparisons = internalMutation({
  args: {
    image1Id: v.id("files"),
    image2Id: v.id("files"),
    distance: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("imageComparisons", {
      image1Id: args.image1Id,
      image2Id: args.image2Id,
      distance: args.distance,
    });
    return true;
  },
});

export const privatelyGetAllImageComparisons = internalQuery({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db.query("imageComparisons").collect();
  },
});

export const privatelyGetImageComparisons = internalQuery({
  args: { image1Id: v.id("files"), image2Id: v.id("files") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("imageComparisons")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("image1Id"), args.image1Id),
            q.eq(q.field("image2Id"), args.image2Id)
          ),
          q.and(
            q.eq(q.field("image1Id"), args.image2Id),
            q.eq(q.field("image2Id"), args.image1Id)
          )
        )
      )
      .collect();
  },
});
