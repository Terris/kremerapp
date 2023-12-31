import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { capitalizeEachWord } from "./lib/utils";

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

    const formattedTagName = capitalizeEachWord(tagName);

    const existingTag = await ctx.db
      .query("tags")
      .filter((q) => q.eq(q.field("name"), formattedTagName))
      .first();
    if (existingTag) {
      return await ctx.db.insert("fileTags", {
        fileId,
        tagId: existingTag._id,
      });
    } else {
      const newTagId = await ctx.db.insert("tags", { name: formattedTagName });
      return await ctx.db.insert("fileTags", {
        fileId,
        tagId: newTagId,
      });
    }
  },
});

export const deleteById = mutation({
  args: { id: v.id("fileTags") },
  handler: async (ctx, { id }) => {
    validateIdentity(ctx);
    await ctx.db.delete(id);
    return true;
  },
});
