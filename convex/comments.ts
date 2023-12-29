import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const findById = query({
  args: { id: v.id("comments") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    const comment = await ctx.db.get(id);
    if (!comment) return null;
    const commentUser = await ctx.db.get(comment.userId);
    return { ...comment, user: commentUser };
  },
});

export const findByFileId = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    await validateIdentity(ctx);
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("fileId"), fileId))
      .order("desc")
      .collect();
    const commentsWithUsers = await asyncMap(comments, async (comment) => {
      const commentUser = await ctx.db.get(comment.userId);
      return { ...comment, user: commentUser };
    });
    return commentsWithUsers;
  },
});

export const createByFileId = mutation({
  args: { fileId: v.id("files"), userId: v.id("users"), text: v.string() },
  handler: async (ctx, { fileId, userId, text }) => {
    await validateIdentity(ctx);
    return await ctx.db.insert("comments", {
      fileId,
      userId,
      text,
    });
  },
});
