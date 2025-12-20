import { z } from "zod";
import { UserIdSchema, TeamIdSchema } from "./ids";


// > We use z.discriminatedUnion to link 'ownerType' and 'ownerId'.
//   This ensures that if the type is "User", the ID must be a UserId, 
//   and if the type is "Team", the ID must be a TeamId.
 
export const OwnershipSchema = z.discriminatedUnion("ownerType", [
  z.object({
    ownerType: z.literal("user"),
    ownerId: UserIdSchema, // branded as UserId
  }),
  z.object({
    ownerType: z.literal("team"),
    ownerId: TeamIdSchema, // branded as TeamId
  }),
]);


// Inferring the type for use in your application logic
export type Ownership = z.infer<typeof OwnershipSchema>;
