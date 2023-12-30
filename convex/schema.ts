import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    isAdmin: v.optional(v.boolean()),
  }).index("by_token", ["tokenIdentifier"]),
  files: defineTable({
    url: v.string(),
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
  tags: defineTable({
    name: v.string(),
  }).searchIndex("search_name", { searchField: "name" }),
  fileTags: defineTable({
    fileId: v.id("files"),
    tagId: v.id("tags"),
  })
    .index("by_file", ["fileId"])
    .index("by_tag", ["tagId"]),
  comments: defineTable({
    fileId: v.id("files"),
    userId: v.id("users"),
    text: v.string(),
  }).index("by_file", ["fileId"]),
});
