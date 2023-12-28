import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
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

export const findAllImages = query({
  args: {},
  handler: async (ctx, args) => {
    await validateIdentity(ctx);
    const files = await ctx.db
      .query("files")
      .filter((q) => q.gte(q.field("type"), "image"))
      .collect();
    return asyncMap(files, async (file) => ({
      ...file,
      url: await ctx.storage.getUrl(file.storageId),
    }));
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    await validateIdentity(ctx);
    const urls = await ctx.storage.generateUploadUrl();

    return urls;
  },
});

export const saveStorageIds = mutation({
  args: {
    uploads: v.array(
      v.object({
        storageId: v.id("_storage"),
        fileName: v.string(),
        mimeType: v.string(),
        type: v.string(),
        size: v.number(),
      })
    ),
  },
  handler: async (ctx, { uploads }) => {
    await validateIdentity(ctx);
    // save a file record for each upload
    const fileIds = await asyncMap(
      uploads,
      ({ storageId, fileName, mimeType, type, size }) => {
        return ctx.db.insert("files", {
          storageId,
          fileName,
          mimeType,
          type,
          size,
        });
      }
    );
    // schedule an internal task to save the image dimensions
    await asyncMap(fileIds, (fileId) => {
      return ctx.scheduler.runAfter(
        0,
        internal.fileprocessor.saveImageDimensions,
        {
          fileId,
        }
      );
    });
  },
});

export const deleteById = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    const file = await ctx.db.get(id);
    if (!file) throw new Error("File not found");
    await ctx.db.delete(id);
    await ctx.storage.delete(file.storageId);
    return true;
  },
});

/*
  INTERNAL FUNCTIONS - not callable by clients 
*/
export const findByIdAsMachine = internalQuery({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    const file = await ctx.db.get(id);
    if (!file) throw new Error("File not found");
    return {
      ...file,
      url: await ctx.storage.getUrl(file.storageId),
    };
  },
});

export const updateDimensionsAsMachine = internalMutation({
  args: {
    id: v.id("files"),
    dimensions: v.object({
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      orientation: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { id, dimensions }) => {
    await ctx.db.patch(id, { dimensions });
    return true;
  },
});
