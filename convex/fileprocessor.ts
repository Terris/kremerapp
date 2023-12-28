"use node";

import { URL } from "url";
import * as https from "https";
import { imageSize } from "image-size";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const saveImageDimensions = internalAction({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    const file = await ctx.runQuery(internal.files.findByIdAsMachine, {
      id: fileId,
    });
    if (!file) throw new Error("DB File not found");

    if (!file.type.includes("image")) return;

    const imageUrl = await ctx.storage.getUrl(file.storageId);
    if (!imageUrl) throw new Error("Storage file not found");

    const options = new URL(imageUrl);

    return new Promise((resolve, reject) => {
      https
        .get(options, function (response) {
          const chunks: any[] = [];
          response
            .on("data", function (chunk) {
              chunks.push(chunk);
            })
            .on("end", async function () {
              const buffer = Buffer.concat(chunks);
              const dimensions = imageSize(buffer);
              console.log(dimensions);
              await ctx.runMutation(internal.files.updateDimensionsAsMachine, {
                id: fileId,
                dimensions: {
                  width: dimensions.width,
                  height: dimensions.height,
                  orientation: dimensions.orientation,
                },
              });
            });
        })
        .on("error", (e) => {
          reject(`Got error: ${e.message}`);
        });
    });
  },
});
