import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// PRIVATE
export const privatelyGetLastJobRunByName = internalQuery({
  args: { jobName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cronJobRuns")
      .filter((q) => q.eq(q.field("jobName"), args.jobName))
      .order("desc")
      .first();
  },
});

export const privatelyInsertCronJobRun = internalMutation({
  args: { jobName: v.string(), result: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.insert("cronJobRuns", {
      jobName: args.jobName,
      result: args.result,
    });
    return true;
  },
});
