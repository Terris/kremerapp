import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

export const findByFileId = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    return await ctx.db
      .query("fileTags")
      .filter((q) => q.eq(q.field("fileId"), fileId))
      .collect();
  },
});

export const setFileTag = mutation({
  args: { fileId: v.id("files"), tagName: v.string() },
  handler: async (ctx, { fileId, tagName }) => {
    validateIdentity(ctx);
    const existingTag = await ctx.db
      .query("tags")
      .filter((q) => q.eq(q.field("name"), tagName))
      .first();
    if (existingTag) {
      return await ctx.db.insert("fileTags", {
        fileId,
        tagId: existingTag._id,
      });
    } else {
      const newTagId = await ctx.db.insert("tags", { name: tagName });
      return await ctx.db.insert("fileTags", {
        fileId,
        tagId: newTagId,
      });
    }
  },
});
