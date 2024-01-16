import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// Private
export const privatelyCreateMachineToken = internalMutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const token = await ctx.db.insert("machineTokens", { name });
    return token;
  },
});

export const privatelyGetMachineToken = internalQuery({
  args: { id: v.id("machineTokens") },
  handler: async (ctx, args) => {
    const token = await ctx.db.get(args.id);
    return token;
  },
});
