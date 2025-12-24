import {z} from "zod";

export enum MembershipStatus {
    Invited = "invited",
    Active = "acitve",
    Removed = "removed"
}

export const MembershipStatusSchema = z.enum(["invited", "active", "removed"]);

export type MembershipStatusType = z.infer<typeof MembershipStatusSchema>