import {z} from "zod";
import { QuestionIdSchema, SessionIdSchema, SubmissionIdSchema, UserIdSchema } from "../core/ids";
import { LanguageSchema, VerdictSchema } from "../enums";
import { TimestampSchema } from "../core/timestamps";

export const SubmissionSchema = z.object({
    id: SubmissionIdSchema,
    sessionId: SessionIdSchema,
    userId: UserIdSchema,
    questionId: QuestionIdSchema,
    language: LanguageSchema,
    verdict : VerdictSchema,
    submittedAt: TimestampSchema
});

export const CreateSubmissionInputSchema = SubmissionSchema.pick({
    userId: true,
    sessionId: true,
    questionId: true,
    language: true
});


// ---types---

export type Submission = z.infer<typeof SubmissionSchema>;
export type CreateSubmissionInput = z.infer<typeof CreateSubmissionInputSchema>