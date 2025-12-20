import {z} from "zod";

export const UserStatusSchema = z.enum(["active","suspended"]);



//  ---types---
export type UserStatus = z.infer<typeof UserStatusSchema>
