import {z} from "zod";

export enum TeamRoles {
    Owner = "owner",
    Admin = "admin",
    Member = "member"
}

export const TeamRolesSchema = z.enum(["owner","admin","member"]);

export enum SessionParticipantRole {
    Host = "host",
    participant = "participant",
}

export const SessionParticipantRoleSchema = z.enum(["host", "participant"]);


//---types---
export type SessionParticipantRoleType = z.infer<typeof SessionParticipantRoleSchema>
export type TeamRolesType = z.infer<typeof TeamRolesSchema>