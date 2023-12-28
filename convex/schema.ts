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
    mimeType: v.string(),
    type: v.string(),
    size: v.number(),
    dimensions: v.optional(
      v.object({
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        orientation: v.optional(v.number()),
      })
    ),
    description: v.optional(v.string()),
  }),
});
