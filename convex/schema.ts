import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({
    name: v.string(),
    organizationId: v.string(),
  })
    .index("by_organization", ["organizationId"]),
});