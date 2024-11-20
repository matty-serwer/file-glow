import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";

/**
 * Generates a URL for file upload
 * @returns {Promise<string>} The generated upload URL
 */
export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("You must be signed in to upload a file");
  }

  return await ctx.storage.generateUploadUrl();
});

/**
 * Checks if a user has access to an organization
 * @param {QueryCtx | MutationCtx} ctx - The context object
 * @param {string} tokenIdentifier - The user's token identifier
 * @param {string} orgId - The organization ID to check access for
 * @returns {Promise<boolean>} Whether the user has access to the organization
 */
async function hasAccessToOrganization(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string) {

  const user = await getUser(ctx, tokenIdentifier);

  return user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
}

/**
 * Creates a new file entry in the database
 */
export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypes,
    url: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be signed in to upload a file");
    }

    const hasAccess = await hasAccessToOrganization(ctx, identity.tokenIdentifier, args.orgId);

    if (!hasAccess) {
      throw new ConvexError("You are not authorized to upload files to this organization");
    }

    await ctx.db.insert('files', {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type,
      url: args.url,
    });
  }
});

/**
 * Retrieves files for a given organization
 */

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
    type: v.optional(fileTypes),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrganization(ctx, identity.tokenIdentifier, args.orgId);

    if (!hasAccess) {
      return [];
    }

    let files = await ctx.db
      .query("files")
      .withIndex("by_organization", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    if (query) {
      files = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // if (args.favorites) {
    //   const favorites = await ctx.db
    //     .query("favorites")
    //     .withIndex("by_userId_orgId_fileId", (q) =>
    //       q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
    //     )
    //     .collect();

    //   files = files.filter((file) =>
    //     favorites.some((favorite) => favorite.fileId === file._id)
    //   );
    // }

    // if (args.deletedOnly) {
    //   files = files.filter((file) => file.shouldDelete);
    // } else {
    //   files = files.filter((file) => !file.shouldDelete);
    // }

    // if (args.type) {
    //   files = files.filter((file) => file.type === args.type);
    // }

    const filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.fileId),
      }))
    );

    return filesWithUrl;
  },
});

/**
 * Deletes a file from the database
 */
export const deleteFile = mutation({
  args: { fileId: v.id('files') },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You do not have access to this file");
    }

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("File not found");
    }

    const hasAccess = await hasAccessToOrganization(ctx, identity.tokenIdentifier, file.orgId);

    if (!hasAccess) {
      throw new ConvexError("You do not have access to delete this file");
    }

    // await ctx.storage.delete(file.fileId);
    await ctx.db.delete(args.fileId)
  }
})
