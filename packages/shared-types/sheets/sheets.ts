import {z} from "zod";
import { SheetIdSchema } from "../core/ids";
import { OwnershipSchema } from "../core/ownership";
import { SheetVisibilitySchema } from "../enums";
import { TimestampSchema } from "../core/timestamps";

export const CodingSheetSchema = z.object({
    id: SheetIdSchema,
    title: z.string().min(3).max(100).trim(),
    description: z.string().max(500).optional(),
    ownership: OwnershipSchema,
    visibility: SheetVisibilitySchema,
    version: z.number().int().min(1),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    isArchived: z.boolean()
});

export const SheetRefSchema = CodingSheetSchema.pick({
    id: true,
    title: true,
    version: true
});

export const CreateSheetInputSchema = CodingSheetSchema.pick({
    title: true,
    description: true,
    visibility: true
});

export const UpdateSheetInputSchema = CodingSheetSchema.omit({
    id: true,
    ownership: true,
    createdAt: true,
    version: true
}).partial();


// ---types---

export type CodingSheet = z.infer<typeof CodingSheetSchema>
export type SheetRef = z.infer<typeof SheetRefSchema>
export type CreateSheetInput = z.infer<typeof CreateSheetInputSchema>
export type UpdateSheetInput = z.infer<typeof UpdateSheetInputSchema>