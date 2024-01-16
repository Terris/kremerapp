import { asyncMap } from "convex-helpers";
import { internalMutation } from "./_generated/server";
import { api } from "./_generated/api";

// run a migration that saves hash for each image that doesn't have it
// export const imageHashMigration = internalMutation({
//   args: {},
//   handler: async (ctx) => {
//     const unhashedFiles = await ctx.db
//       .query("files")
//       .filter((q) =>
//         q.and(q.eq(q.field("type"), "image"), q.eq(q.field("hash"), undefined))
//       )
//       .collect();
//     console.log("unhashedFiles", unhashedFiles);
//     await asyncMap(unhashedFiles, async (file) => {
//       console.log("scheduling hash migration for ", file._id);
//       await ctx.scheduler.runAfter(0, api.filesActions.afterSave, {
//         fileId: file._id,
//       });
//     });
//     return true;
//   },
// });
