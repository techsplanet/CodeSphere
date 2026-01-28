import { z } from "zod";

/**
 * Atomic authorization capabilities.
 * These are stable identifiers and MUST NOT encode policy.
 */

export enum Permission {
  // platform (global)
  TeamCreate = "team:create",
  TeamDelete = "team:delete",
  PlatformModerateContent = "platform:moderate_content",
  PlatformSuspendUser = "platform:suspend_user",

  // team management
  TeamUpdateSettings = "team:update_settings",
  TeamInviteMember = "team:invite_member",
  TeamRemoveMember = "team:remove_member",
  TeamChangeMemberRole = "team:change_member_role",

  // playlist
  PlaylistCreate = "playlist:create",
  PlaylistEdit = "playlist:edit",
  PlaylistDelete = "playlist:delete",
  PlaylistView = "playlist:view",

  // discussion
  DiscussionCreate = "discussion:create",
  DiscussionModerate = "discussion:moderate",
  DiscussionView = "discussion:view",

  // visibility / analytics
  TeamViewAnalytics = "team:view_analytics",
}

export const PermissionSchema = z.nativeEnum(Permission);

export type PermissionType = z.infer<typeof PermissionSchema>;