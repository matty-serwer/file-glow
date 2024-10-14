import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {

  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("You must be signed in to upload a file");
  }

  return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrganization(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  organizationId: string) {

  const user = await getUser(ctx, tokenIdentifier);

  return user.orgIds.includes(organizationId) || user.tokenIdentifier.includes(organizationId);
}


export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    organizationId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    // console.log(identity);

    if (!identity) {
      throw new ConvexError("You must be signed in to upload a file");
    }

    const hasAccess = await hasAccessToOrganization(ctx, identity.tokenIdentifier, args.organizationId);

    if (!hasAccess) {
      throw new ConvexError("You are not authorized to upload files to this organization");
    }

    await ctx.db.insert('files', {
      name: args.name,
      organizationId: args.organizationId,
      fileId: args.fileId,
    });
  }
});

export const getFiles = query({
  args: {
    organizationId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrganization(ctx, identity.tokenIdentifier, args.organizationId);

    if (!hasAccess) {
      return [];
    }

    return await ctx.db.query('files').withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId)).collect();
  }
})  