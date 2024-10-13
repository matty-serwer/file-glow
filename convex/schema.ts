import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({
    name: v.string(),
    organizationId: v.string(),
  })
    .index("by_organization", ["organizationId"]),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string()),
  }).index("by_token_identifier", ["tokenIdentifier"]),
});
