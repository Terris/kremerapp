import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const all = query({
  args: {},
  handler: async (ctx, args) => {
    validateIdentity(ctx, { requireAdminRole: true });
    const comparisons = await ctx.db.query("imageComparisons").collect();
    const comparisonsWithFiles = asyncMap(comparisons, async (comparison) => {
      const image1 = await ctx.db.get(comparison.image1Id);
      const image2 = await ctx.db.get(comparison.image2Id);

      if (!image1 || !image2) {
        throw new Error(
          `Image comparison ${comparison._id} refers to a file that does not exist`
        );
      }

      return {
        ...comparison,
        image1,
        image2,
      };
    });
    return comparisonsWithFiles;
  },
});

export const findAllCloseComparisons = query({
  args: { maxDistance: v.optional(v.number()) },
  handler: async (ctx, args) => {
    validateIdentity(ctx, { requireAdminRole: true });
    const comparisons = await ctx.db
      .query("imageComparisons")
      .filter((q) => q.lt(q.field("distance"), args.maxDistance || 1))
      .collect();
    const comparisonsWithFiles = asyncMap(comparisons, async (comparison) => {
      const image1 = await ctx.db.get(comparison.image1Id);
      const image2 = await ctx.db.get(comparison.image2Id);

      if (!image1 || !image2) {
        throw new Error(
          `Image comparison ${comparison._id} refers to a file that does not exist`
        );
      }

      return {
        ...comparison,
        image1,
        image2,
      };
    });
    return comparisonsWithFiles;
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

export const privatelyGetImageComparisonsByImageId = internalQuery({
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
