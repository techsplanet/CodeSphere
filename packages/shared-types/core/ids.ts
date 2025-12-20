import { z } from "zod";


//  > Define the "Base" validation logic once.
//  > This ensures that if you ever need to change ID rules 
//  > (e.g., changing .nonempty() to .uuid()), you only do it here.
 
const baseId = z.string().trim().min(1);


//  > Create a generic factory function to generate branded IDs.
//  > The generic 'T' ensures the brand name is unique for each call.
 
function createIdSchema<T extends string>() {
  return baseId.brand<T>();
}

//  > Define specialized schemas using the factory
export const UserIdSchema       = createIdSchema<"UserId">();
export const TeamIdSchema       = createIdSchema<"TeamId">();
export const SheetIdSchema      = createIdSchema<"SheetId">();
export const SessionIdSchema    = createIdSchema<"SessionId">();
export const QuestionIdSchema   = createIdSchema<"QuestionId">();
export const SubmissionIdSchema = createIdSchema<"SubmissionId">();



//  > Infer the types to avoid redundancy
export type UserId       = z.infer<typeof UserIdSchema>;
export type TeamId       = z.infer<typeof TeamIdSchema>;
export type SheetId      = z.infer<typeof SheetIdSchema>;
export type SessionId    = z.infer<typeof SessionIdSchema>;
export type QuestionId   = z.infer<typeof QuestionIdSchema>;
export type SubmissionId = z.infer<typeof SubmissionIdSchema>;
