import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    isAdmin: v.optional(v.boolean()),
  }).index("by_token", ["tokenIdentifier"]),
  files: defineTable({
    storageId: v.id("_storage"),
    fileName: v.string(),
    type: v.string(),
    size: v.number(),
  }),
});
