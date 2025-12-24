import {z} from "zod";

export enum UserStatus{
      Active = "acitve",
      Suspended = "suspended"
};

export const UserStatusSchema = z.enum(["active","suspended"]);



//  ---types---
export type UserStatusType = z.infer<typeof UserStatusSchema>
