"use node";

import Jimp from "jimp";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { validateMachineToken } from "./lib/authorization";

export const afterSave = action({
  args: { fileId: v.id("files"), machineToken: v.string() },
  handler: async (ctx, args) => {
    await validateMachineToken(ctx, args.machineToken);
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

export const compareImages = action({
  args: { machineToken: v.string() },
  handler: async (ctx, args) => {
    await validateMachineToken(ctx, args.machineToken);
    return true;
  },
});
