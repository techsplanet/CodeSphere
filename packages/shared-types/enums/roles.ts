import {z} from "zod";

export const TeamRolesSchema = z.enum(["owner","admin","member"]);

export const SessionParticipantRoleSchema = z.enum(["host", "participant"]);


//---types---
export type SessionParticipantRole = z.infer<typeof SessionParticipantRoleSchema>
export type TeamRoles = z.infer<typeof TeamRolesSchema>