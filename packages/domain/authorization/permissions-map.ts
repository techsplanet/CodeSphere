import { SystemRole, Permission, TeamRolesType } from "../../shared-types";

/**
 * Team-scoped role → permissions mapping.
 * This is POLICY, expressed as DATA.
 */
export const TEAM_ROLE_PERMISSIONS: Record<
  TeamRolesType,
  readonly Permission[]
> = {
  owner: [
    Permission.TeamUpdateSettings,
    Permission.TeamInviteMember,
    Permission.TeamRemoveMember,
    Permission.TeamChangeMemberRole,

    Permission.PlaylistCreate,
    Permission.PlaylistEdit,
    Permission.PlaylistDelete,
    Permission.PlaylistView,

    Permission.DiscussionCreate,
    Permission.DiscussionModerate,
    Permission.DiscussionView,

    Permission.TeamViewAnalytics,
  ],

  admin: [
    Permission.TeamUpdateSettings,
    Permission.TeamInviteMember,
    Permission.TeamRemoveMember,
    Permission.TeamChangeMemberRole,

    Permission.PlaylistCreate,
    Permission.PlaylistEdit,
    Permission.PlaylistDelete,
    Permission.PlaylistView,

    Permission.DiscussionCreate,
    Permission.DiscussionModerate,
    Permission.DiscussionView,

    Permission.TeamViewAnalytics,
  ],

  member: [
    Permission.PlaylistCreate,
    Permission.PlaylistEdit,
    Permission.PlaylistView,

    Permission.DiscussionCreate,
    Permission.DiscussionView,

    Permission.TeamViewAnalytics,
  ],

  viewer: [
    Permission.PlaylistView,
    Permission.DiscussionView,
    Permission.TeamViewAnalytics,
  ],
};

/**
 * System role → global permissions mapping.
 */
export const SYSTEM_ROLE_PERMISSIONS: Record<
  SystemRole,
  readonly Permission[]
> = {
  platform_admin: [
    Permission.TeamDelete,
    Permission.PlatformModerateContent,
    Permission.PlatformSuspendUser,
  ],

  platform_moderator: [
    Permission.PlatformModerateContent,
  ],
};