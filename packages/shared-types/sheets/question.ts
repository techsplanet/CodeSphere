import {z} from "zod";
import { QuestionIdSchema, SheetIdSchema } from "../core/ids";
import { DifficultySchema } from "../enums";
import { TimestampSchema } from "../core/timestamps";


export const SheetQuestionSchema =  z.object({
    id: QuestionIdSchema,
    sheetId: SheetIdSchema,
    source: z.enum(["leetcode"]),
    sourceQuestionId: z.string(),
    difficulty: DifficultySchema,
    order: z.number().int().gte(1),
    addedAt: TimestampSchema
});

export const SheetQuestionRefSchema = SheetQuestionSchema.pick({
    id: true,
    source: true,
    sourceQuestionId: true,
    difficulty: true,
    order: true
});

export const AddQuestionInputSchema = SheetQuestionSchema.omit({
    id: true,
    addedAt: true
});


// ---type---

export type SheetQuestion = z.infer<typeof SheetQuestionSchema>;
export type SheetQuestionRef = z.infer<typeof SheetQuestionRefSchema>;
export type AddQuestionInput = z.infer<typeof AddQuestionInputSchema>;

