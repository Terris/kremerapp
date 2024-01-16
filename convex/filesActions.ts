"use node";

import Jimp from "jimp";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { validateMachineToken } from "./lib/authorization";
import { asyncMap } from "convex-helpers";
import { createUniqueCombinations } from "./lib/utils";

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
  args: {
    machineToken: v.string(),
    pageSize: v.number(),
    cursor: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    await validateMachineToken(ctx, args.machineToken);

    // const lastUploadedImage = await ctx.runQuery(
    //   internal.files.privatelyGetLastUploadedImage
    // );
    // const lastJobRun = await ctx.runQuery(
    //   internal.cronJobRuns.privatelyGetLastJobRunByName,
    //   { jobName: "compare_images" }
    // );

    // if (
    //   !!lastUploadedImage &&
    //   !!lastJobRun &&
    //   lastUploadedImage?._creationTime < lastJobRun?._creationTime
    // ) {
    //   await ctx.runMutation(internal.cronJobRuns.privatelyInsertCronJobRun, {
    //     jobName: "compare_images",
    //     result: `No new images to compare`,
    //   });
    //   return;
    // }

    const allImages = await ctx.runQuery(
      internal.files.privatelyGetAllPaginatedImages,
      {
        paginationOpts: {
          numItems: args.pageSize,
          cursor: args.cursor ?? null,
        },
      }
    );

    const allExistingSimilarImages = await ctx.runQuery(
      internal.imageComparisons.privatelyGetAllImageComparisons
    );

    const allImageIds = allImages.page.map((image) => image._id);
    const imageSetsToCompare = createUniqueCombinations(allImageIds);

    const filteredImagesToCompare = imageSetsToCompare.filter((imageSet) => {
      // remove sets that are already in the imageComparisons table
      const image1Id = imageSet[0];
      const image2Id = imageSet[1];
      const dbHasExistingSet = allExistingSimilarImages.some(
        (existingImageSet) =>
          (existingImageSet.image1Id === image1Id &&
            existingImageSet.image2Id === image2Id) ||
          (existingImageSet.image1Id === image2Id &&
            existingImageSet.image2Id === image1Id)
      );
      return !dbHasExistingSet;
    });
    const comparedImages = await asyncMap(
      filteredImagesToCompare,
      async (imageSet) => {
        const image1 = allImages.page.find(
          (image) => image._id === imageSet[0]
        );
        const image2 = allImages.page.find(
          (image) => image._id === imageSet[1]
        );

        if (!image1 || !image2) return;

        const jimpImage1 = await Jimp.read(image1.url);
        const jimpImage2 = await Jimp.read(image2.url);

        const distance = Jimp.distance(jimpImage1, jimpImage2);
        const diff = Jimp.diff(jimpImage1, jimpImage2);

        await ctx.runMutation(
          internal.imageComparisons.privatelyInsertImageComparisons,
          {
            image1Id: image1._id,
            image2Id: image2._id,
            distance,
            diffPercent: diff.percent,
          }
        );
      }
    );

    await ctx.runMutation(internal.cronJobRuns.privatelyInsertCronJobRun, {
      jobName: "compare_images",
      result: `Compared ${comparedImages.length} images`,
    });

    if (allImages.continueCursor) {
      await ctx.scheduler.runAfter(5000, api.filesActions.compareImages, {
        machineToken: process.env.CONVEX_MACHINE_TOKEN!,
        pageSize: 2,
        cursor: allImages.continueCursor,
      });
    }

    return true;
  },
});
