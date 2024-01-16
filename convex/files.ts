import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { api } from "./_generated/api";
import { validateIdentity } from "./lib/authorization";
import { asyncMap, pruneNull } from "convex-helpers";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const all = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx);
    return await ctx.db.query("files").collect();
  },
});

export const findById = query({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx);
    const file = await ctx.db.get(id);
    if (!file) throw new Error("File not found");
    const fileTags = await ctx.db
      .query("fileTags")
      .filter((q) => q.eq(q.field("fileId"), id))
      .collect();
    const tags = await asyncMap(fileTags, async (fileTag) => {
      const tag = await ctx.db.get(fileTag.tagId);
      return { ...tag, fileTag: { ...fileTag } };
    });
    return {
      ...file,
      tags,
    };
  },
});

export const findAllImages = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await validateIdentity(ctx);
    return await ctx.db
      .query("files")
      .filter((q) => q.gte(q.field("type"), "image"))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const searchByTag = query({
  args: { queryTerm: v.string() },
  handler: async (ctx, { queryTerm }) => {
    // search for all tags that match the query term
    const tagResults = await ctx.db
      .query("tags")
      .withSearchIndex("search_name", (q) => q.search("name", queryTerm))
      .collect();

    // get all fileTags that match the search results
    const fileIds = await asyncMap(tagResults, async (tag) => {
      const fileTags = await ctx.db
        .query("fileTags")
        .filter((q) => q.eq(q.field("tagId"), tag._id))
        .collect();
      return fileTags.map((ft) => ft.fileId);
    }); // => id[][]

    // flatten and reduce to unique fileIds
    const flattenedFileIds = fileIds.flat();
    const uniqueFileIds = flattenedFileIds.reduce((acc, cur) => {
      const existingFileId = acc.find((id) => id === cur);
      if (existingFileId) {
        return acc;
      } else {
        return [...acc, cur];
      }
    }, [] as Id<"files">[]);

    // get all files that match the unique fileIds
    const files = await asyncMap(uniqueFileIds, async (fileId) => {
      return await ctx.db.get(fileId);
    });

    // return array of non null files
    return pruneNull(files);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    await validateIdentity(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    uploads: v.array(
      v.object({
        url: v.string(),
        fileName: v.string(),
        mimeType: v.string(),
        type: v.string(),
        size: v.number(),
        dimensions: v.optional(
          v.object({
            width: v.optional(v.number()),
            height: v.optional(v.number()),
          })
        ),
        userId: v.id("users"),
      })
    ),
  },
  handler: async (ctx, { uploads }) => {
    await validateIdentity(ctx);
    // save a file record for each upload
    await asyncMap(
      uploads,
      async ({ url, fileName, mimeType, type, size, dimensions, userId }) => {
        if (!url) throw new Error("Storage file url not found");
        const fileId = await ctx.db.insert("files", {
          url,
          fileName,
          mimeType,
          type,
          size,
          dimensions,
          userId,
        });

        await ctx.scheduler.runAfter(0, api.filesActions.afterSave, {
          fileId,
          machineToken: process.env.CONVEX_MACHINE_TOKEN as Id<"machineTokens">,
        });
      }
    );
    return true;
  },
});

export const edit = mutation({
  args: {
    id: v.id("files"),
    fileName: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { id, fileName, description }) => {
    await validateIdentity(ctx);
    const existingFile = await ctx.db.get(id);
    if (!existingFile) throw new Error("File not found");
    await ctx.db.patch(id, {
      fileName: fileName ?? existingFile.fileName,
      description: description ?? existingFile.description,
    });
    return true;
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

// PRIVATE

export const privatelyGetFile = internalQuery({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.fileId);
  },
});

export const privatelyGetAllFiles = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("files").collect();
  },
});

export const privatelyGetAllImages = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("files")
      .filter((q) => q.gte(q.field("type"), "image"))
      .order("desc")
      .collect();
  },
});

export const privatelyGetLastUploadedImage = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("type"), "image"))
      .order("desc")
      .first();
  },
});

export const privatelySetFileHash = internalMutation({
  args: { fileId: v.id("files"), hash: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.fileId, { hash: args.hash });
    return true;
  },
});
