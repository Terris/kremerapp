import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

export const all = query({
  args: {},
  handler: async (ctx, args) => {
    await validateIdentity(ctx);
    const files = await ctx.db.query("files").collect();
    return asyncMap(files, async (file) => ({
      ...file,
      url: await ctx.storage.getUrl(file.storageId),
    }));
  },
});

export const findById = query({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    const file = await ctx.db.get(id);
    if (!file) throw new Error("File not found");
    return {
      ...file,
      url: await ctx.storage.getUrl(file.storageId),
    };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    await validateIdentity(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveStorageIds = mutation({
  args: {
    uploads: v.array(
      v.object({
        storageId: v.id("_storage"),
        fileName: v.string(),
        type: v.string(),
        size: v.number(),
      })
    ),
  },
  handler: async (ctx, { uploads }) => {
    await validateIdentity(ctx);
    await asyncMap(uploads, ({ storageId, fileName, type, size }) => {
      return ctx.db.insert("files", {
        storageId,
        fileName,
        type,
        size,
      });
    });
  },
});

export const deleteById = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    await ctx.db.delete(id);
    return true;
  },
});
