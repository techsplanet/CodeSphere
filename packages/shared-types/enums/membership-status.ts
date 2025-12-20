import {z} from "zod";

export const MembershipStatusSchema = z.enum(["invited", "active", "removed"]);


export type MembershipStatus = z.infer<typeof MembershipStatusSchema>