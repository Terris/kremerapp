"use node";

import Jimp from "jimp";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const afterSave = action({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.runQuery(internal.files.privatelyGetFile, {
      fileId: args.fileId,
    });
    const fileUrl = file?.url;
    if (!fileUrl) throw new Error("File not found");
    // Set Image Hash
    if (file.type === "image") {
      const image = await Jimp.read(fileUrl);
      const imageHash = image.hash();
      await ctx.runMutation(internal.files.privatelySetFileHash, {
        fileId: args.fileId,
        hash: imageHash,
      });
    }
    return true;
  },
});
